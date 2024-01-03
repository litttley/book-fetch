import * as ContentDisposition from "npm:@tinyhttp/content-disposition";
import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
function typeDetect(_link) {
  var type = "file";
  var edit = true;

  if (_link.startsWith("https://docs.google.com/document/d/") === true) {
    type = "document";
    if (
      _link.endsWith("/preview") ||
      _link.endsWith("/copy") ||
      _link.endsWith("/export?format=pdf") ||
      _link.endsWith("/export?format=doc") ||
      _link.endsWith("/export?format=odt") ||
      _link.endsWith("/export?format=rtf") ||
      _link.endsWith("/export?format=txt") ||
      _link.endsWith("/export?format=html") ||
      _link.endsWith("/export?format=epub") ||
      _link.endsWith("&sz=w1600-h1600")
    ) {
      edit = false;
    }
  } else if (
    _link.startsWith("https://docs.google.com/spreadsheets/d/") === true
  ) {
    type = "spreadsheets";
    if (
      _link.endsWith("/preview") ||
      _link.endsWith("/copy") ||
      _link.endsWith("/export?format=pdf") ||
      _link.endsWith("/export?format=xlsx") ||
      _link.endsWith("/export?format=ods") ||
      _link.endsWith("/export?format=csv") ||
      _link.endsWith("/export?format=tsv") ||
      _link.endsWith("&sz=w1600-h1600")
    ) {
      edit = false;
    }
  } else if (
    _link.startsWith("https://docs.google.com/presentation/d/") === true
  ) {
    type = "presentation";
    if (
      _link.endsWith("/preview") ||
      _link.endsWith("/copy") ||
      _link.endsWith("/present") ||
      _link.endsWith("/export/pdf") ||
      _link.endsWith("/export/pptx") ||
      _link.endsWith("/export/odp") ||
      _link.endsWith("/export/txt") ||
      _link.endsWith("/export/jpeg") ||
      _link.endsWith("/export/png") ||
      _link.endsWith("/export/svg") ||
      _link.endsWith("&sz=w1600-h1600")
    ) {
      edit = false;
    }
  } else if (
    _link.startsWith("https://drive.google.com/uc?export=download&id=")
  ) {
    edit = false;
  } else if (_link.startsWith("https://drive.google.com/thumbnail?id=")) {
    if (_link.endsWith("&sz=w1600-h1600")) {
      edit = false;
    }
  }

  return {
    type,
    edit,
  };
}

