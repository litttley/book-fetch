// import { sleepRandomAmountOfSeconds } from "https://deno.land/x/sleep/mod.ts";
import * as Toml from "https://deno.land/std@0.208.0/toml/mod.ts";
import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";
import moment from "npm:moment";
const downLoad = async (url, page, config) => {
  //   let startTime = config?.downLoad?.rate?.startTime;
  //   let endTime = config?.downLoad?.rate?.endTime;

  //   if (startTime > 0 && endTime > 0 && endTime >= startTime) {
  //     await sleepRandomAmountOfSeconds(startTime, endTime);
  //   }

  //   console.log(config?.headers?.Cookie);

  console.log(`正下载第${page}页`);
  console.log(url);
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

  let resHeaders = response.headers;

  let mime = resHeaders.get("content-type");

  if (mime == "image/jpeg") {
    mime = "jpeg";
  } else {
    throw "下载失败" + mime;
  }

  let read = response.body;

  const file = await Deno.open(`${"osFiles"}/${page}.${mime}`, {
    create: true,
    write: true,
  });

  await read?.pipeTo(file.writable, { preventClose: true });

  file.close();
};

export const downLoadImages = async (urls) => {
  let config = null;

  //   if (await checkFileExists("osFiles/osConfig.toml")) {
  //     config = Toml.parse(Deno.readTextFileSync("osFiles/osConfig.toml"));
  //   } else {
  //     config = {
  //       headers: {
  //         Cookie: "必填",
  //       },
  //       downLoad: {
  //         rate: {
  //           startTime: 0,
  //           endTime: 0,
  //         },
  //       },
  //     };
  //   }

  //   console.log("下载配置\n");
  //   console.info(config);

  //   if (config?.headers?.Cookie == "") {
  //     throw "cookie为必填项,请使用osConfig命令生成配置文件设置";
  //   }

  for (var i = 0; i < urls.length; i++) {
    try {
      await downLoad(urls[i].url, urls[i].page, config);
    } catch (error) {
      console.log(error);
      await Deno.writeTextFile(
        "osFiles/undownLoad.txt",
        JSON.stringify({ url: urls[i].url, page: urls[i].page }) + "\n",
        { append: true },
      );
    }
  }
};

export const undownLoad = async () => {
  let urls = [];
  try {
    // const text = await Deno.readTextFile("files/undownLoa2d.txt");

    if (await checkFileExists("osFiles/undownLoad.txt")) {
      const f = await Deno.open("osFiles/undownLoad.txt", {
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

export const generateUrls = (fileId, pageStart, pageEnd) => {
  let urls = [];
  let pages = pageEnd + 1;
  for (var i = pageStart; i < pages; i++) {
    let fill = i + "";
    let url = `https://api.digitale-sammlungen.de/iiif/image/v2/${fileId}_${
      fill.padStart(5, "0")
    }/full/full/0/default.jpg`;
    console.log(url);
    urls.push({ page: i, url: url });
  }
  return urls;
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
    if (await checkFileExists("osFiles/osConfig.toml")) {
      Deno.writeTextFileSync(
        "osFiles/osConfig.toml",
        Toml.stringify({ headers: headers, downLoad: downLoad, help: help }),
      );
    } else {
      await Deno.mkdir("osFiles", { recursive: true });

      Deno.writeTextFileSync(
        "osFiles/osConfig.toml",
        Toml.stringify({ headers: headers, downLoad: downLoad, help: help }),
      );
    }

    console.log("文件已生成:osFiles/osConfig.toml");
  } catch (error) {
    console.log(error);
  }
};
