import * as Toml from "https://deno.land/std@0.208.0/toml/mod.ts";
import os from "https://deno.land/x/dos@v0.11.0/mod.ts";
import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";
import moment from "npm:moment";
export const generateUrls = async (url, pageStart, pageEnd,type) => {
    try {
      
        const regex = /toho\/S\/([A-Z0-9]{0,4})([0-9]{3,}).(\w+)/gm;
       let groups =  regex.exec(url)
      
    //    console.log(groups)
        let param1=groups[1].trim()

        let baseUrl=`http://kanji.zinbun.kyoto-u.ac.jp/db-machine/toho/${type}/${param1}`
        console.log(baseUrl)

        let pages = pageEnd + 1;
        let urls = []
        for (var i = pageStart; i < pages; i++) {
            let numStr=i+''
          let url =
            `${baseUrl}${numStr.padStart(4,"0")}.${groups[3]} `;
      
       
          urls.push({ page: i, url: url });

        }

        console.log(urls)

        return urls;
    } catch (error) {
        console.log(error);
    }
};
const downLoad = async (url, page, config) => {
    let startTime = config?.downLoad?.rate?.startTime;
    let endTime = config?.downLoad?.rate?.endTime;
    let timeout = config?.downLoad?.timeout;
  
    if (startTime > 0 && endTime > 0 && endTime >= startTime) {
      await sleepRandomAmountOfSeconds(startTime, endTime);
    }
  
    // const urlParam = new URL(url);
    // const page = urlParam.searchParams.get("page") || "";
    console.log(`正下载第${page}页`);
    console.log(url);
    const response = await fetch(url, {
      method: "GET",
      // responseType: 'stream'
      headers: {
        // "Content-Type":"image/jpeg"
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
  
        "Host": "babel.hathitrust.org",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
        "Cookie":
          '_ga=GA1.3.1587801283.1686444147; PCID=4e8d9423-8aaa-2140-a16b-f354bfe01e7e-1686444147371; _gid=GA1.3.1925364011.1699061364; WMONID=G3nF3nSQK-4; JSESSIONID="GW9Ufy6SdV8TQDlPf9_IEI74l9DrzAsxjclNE0eG.VWWAS2:tv-4"',
      },
      signal: AbortSignal.timeout(1000 * parseInt(timeout)),
    });
  
    let resHeaders = response.headers;
    let mime = resHeaders.get("content-type");
  
    if (mime == "image/jpeg") {
      mime = "jpeg";
    } else {
      console.log(mime);
      // console.log(await response.text())
      throw "未知错误content-type为" + mime;
    }
  
    let read = response.body;
  
    const file = await Deno.open(`${"kyFiles"}/${page}.${mime}`, {
      create: true,
      write: true,
    });
  
    await read?.pipeTo(file.writable);
  };

export const downLoadImages = async (urls) => {
    let config = null;
  
    if (await checkFileExists("kyFiles/kyConfig.toml")) {
      config = Toml.parse(Deno.readTextFileSync("kyFiles/kyConfig.toml"));
    } else {
      config = {
        downLoad: {
          timeout: 60,
          rate: {
            startTime: 0,
            endTime: 0,
          },
        },
      };
    }
  
    console.log("下载配置\n");
    console.info(config);
  
    for (var i = 0; i < urls.length; i++) {
      try {
        await downLoad(urls[i].url, urls[i].page, config);
      } catch (error) {
        console.log(error);
        await Deno.writeTextFile(
          "kyFiles/undownLoad.txt",
          JSON.stringify({ url: urls[i].url, page: urls[i].page }) + "\n",
          { append: true },
        );
      }
    }
  };

