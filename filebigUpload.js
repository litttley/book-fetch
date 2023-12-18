import { fileExtension } from "https://deno.land/x/file_extension/mod.ts";
import { mime, mimelite } from "https://deno.land/x/mimetypes@v1.0.0/mod.ts";
const requestProgressRefresh = async (sid) => {
  // e6H8SUFztR3vZuueC655
  // 5ECpFLpzTvecHHgwEPrV

  let share = "";
  try {
    let url = `https://www.filebig.net/log.php?sid=${sid}`;
    // let url = 'https://www.filebig.net/log.php?sid=DgNBXhFwiNrUaYqm3vYb'
    const response = await fetch(url, {
      method: "GET",
      // responseType: 'stream'
      headers: {
        "Accept": "application/json, text/javascript, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",

        "Host": "www.filebig.net",
        "Referer": "https://www.filebig.net/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
        //   "Cookie": `${config?.headers?.Cookie}`,
      },
    });
    const text = await response.text();
    // console.log(text)
    let value = text.replace("{", "").replace("}", "");
    const arr = value.split(",");

    let status = arr[0].replace("status: ", "").trim().replaceAll("'", "");
    // let progress = arr[1].replace("progress: ", "").trim().replaceAll("'", "")
    // let progressInfo = arr[2].replace("progressInfo: ", "").trim().replaceAll("'", "")
    // let uploaded = arr[3].replace("uploaded: ", "").trim().replaceAll("'", "")

    const jsonObj = { status };

    console.log(jsonObj);

    if (jsonObj?.status == "upload") {
      // console.log(jsonObj.progressInfo)
      // if (!isClose) {
      //     //重新刷新
      //     const timer = setTimeout(requestProgressRefresh, 500);
      //     timerArr.push(timer)
      // }
    } else if (jsonObj?.status == "ready") {
      let resultInfo = arr[1].replace("resultInfo: ", "").trim().replaceAll(
        "'",
        "",
      );

      // console.log(resultInfo)

      let value = resultInfo.match(/(?<=\<input.*value=\").*?(?=\")/);
      share = value[0];
      // console.log(value[0])
    } else {
      throw "未知错误";
    }
  } catch (error) {
    console.log(error);
  }

  return share;
};

const upload = async (filePath, sid) => {
  let url = "https://www.filebig.net/cgi-bin/postfile.cgi";

  let formData = new FormData();
  formData.append("sid", sid);
  // //发邮件邮箱
  // formData.append("FromEmail", "");
  // //收件人邮箱
  // formData.append("ToEmail1", "");
  // // 备注
  // formData.append("MessageText", "");

  let fileName = "";
  if (filePath.includes("/")) {
    fileName = filePath.split("/").pop();
  } else if (filePath.includes("\\")) {
    fileName = filePath.split("\\").pop();
  } else {
    fileName = filePath;
  }
  console.log(fileName);
  let fileType = mime.getType(fileName);
  console.log(fileType);

  const fileBytes = await Deno.readFile(filePath);

  // let fileType = fileExtension(filePath); // py
  // console.log(fileType)

  const fileBlob = new Blob([fileBytes], { type: fileType });

  formData.append("upfile", fileBlob, fileName);

  // const response = new Response(formData);
  // const headers = response?.headers

  // let contentType = headers.get('content-type')
  // console.log(contentType)
  // let blob = await response.blob()
  // let formDataSize= blob.size
  // console.log(formDataSize)
  // const request = new Request(url, {
  //     method: "POST",
  //     body: formData,
  //   });
  //  let ss =  await  request.blob()
  //  console.log(ss.size)
  //      console.log(request)

  //注意formData格式Content-Length与Content-Type会自动计算，一定不要设置
  const resp = await fetch(url, {
    method: "POST",

    headers: {
      // "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      // "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      // "Accept-Encoding": 'gzip, deflate, br',
      // "Content-Length":  formDataSize,
      // "Content-Type": contentType,
      "Origin": "https://www.filebig.net",
      // "Referer": "https://www.filebig.net/",
      "Host": "www.filebig.net",
      // 'Cookie': '_ga=GA1.1.1354550980.1702520689; __utmc=211638274; __utmz=211638274.1702520690.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __gads=ID=9520fea812999235:T=1702520693:RT=1702528182:S=ALNI_MZHI69D_OcGR9M3s5G41AvyRhIC2w; __gpi=UID=00000caca160ae69:T=1702520693:RT=1702528182:S=ALNI_MYWs-Ta0s3vrwPooBJ0YR17lkUsRw; _ga_HFY0SQM9Q7=GS1.1.1702530865.4.0.1702530865.0.0.0; __utma=211638274.1354550980.1702520689.1702528180.1702530927.4; __utmt=1; __utmb=211638274.3.10.1702530927; FCNEC=%5B%5B%22AKsRol8dXWmaTLwkYMVgMZhiWZ2Wr5AfS1J7QIMRkRMtOBI0KRCIK95QLMWHMnmmZDU_GZT22tLt1dSA-3-e2aXMqvuttupHmAahNsluWVfKSKLAcHgeOFsYvvXGCOdmUF0vSO4NqhoiYMT6Jhm9837vGw20CwpAzw%3D%3D',
      // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"
    },
    body: formData,
  });

  const responseText = await resp.text();

  // console.log("RAW BODY:", await resp.text());
  if (responseText.includes("OK")) {
    return responseText;
  } else {
    throw responseText;
  }
};

export const uploadFileToFileBig = async (filePath) => {
  var letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let sid = "";
  for (var n = 0; n < 20; ++n) {
    var r = Math.floor(Math.random() * letters.length);
    sid += letters.substring(r, r + 1);
  }

  let text = await upload(filePath, sid);

  console.log(text);
  let shareUrl = await requestProgressRefresh(sid);

  console.log("shareUrl:" + shareUrl);

  return shareUrl;
};
