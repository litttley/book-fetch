import * as Toml from "https://deno.land/std@0.208.0/toml/mod.ts";
import os from "https://deno.land/x/dos@v0.11.0/mod.ts";
import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";
import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import * as ContentDisposition from "npm:@tinyhttp/content-disposition";
import moment from "npm:moment";

 

 
export const generateUrls = async (url, pageStart, pageEnd,downType) => {
    let urls=[]
  try {
 
 
   

    const response = await fetch( url+'?mode=full', {
        method: "GET",
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


      const html= await response.text()

  


      const doc = new DOMParser().parseFromString(
        `
                 ${html}
                `,
        "text/html",
      );
    
      const elements = doc.querySelectorAll("td[headers='t1']>a");
    
      let pdfUrls=[]
      let pdfPage=1
        let tifUrls=[]
        let tifPage=1
        for (const element of elements) {
            const href = element.getAttribute("href");
          
            if(href.startsWith('/bitstream')&&href.endsWith('.pdf')){
                pdfUrls.push({url:`https://openresearch-repository.anu.edu.au${href}`,page:pdfPage})
                pdfPage++
            }
            if(href.startsWith('/bitstream')&&href.endsWith('.tif')){
                tifUrls.push({url:`https://openresearch-repository.anu.edu.au${href}`,page:tifPage})
                tifPage++
            }
        }

 
        const tmpArr=[]
        if(downType=='pdf'){
            tmpArr.push(...pdfUrls)
        }else{
            tmpArr.push(...tifUrls)
        }
 
      urls = tmpArr .filter((item, index) => {
      const page = item.page;
      if (page >= pageStart && page <= pageEnd) {
        return true;
      } else {
        return false;
      }
    });

    // console.log(urls);

    return urls;
  } catch (error) {
    console.log(error);
    return [];
  }
};

 
 

export const getCookie = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    // responseType: 'stream'
    headers: {
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",

      // "Host": "ttps://ostasien.digitale-sammlungen.de/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
      //   "Cookie": `${config?.headers?.Cookie}`,
    },
  });

  let resHeaders = response.headers;
      console.log(resHeaders)
      let cookie = resHeaders.get("set-cookie");
    return  cookie.split(';')[0]
 
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
  // let infoUrl = await  getJsonInfo(urls[0].url)

 if(urls.length==0){
    throw new Error('下载列表为空')
 }
 const cookie = await getCookie(urls[0].url)
//  console.log(cookie)

  for (var i = 0; i < urls.length; i++) {
    try {
      console.log(urls[i].url);
      

      const response = await fetch(urls[i].url, {
        method: "GET",
        // responseType: 'stream'
        headers: {
          "Accept":
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    
          "Host": "openresearch-repository.anu.edu.au",
    
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
        "Cookie":`${cookie}`
        },
      });
      let resHeaders = response.headers;
      // console.log(resHeaders)
      let contentType = resHeaders.get("content-type");
      let mime='pdf'
      if(contentType=='application/pdf'){
        mime='pdf'
      }else if(contentType=='image/tiff'){
        mine='tif'
      }
      let fileName = resHeaders.get("content-disposition");
 
      if(!fileName){
        fileName='attachment;filename="'+`${urls[i].page}.${mime}`+'"'
      }
     
      let contentDisposition = ContentDisposition.parse(fileName);
      let finalFileName = "";
      console.log(contentDisposition?.parameters?.filename);
      if (contentDisposition?.parameters.filename) {
        finalFileName = contentDisposition?.parameters.filename;
      } else {
        finalFileName = `未知.${mime}`;
      }
    
      let read = response.body;
    
      const file = await Deno.open(`anFiles/${finalFileName}`, {
        create: true,
        write: true,
      });
    
      await read?.pipeTo(file.writable);
    } catch (error) {
      console.log(error);
      await Deno.writeTextFile(
        "anFiles/undownLoad.txt",
        JSON.stringify({
          url: urls[i].url,
          page: urls[i].page,
       
        }) + "\n",
        { append: true },
      );
    }
  }


  try {
    await Deno.remove("./anFiles/info.json" );
  } catch (error) {
    
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
  await Deno.mkdir("anFiles", { recursive: true });
  if (platform == "linux") {
    console.log("解压linux");
    // await tgz.uncompress("./dezoomify-rs-linux.tgz", "./anFiles");
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
      // cwd: "anFiles",
    });
    const output = await cmd.output();
    const logs = new TextDecoder().decode(output.stdout).trim();
    console.log(logs);
  }

  if (platform == "mac") {
    console.log("解压mac");
    // await tgz.uncompress("./dezoomify-rs-linux.tgz", "./anFiles");
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
    console.log(err)
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
    if (await checkFileExists("anFiles/anConfig.toml")) {
      Deno.writeTextFileSync(
        "anFiles/anConfig.toml",
        Toml.stringify({ headers: headers, downLoad: downLoad, help: help }),
      );
    } else {
      await Deno.mkdir("anFiles", { recursive: true });
      // await downLoaddezoomify()
      Deno.writeTextFileSync(
        "anFiles/anConfig.toml",
        Toml.stringify({ headers: headers, downLoad: downLoad, help: help }),
      );
    }

    console.log("文件已生成:anFiles/anConfig.toml");
  } catch (error) {
    console.log(error);
  }
};

