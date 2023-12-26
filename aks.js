import * as Toml from "https://deno.land/std@0.208.0/toml/mod.ts";
import os from "https://deno.land/x/dos@v0.11.0/mod.ts";

export const generateUrls = async (url, pageStart, pageEnd) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      // responseType: 'stream'
      headers: {
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",

        "Host": "ttps://ostasien.digitale-sammlungen.de/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
        //   "Cookie": `${config?.headers?.Cookie}`,
      },
    });

    const html = await response.text();
    //   console.log(html)

    let lines = html.split("\n");
    let text = "";
    for (const line of lines) {
      if (line.includes('"imgID"')) {
        text += line;
      }
    }

    let json = text.replace("imgItems:", "").replace("}],", "").trim() + "}]";

    let arr = JSON.parse(json);

    let urls = arr.filter((item) => {
      let id = parseInt(item.ID);
      if (id >= pageStart && id <= pageEnd) {
        return true;
      } else {
        return false;
      }
    }).map((item) => {
      let imgID = item.imgID;
      let id = parseInt(item.ID);
      let url = `https://jsgimage.aks.ac.kr/data/images/${imgID.slice(0, 4)}/${
        imgID.slice(4, 6)
      }/${imgID.slice(6, 8)}/dzi/${imgID}.xml`;
      return { url: url, page: id };
    });

    // console.log(urls)

    return urls;
  } catch (error) {
    console.log(error);
  }
};

export const downLoadImages = async (urls) => {
  let config = null;

  // if (await checkFileExists("koFiles/koConfig.toml")) {
  //   config = Toml.parse(Deno.readTextFileSync("koFiles/koConfig.toml"));
  // } else {
  //   config = {
  //     headers: {
  //       Cookie: "必填",
  //     },
  //     downLoad: {
  //       rate: {
  //         startTime: 0,
  //         endTime: 0,
  //       },
  //     },
  //   };
  // }

  // console.log("下载配置\n");
  // console.info(config);

  //   if (config?.headers?.Cookie == "") {
  //     throw "cookie为必填项,请使用koConfig命令生成配置文件设置";
  //   }

  if (
    !(await checkFileExists("dezoomify-rs.exe") ||
      await checkFileExists("dezoomify-rs"))
  ) {
    await downLoaddezoomify();
  }
  const platform = os.platform();
  for (var i = 0; i < urls.length; i++) {
    try {
      console.log(urls[i].url);
      let path = "./dezoomify-rs.exe";

      if (platform !== "windows") {
        path = "./dezoomify-rs";
      }

      const cmd = new Deno.Command(path, {
        args: ["-l", urls[i].url, urls[i].page],
        stdout: "piped",
        stderr: "inherit",
        cwd: "aksFiles",
      });
      const output = await cmd.output();
      const logs = new TextDecoder().decode(output.stdout).trim();
      console.log(logs);
      if (!output.success) {
        throw "下载失败";
      }
    } catch (error) {
      console.log(error);
      await Deno.writeTextFile(
        "aksFiles/undownLoad.txt",
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
  await Deno.mkdir("aksFiles", { recursive: true });
  if (platform == "linux") {
    console.log("解压linux");
    // await tgz.uncompress("./dezoomify-rs-linux.tgz", "./aksFiles");
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
      // cwd: "aksFiles",
    });
    const output = await cmd.output();
    const logs = new TextDecoder().decode(output.stdout).trim();
    console.log(logs);
  }

  if (platform == "mac") {
    console.log("解压mac");
    // await tgz.uncompress("./dezoomify-rs-linux.tgz", "./aksFiles");
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
        Cookie: "必填",
      },
      downLoad: {
        rate: {
          remark: "设置下载时间间隔,默认范围为0秒随机设置,默认不开启",
          startTime: "下载间隔时间(秒)的开始值,类型为数字,",
          endTime: "下载间隔时间(秒)的结束值,类型为数字",
        },
      },
    };
    if (await checkFileExists("aksFiles/aksConfig.toml")) {
      Deno.writeTextFileSync(
        "aksFiles/aksConfig.toml",
        Toml.stringify({ headers: headers, downLoad: downLoad, help: help }),
      );
    } else {
      await Deno.mkdir("aksFiles", { recursive: true });
      // await downLoaddezoomify()
      Deno.writeTextFileSync(
        "aksFiles/aksConfig.toml",
        Toml.stringify({ headers: headers, downLoad: downLoad, help: help }),
      );
    }

    console.log("文件已生成:aksFiles/aksConfig.toml");
  } catch (error) {
    console.log(error);
  }
};

export const undownLoad = async () => {
  let urls = [];
  try {
    // const text = await Deno.readTextFile("files/undownLoa2d.txt");

    if (await checkFileExists("aksFiles/undownLoad.txt")) {
      const f = await Deno.open("aksFiles/undownLoad.txt", {
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