const getRealDownUrl = async (link) => {
  let _link = link;
  let { type, edit } = typeDetect(_link);
  let _type = type;

  var _startPos = _link.indexOf("/d/");
  if (_startPos === -1) {
    throw new Error("这不是Google云盘的分享网址,请重新检查");
  } else {
    _startPos = _startPos + 3;
  }

  var _endPos = _link.indexOf("/", _startPos);

  var _id = _link.substr(_startPos, _endPos - _startPos);

  let url = "";
  switch (_type) {
    case "document":
      // url = `https://docs.google.com/document/d/${_id}/export`
      throw new Error("document类型功能遗漏！");

      break;

    case "spreadsheets":
      // url = `https://docs.google.com/spreadsheets/d/${_id}/export`
      throw new Error("spreadsheets类型功能遗漏！");
      break;

    case "presentation":
      throw new Error("presentation！");
      // url = `https://docs.google.com/presentation/d/${_id}/export/`
      break;

    default:
      url = `https://drive.google.com/uc?export=download&id=${_id}`;
      break;
  }

  return url;

  // switch (_type) {
  //     case "document":
  //       _create_link("https://docs.google.com/document/d/" + _id + "/export?format=odt", "OpenDocument Text", "file alternate", _output);
  //       _create_link("https://docs.google.com/document/d/" + _id + "/export?format=pdf", "PDF", "file pdf outline", _output);
  //       _create_link("https://docs.google.com/document/d/" + _id + "/preview", "Preview", "play circle", _output);
  //       _create_link("https://docs.google.com/document/d/" + _id + "/copy", "Copy", "copy", _output);
  //       _create_link("https://docs.google.com/document/d/" + _id + "/export?format=doc", "Word", "file word outline", _output);
  //       _create_link("https://docs.google.com/document/d/" + _id + "/export?format=rtf", "Rich Text Format", "file alternate", _output);
  //       _create_link("https://docs.google.com/document/d/" + _id + "/export?format=txt", "Text", "file alternate outline", _output);
  //       _create_link("https://docs.google.com/document/d/" + _id + "/export?format=html", "HTML", "html5", _output);
  //       _create_link("https://docs.google.com/document/d/" + _id + "/export?format=epub", "EPUB", "book", _output);
  //       _create_link("https://drive.google.com/thumbnail?id=" + _id + '&sz=w1600-h1600', "預覽", "image", _output);
  //       break;
  //     case "spreadsheets":
  //       _create_link("https://docs.google.com/spreadsheets/d/" + _id + "/export?format=ods", "OpenDocument Spreadsheet", "file alternate", _output);
  //       _create_link("https://docs.google.com/spreadsheets/d/" + _id + "/export?format=pdf", "PDF", "file pdf outline", _output);
  //       _create_link("https://docs.google.com/spreadsheets/d/" + _id + "/preview", "Preview", "play circle", _output);
  //       _create_link("https://docs.google.com/spreadsheets/d/" + _id + "/copy", "Copy", "copy", _output);
  //       _create_link("https://docs.google.com/spreadsheets/d/" + _id + "/export?format=xlsx", "Excel", "file excel outline", _output);
  //       _create_link("https://docs.google.com/spreadsheets/d/" + _id + "/export?format=csv", "CSV", "file alternate outline", _output);
  //       _create_link("https://docs.google.com/spreadsheets/d/" + _id + "/export?format=tsv", "TSV", "file alternate outline", _output);
  //       _create_link("https://drive.google.com/thumbnail?id=" + _id + '&sz=w1600-h1600', "預覽", "image");
  //       break;
  //     case "presentation":
  //       _create_link("https://docs.google.com/presentation/d/" + _id + "/export/pdf", "PDF", "file pdf outline", _output);
  //       _create_link("https://docs.google.com/presentation/d/" + _id + "/export/pptx", "Power Point", "file powerpoint outline", _output);
  //       _create_link("https://docs.google.com/presentation/d/" + _id + "/preview", "Preview", "play circle", _output);
  //       _create_link("https://docs.google.com/presentation/d/" + _id + "/present", "Present", "play circle", _output);
  //       _create_link("https://docs.google.com/presentation/d/" + _id + "/copy", "Copy", "copy", _output);
  //       _create_link("https://docs.google.com/presentation/d/" + _id + "/export/odp", "OpenDocument Presentation", "file alternate", _output);
  //       _create_link("https://docs.google.com/presentation/d/" + _id + "/export/txt", "Text", "file alternate outline", _output);
  //       _create_link("https://docs.google.com/presentation/d/" + _id + "/export/jpeg", "JPEG", "file image outline", _output);
  //       _create_link("https://docs.google.com/presentation/d/" + _id + "/export/png", "PNG", "file image outline", _output);
  //       _create_link("https://docs.google.com/presentation/d/" + _id + "/export/svg", "SVG", "file image outline", _output);
  //       _create_link("https://drive.google.com/thumbnail?id=" + _id + '&sz=w1600-h1600', "預覽", "image", _output);
  //       break;
  //     default:
  //       _create_link("https://drive.google.com/uc?export=download&id=" + _id, "原始", "file alternate outline", _output);
  //       _create_link("https://drive.google.com/thumbnail?id=" + _id + '&sz=w1600-h1600', "預覽", "image", _output);
  //   }
};

const downLoadStep2 = async (html, url) => {
  const doc = new DOMParser().parseFromString(
    `
           ${html}
          `,
    "text/html",
  );
  const formEle = doc.querySelector("#download-form");
  let formUrl = formEle.getAttribute("action");

  const response = await fetch(formUrl, {
    method: "POST",
    // responseType: 'stream'
    headers: {
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",

      "Host": "viewer.nl.go.kr",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
    },
  });
  let resHeaders = response.headers;
  let fileName = resHeaders.get("content-disposition");
  let contentDisposition = ContentDisposition.parse(fileName);
  let finalFileName = "";
  console.log(contentDisposition?.parameters?.filename);
  if (contentDisposition?.parameters.filename) {
    finalFileName = contentDisposition?.parameters.filename;
  } else {
    finalFileName = `未知.${mime}`;
  }

  let read = response.body;

  const file = await Deno.open(`${"gshareFiles"}/${finalFileName}`, {
    create: true,
    write: true,
  });

  await read?.pipeTo(file.writable);
};

export const downLoadImages = async (link) => {
  let url = await getRealDownUrl(link);
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
    },
  });

  let resHeaders = response.headers;
  let mime = resHeaders.get("content-type");

  console.log(mime);
  if (mime == "application/pdf") {
    mime = "pdf";
  } else if (mime == "text/html; charset=utf-8") {
    const html = await response.text();
    console.log(html);

    await downLoadStep2(html, url);

    return true;
  }
  let fileName = resHeaders.get("content-disposition");
  let contentDisposition = ContentDisposition.parse(fileName);
  let finalFileName = "";
  console.log(contentDisposition?.parameters?.filename);
  if (contentDisposition?.parameters.filename) {
    finalFileName = contentDisposition?.parameters.filename;
  } else {
    finalFileName = `未知.${mime}`;
  }

  let read = response.body;

  const file = await Deno.open(`${"gshareFiles"}/${finalFileName}`, {
    create: true,
    write: true,
  });

  await read?.pipeTo(file.writable);
};