export const downLoaddezoomify = async () => {
    console.log("下载dezoomify-rs....");
    const client = Deno.createHttpClient({ http2: true });

    const platform = os.platform(); // return the os platform for eg: windows, linux, darwin on mac ..
    let url =
        "https://mirror.ghproxy.com/https://github.com/lovasoa/dezoomify-rs/releases/download/v2.11.2/dezoomify-rs.exe";
    if (platform == "linux") {
        url =
            "https://mirror.ghproxy.com/https://github.com/lovasoa/dezoomify-rs/releases/download/v2.12.0/dezoomify-rs-linux.tgz";
    }
    if (platform == "mac") {
        url =
            "https://mirror.ghproxy.com/https://github.com/lovasoa/dezoomify-rs/releases/download/v2.12.0/dezoomify-rs-macos.tgz";
    }

    if (platform == "darwin") {
        throw "不支持darwin";
    }
    const response = await fetch(
        url,
        {
            method: "GET",
            // responseType: 'stream'
            headers: {
                "Accept":
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",

                // "Host": "ttps://ostasien.digitale-sammlungen.de/",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
                //   "Cookie": `${config?.headers?.Cookie}`,
            },
            client,
        },
    );

    let resHeaders = response.headers;

    // let mime = resHeaders.get("content-type");
    let disposition = resHeaders.get("Content-Disposition");

    let fileName = disposition.split("=")[1];
    console.log(fileName);

    // if (mime == "application/octet-stream") {
    //   mime = "exe";
    // } else {
    //   throw "下载失败" + mime;
    // }

    let read = response.body;

    const file = await Deno.open(`./${fileName}`, {
        create: true,
        write: true,
    });

    await read?.pipeTo(file.writable);

    // file.close();
    await Deno.mkdir("kyFiles", { recursive: true });
    if (platform == "linux") {
        console.log("解压linux");
        // await tgz.uncompress("./dezoomify-rs-linux.tgz", "./kyFiles");
        const src = await Deno.open(`./${fileName}`, { read: true });
        const dest = await Deno.open("./dezoomify-rs", {
            create: true,
            write: true,
        });
        await src.readable
            .pipeThrough(new DecompressionStream("gzip"))
            .pipeTo(dest.writable);

        const cmd = new Deno.Command("sh", {
            args: ["-c", "ls"],
            stdout: "piped",
            stderr: "inherit",
            // cwd: "kyFiles",
        });
        const output = await cmd.output();
        const logs = new TextDecoder().decode(output.stdout).trim();
        console.log(logs);
    }

    if (platform == "mac") {
        console.log("解压mac");
        // await tgz.uncompress("./dezoomify-rs-linux.tgz", "./kyFiles");
        const src = await Deno.open("./dezoomify-rs-macos.tgz", { read: true });
        const dest = await Deno.open("./dezoomify-rs", {
            create: true,
            write: true,
        });
        await src.readable
            .pipeThrough(new DecompressionStream("gzip"))
            .pipeTo(dest.writable);
    }

    client.close();
    console.log("已下载dezoomify-rs....");
};
async function checkFileExists(path) {
    try {
        await Deno.lstat(path);

        return true;
    } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) {
            throw err;
        }

        return false;
    }
}
export const config = async () => {
    try {
        let headers = {
            Cookie: "",
        };
        let downLoad = {
            rate: {
                startTime: 0,
                endTime: 0,
            },
        };
        let help = {
            headers: {
                Cookie: "",
            },
            downLoad: {
                rate: {
                    remark: "设置下载时间间隔,默认范围为0秒随机设置,默认不开启",
                    startTime: "下载间隔时间(秒)的开始值,类型为数字,",
                    endTime: "下载间隔时间(秒)的结束值,类型为数字",
                },
            },
        };
        if (await checkFileExists("kyFiles/kyConfig.toml")) {
            Deno.writeTextFileSync(
                "kyFiles/kyConfig.toml",
                Toml.stringify({ headers: headers, downLoad: downLoad, help: help }),
            );
        } else {
            await Deno.mkdir("kyFiles", { recursive: true });
            // await downLoaddezoomify()
            Deno.writeTextFileSync(
                "kyFiles/kyConfig.toml",
                Toml.stringify({ headers: headers, downLoad: downLoad, help: help }),
            );
        }

        console.log("文件已生成:kyFiles/rmConfig.toml");
    } catch (error) {
        console.log(error);
    }
};

export const undownLoad = async () => {
    const urls = [];
    try {
        // const text = await Deno.readTextFile("files/undownLoa2d.txt");

        if (await checkFileExists("kyFiles/undownLoad.txt")) {
            const f = await Deno.open("kyFiles/undownLoad.txt", {
                read: true,
                write: true,
            });
            for await (const line of readline(f)) {
                const text = new TextDecoder().decode(line);
                console.log(text);
                if (!text.includes("page")) {
                    continue;
                }
                const url = JSON.parse(text);
                urls.push(url);
            }

            if (urls.length > 0) {
                let flag = moment().format("YYYY-MM-DD HH:mm:ss");
                const encoder = new TextEncoder().encode("重试:" + flag + "\n");

                f.write(encoder);
                f.close();
            }
        }
    } catch (error) {
        if (error?.name == "NotFound") {
            console.info("未有失败记录,任务已结束!");
        } else {
            console.log(error);
        }
    }

    return urls;
};

export const viewDpi = async (id) => {
    const urls = await generateUrls(id, 1, 1);

    const platform = os.platform();

    let path = "./dezoomify-rs.exe";

    if (platform !== "windows") {
        path = "./dezoomify-rs";
    }

    if (urls.length > 0) {
        const cmd = new Deno.Command(path, {
            args: [urls[0].url],
            stdout: "piped",
            stderr: "inherit",
            // cwd: "kyFiles",
        });
        const output = await cmd.output();
        const logs = new TextDecoder().decode(output.stdout).trim();
        console.log(logs);
        if (!output.success) {
            throw new Error("获取图片分辨率异常");
        }
    } else {
        throw new Error("获取图片分辨率异常");
    }
};



export const viewInfo = async (url) => {

    try {
        const response = await fetch(`${url}`, {
            method: "GET",
            // responseType: 'stream'
            headers: {
                "Accept":
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",

                // "Host": "ttps://ostasien.digitale-sammlungen.de/",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
                //   "Cookie": `${config?.headers?.Cookie}`,
            },
        });

        const html = await response.text();
        // console.log(html)

        const doc = new DOMParser().parseFromString(
            `
             ${html}
            `,
            "text/html",
        );
        const elements = doc.querySelectorAll(
            "a",
        );

        let volArr = [];
        let i = 0;
        for (const element of elements) {
            const href = element.getAttribute("href");

            volArr.push({ url: href, vol: i + 1 });
            i++;
        }

        const tmpArr = await generateUrlsStep2(volArr);


        console.log(tmpArr);

        return tmpArr;
    } catch (error) {
        console.log(error);
        return [];
    }


}