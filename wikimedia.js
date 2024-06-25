import { sleepRandomAmountOfSeconds } from "https://deno.land/x/sleep/mod.ts";
import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";
import moment from "npm:moment";

import * as Toml from "https://deno.land/std@0.208.0/toml/mod.ts";

import {
    DOMParser,
    Element,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";


const downLoad = async (url, page) => {
 
 
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
  });

  let resHeaders = response.headers;
  let mime = resHeaders.get("content-type");

  if (mime == "image/jpeg") {
    mime = "jpeg";
  } else if (mime == "text/html") {
    throw "频率过高";
  } else {
    console.log(mime);
    // console.log(await response.text())
    throw "未知错误content-type为" + mime;
  }

  let read = response.body;

  const file = await Deno.open(`${"wikiFiles"}/${page}.${mime}`, {
    create: true,
    write: true,
  });

  await read?.pipeTo(file.writable, { preventClose: true });

  file.close();
};
export const generateUrls = (id, pageStart, pageEnd) => {
  let urls = [];
  let pages = pageEnd + 1;
  for (var i = pageStart; i < pages; i++) {
    let url =
      `https://commons.wikimedia.org/w/index.php?title=${id}&page=${i}&uselang=zh-tw`;

 
    urls.push({ page: i, url: url });
  }
  return urls;


     
 



};

 
export const downLoadImages = async (urls) => {
 
 
 
    for (var i = 0; i < urls.length; i++) {
        
        try {
   

        
           let response =    await  fetch( urls[i].url,
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
                    }

                )
                const html = await response.text();


                const doc = new DOMParser().parseFromString(
                    `
                   ${html}
                  `,
                    "text/html",
                );

                const elements  = doc.querySelectorAll(".mw-filepage-other-resolutions >  a ");
               let element =   elements[elements.length-1]
               let href =  element.getAttribute("href")
               console.log(href )
           
             await  downLoad(href,urls[i].page)
         
                // break


        } catch (error) {
          console.log(error);
          await Deno.writeTextFile(
            "wikiFiles/undownLoad.txt",
            JSON.stringify({ url: urls[i].url, page: urls[i].page }) + "\n",
            { append: true },
          );
        }

    }

  
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

export const undownLoad = async () => {
  let urls = [];
  try {
    // const text = await Deno.readTextFile("files/undownLoa2d.txt");

    if (await checkFileExists("wikiFiles/undownLoad.txt")) {
      const f = await Deno.open("wikiFiles/undownLoad.txt", {
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
      console.log(error.name);
    }
  }

  return urls;
};

export const config = async () => {
  try {
    let headers = {
      Cookie: "",
    };
    let downLoad = {
      rate: {
        startTime: 3,
        endTime: 7,
      },
    };
    let help = {
      headers: "暂时不用设置",
      downLoad: {
        rate: {
          remark: "设置下载时间间隔,默认范围为3-7秒随机设置",
          startTime: "下载间隔时间(秒)的开始值,类型为数字,",
          endTime: "下载间隔时间(秒)的结束值,类型为数字",
        },
      },
    };
    if (await checkFileExists("haFiles/haConfig.toml")) {
      Deno.writeTextFileSync(
        "haFiles/haConfig.toml",
        Toml.stringify({ headers: headers, downLoad: downLoad, help: help }),
      );

      // writeJsonSync('haFiles/haConfig.toml', { headers: headers, downLoad: downLoad, help: help }, { spaces: 2 });
    } else {
      await Deno.mkdir("haFiles", { recursive: true });
      // writeJsonSync('haFiles/haConfig.toml', { headers: headers, downLoad: downLoad, help: help }, { spaces: 2 });
      Deno.writeTextFileSync(
        "haFiles/haConfig.toml",
        Toml.stringify({ headers: headers, downLoad: downLoad, help: help }),
      );
    }

    console.log("文件已生成:haFiles/haConfig.toml");
  } catch (error) {
    console.log(error);
  }
};