export const undownLoad = async () => {
  const urls = [];
  try {
    // const text = await Deno.readTextFile("files/undownLoa2d.txt");

    if (await checkFileExists("anFiles/undownLoad.txt")) {
      const f = await Deno.open("anFiles/undownLoad.txt", {
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

    console.log(urls)

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
      // cwd: "anFiles",
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



const getManifest=async (url)=>{


  const url2=`https://gallica.bnf.fr/services/getSyntheseContent${url.replace('https://gallica.bnf.fr',"")}`
  const response = await fetch( url2, {
    method: "GET",
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


  const json = await response.json();

  // console.log(json)

 const  href =  json?.fragment.parameters.iiifFragment.contenu

  const realUrl=`https://gallica.bnf.fr/${href}`


  const response2 = await fetch( realUrl, {
    method: "GET",
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
  const html2 = await response2.text();

 const lines =  html2.split("\n")
 let manifestUrl=''
  for (const line of lines) {
      if(line.includes('"target" :')){
       const  src =  line.replace('"target" :',"").replace(",","").replaceAll('"',"").trim()

          manifestUrl = decodeURIComponent(src);
        break
      }
  }

 

  if(manifestUrl==''){
    throw new Error("加载manifest.json异常")
  }

  const response3 = await fetch( manifestUrl, {
    method: "GET",
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
 const manifestObj = await response3.json()
return  manifestObj

}

export const viewInfo = async (url) => {
 
 
 
    try {


        const response = await fetch( url+'?mode=full', {
            method: "GET",
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


          const html= await response.text()

      

   
          const doc = new DOMParser().parseFromString(
            `
                     ${html}
                    `,
            "text/html",
          );
        
          const elements = doc.querySelectorAll("td[headers='t1']>a");
        
            let pdfUrls=[]
            let pdfPage=1
            let tifUrls=[]
            let tifPage=1
            for (const element of elements) {
                const href = element.getAttribute("href");
              
                if(href.startsWith('/bitstream')&&href.endsWith('.pdf')){
                    pdfUrls.push({url:`https://openresearch-repository.anu.edu.au${href}`,page:pdfPage})
                    pdfPage++
                }
                if(href.startsWith('/bitstream')&&href.endsWith('.tif')){
                    tifUrls.push({url:`https://openresearch-repository.anu.edu.au${href}`,page:tifPage})
                    tifPage++
                }
            }
 
  
   
   
  
  
      return {pdfUrls,tifUrls};
    } catch (error) {
      console.log(error);
      return [];
    }

  };