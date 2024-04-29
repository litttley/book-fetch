import { sleepRandomAmountOfSeconds } from "https://deno.land/x/sleep/mod.ts";
import * as Toml from "https://deno.land/std@0.208.0/toml/mod.ts";
import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";
import moment from "npm:moment";

import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const downLoad = async (url, page, config) => {
  let startTime = config?.downLoad?.rate?.startTime;
  let endTime = config?.downLoad?.rate?.endTime;

  if (startTime > 0 && endTime > 0 && endTime >= startTime) {
    await sleepRandomAmountOfSeconds(startTime, endTime);
  }

  console.log(config?.headers?.Cookie);

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

      "Host": "viewer.nl.go.kr",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
      "Cookie": `${config?.headers?.Cookie}`,
    },
  });

  let resHeaders = response.headers;
  let mime = resHeaders.get("content-type");

  if (mime == "image/jpeg") {
    mime = "jpeg";
  } else {
    console.log("cooke已过期请更新");
    throw "下载失败" + mime;
  }

  // if (mime == 'application/pdf') {
  //     mime = 'pdf'
  // } else if (mime == 'text/html') {
  //     throw '频率过高'
  // } else {
  //     console.log(mime)
  //     // console.log(await response.text())
  //     throw '未知错误content-type为' + mime

  // }

  let read = response.body;

  const file = await Deno.open(`${"nlFiles"}/${page}.${mime}`, {
    create: true,
    write: true,
  });

  await read?.pipeTo(file.writable, { preventClose: true });

  file.close();
};

export const downLoadImages = async (urls) => {
  let config = null;

  if (await checkFileExists("nlFiles/nlConfig.toml")) {
    config = Toml.parse(Deno.readTextFileSync("nlFiles/nlConfig.toml"));
  } else {
    config = {
      headers: {
        Cookie: "必填",
      },
      downLoad: {
        rate: {
          startTime: 0,
          endTime: 0,
        },
      },
    };
  }

  console.log("下载配置\n");
  console.info(config);

  if (config?.headers?.Cookie == "") {
    throw "cookie为必填项,请使用nlconfig命令生成配置文件设置";
  }

  for (var i = 0; i < urls.length; i++) {
    try {
      await downLoad(urls[i].url, urls[i].page, config);
    } catch (error) {
      console.log(error);
      await Deno.writeTextFile(
        "nlFiles/undownLoad.txt",
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

    if (await checkFileExists("nlFiles/undownLoad.txt")) {
      const f = await Deno.open("nlFiles/undownLoad.txt", {
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

export const indexundownLoad = async () => {
  let urls = [];
  try {
    // const text = await Deno.readTextFile("files/undownLoa2d.txt");

    if (await checkFileExists("nlFiles/indexundownLoad.txt")) {
      const f = await Deno.open("nlFiles/indexundownLoad.txt", {
        read: true,
        write: true,
      });
      for await (const line of readline(f)) {
        const text = new TextDecoder().decode(line);
        console.log(text);
        if (!text.includes("pageNum")) {
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

export const generateUrls = (fileId, vol, pageStart, pageEnd) => {
  let urls = [];
  let pages = pageEnd + 1;
  for (var i = pageStart; i < pages; i++) {
    let url =
      `https://viewer.nl.go.kr/nlmivs/view_image.jsp?cno=${fileId}&vol=${vol}&page=${i}&twoThreeYn=N`;
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
    if (await checkFileExists("nlFiles/nlConfig.toml")) {
      Deno.writeTextFileSync(
        "nlFiles/nlConfig.toml",
        Toml.stringify({ headers: headers, downLoad: downLoad, help: help }),
      );
    } else {
      await Deno.mkdir("nlFiles", { recursive: true });

      Deno.writeTextFileSync(
        "nlFiles/nlConfig.toml",
        Toml.stringify({ headers: headers, downLoad: downLoad, help: help }),
      );
    }

    console.log("文件已生成:nlFiles/nlConfig.toml");
  } catch (error) {
    console.log(error);
  }
};


export const downIndex = async (pageNum) => {






    let url = `https://www.nl.go.kr/EN/contents/engSearch.do?resultType=&pageNum=${pageNum}&pageSize=30&order=&sort=iregdate&srchTarget=&kwd=&systemType=&lnbTypeName=&category=%EA%B3%A0%EB%AC%B8%ED%97%8C&hanjaFlag=N&reSrchFlag=&licYn=&kdcName1s=&manageName=&langName=Chinese&ipubYear=&pubyearName=&seShelfCode=&detailSearch=true&seriesName=&mediaCode=&offerDbcode2s=&f1=&v1=&f2=&v2=&f3=&v3=&f4=&v4=&and1=&and2=&and3=&and4=&and5=&and6=&and7=&and8=&and9=&and10=&and11=&and12=&isbnOp=&isbnCode=&guCode2=7&guCode3=&guCode4=&guCode5=&guCode6=&guCode7=&guCode8=&guCode11=&gu2=kdc&gu7=&gu8=&gu9=&gu10=&gu12=&gu13=&gu14=&gu15=&gu16=&subject=&sYear=&eYear=&sRegDate=&eRegDate=&typeCode=&acConNo=&acConNoSubject=&infoTxt=%EC%A3%BC%EC%A0%9C%EC%96%B4%7CLanguages`

    const response = await fetch(url, {
      method: "GET",
      // responseType: 'stream'
      headers: {
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",

        "Host": "viewer.nl.go.kr",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
        // "Cookie": `${config?.headers?.Cookie}`,
      },
    });

    const html = await response.text()

    // console.log(html)
    const doc = new DOMParser().parseFromString(
      `
             ${html}
            `,
      "text/html",
    );

    const elements = doc.querySelectorAll(".cont_list>.row");

    //doc.querySelectorAll(".cont_list>.row>.txt_left >a");

    // console.log(elements)

    let pagelist=[]
    for (const ele of elements) {
      let aele = ele.querySelector('.txt_left>a')
      // let title = ele.getAttribute('title')
      let href = aele.getAttribute('href')
      let text = aele.textContent

      // console.log(text)

      let comments = ele.querySelectorAll('.txt_grey')
      let comment1 = comments[1].textContent
      let comment2 = comments[2].textContent
      let comment3 = comments[3].textContent
      let comment4 = comments[4].textContent
      console.log(comment1)
      console.log(comment2)
      console.log(comment3)
      console.log(comment4)
      pagelist.push({text:text,href,comment1,comment2,comment3,comment4})
    }

   
    return pagelist



}
