import { sleepRandomAmountOfSeconds } from "https://deno.land/x/sleep/mod.ts";
import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

import moment from "npm:moment";

import * as Toml from "https://deno.land/std@0.208.0/toml/mod.ts";
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
        signal: AbortSignal.timeout(1000*parseInt(timeout)),
    });

    let resHeaders = response.headers;
    let mime = resHeaders.get("content-type");

    if (mime == "application/pdf") {
        mime = "pdf";
    } else if (mime == "image/jpeg") {
        mime = "jpeg";
    } else {
        console.log(mime);
        // console.log(await response.text())
        throw "未知错误content-type为" + mime;
    }

    let read = response.body;

    const file = await Deno.open(`${"waFiles"}/${page}.${mime}`, {
        create: true,
        write: true,
    });

    await read?.pipeTo(file.writable);

 
};
export const generateUrls = async (url, type, pageStart, pageEnd) => {
    let urls = [];

    const response = await fetch(url, {
        method: "GET",
        // responseType: 'stream'
        headers: {
            // "Content-Type":"image/jpeg"
            //   "Accept":
            //     "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            //   "Accept-Encoding": "gzip, deflate, br",
            //   "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",

            //   "Host": "babel.hathitrust.org",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",

        },
        signal: AbortSignal.timeout(1000*60),
    });

    const html = await response.text()

    let values = html.match(/(?<=<A.*href=")([^"]*)(?=")/g);

    let htmlUrls = []
    let pdfUrls = []
    for (const item of values) {


        if (item.endsWith('.html')) {
            let vol = parseInt(item.split('_').pop().replace('.html', ''))
            htmlUrls.push({ url: `${url}/${item}`, vol: vol, type: type })
        }
        if (item.endsWith('.pdf')) {
            // pdfUrls.push(item)
            let vol = parseInt(item.split('_').pop().replace('.pdf', ''))
            pdfUrls.push({ url: `${url}/${item}`, type: type, vol: vol,page:0 })
        }

    }

    console.log(pdfUrls)
  const newPdfUrls =   pdfUrls.map((item,index)=>{
        return {...item,page:index+1}
    })

    if (type == 'html') {
        htmlUrls.sort((a, b) => a.vol - b.vol)
        var page = 1
        for (const item of htmlUrls) {

            // console.log(item)
            const vol = item.vol

            const baseUrl = url

            const infoRes = await viewInfoStep(item.url)

            const infoHtml = await infoRes.text()
            let valuesArr = infoHtml.match(/(?<=<A.*href=")([^"]*)(?=")/g);
           const newVlaueArr =  valuesArr.map(item=>{return {itemhef:item,volPage:parseInt(item.split('p')[1].replace('.jpg'))}})
           newVlaueArr.sort((a,b)=>a.volPage-b.volPage)
            for (const itemValue of newVlaueArr) {
              

                urls.push({ url: `${baseUrl}/${itemValue.itemhef}`, type: type, vol: vol, volPage: itemValue.volPage, page: page })
                page++

            }


        }
        // console.log(urls)
    

    } else {
        urls.push(...newPdfUrls)
    }
    urls.sort((a, b) => a.page - b.page)
    return urls .filter((item, index) => {
        const page = item.page;
        if (page >= pageStart && page <= pageEnd) {
            return true;
        } else {
            return false;
        }
    });


};

export const downLoadImages = async (urls) => {
    let config = null;

    if (await checkFileExists("waFiles/waConfig.toml")) {
        config = Toml.parse(Deno.readTextFileSync("waFiles/waConfig.toml"));
    } else {
        config = {
            downLoad: {
                timeout:60,
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
                "waFiles/undownLoad.txt",
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

        if (await checkFileExists("waFiles/undownLoad.txt")) {
            const f = await Deno.open("waFiles/undownLoad.txt", {
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
            timeout:60,
            rate: {
                startTime: 3,
                endTime: 7,
            },
        };
        let help = {
            headers: "暂时不用设置",
            downLoad: {
                timeout:"超时时间默为为60秒",
                rate: {
                    remark: "设置下载时间间隔,默认范围为3-7秒随机设置",
                    startTime: "下载间隔时间(秒)的开始值,类型为数字,",
                    endTime: "下载间隔时间(秒)的结束值,类型为数字",
                },
            },
        };
        if (await checkFileExists("waFiles/waConfig.toml")) {
            Deno.writeTextFileSync(
                "waFiles/waConfig.toml",
                Toml.stringify({ headers: headers, downLoad: downLoad, help: help }),
            );

            // writeJsonSync('waFiles/waConfig.toml', { headers: headers, downLoad: downLoad, help: help }, { spaces: 2 });
        } else {
            await Deno.mkdir("waFiles", { recursive: true });
            // writeJsonSync('waFiles/waConfig.toml', { headers: headers, downLoad: downLoad, help: help }, { spaces: 2 });
            Deno.writeTextFileSync(
                "waFiles/waConfig.toml",
                Toml.stringify({ headers: headers, downLoad: downLoad, help: help }),
            );
        }

        console.log("文件已生成:waFiles/waConfig.toml");
    } catch (error) {
        console.log(error);
    }
};

const viewInfoStep = async (url) => {
    return await fetch(url, {
        method: "GET",
        // responseType: 'stream'
        headers: {
            // "Content-Type":"image/jpeg"
            //   "Accept":
            //     "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            //   "Accept-Encoding": "gzip, deflate, br",
            //   "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",

            //   "Host": "babel.hathitrust.org",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",

        },
        signal: AbortSignal.timeout(1000*60),
    });
}
export const viewInfo = async (url) => {
    const response = await fetch(url, {
        method: "GET",
        // responseType: 'stream'
        headers: {
            // "Content-Type":"image/jpeg"
            //   "Accept":
            //     "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            //   "Accept-Encoding": "gzip, deflate, br",
            //   "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",

            //   "Host": "babel.hathitrust.org",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",

        },
        signal: AbortSignal.timeout(1000*60),
    });

    const html = await response.text()



    // console.log(html)

    let values = html.match(/(?<=<A.*href=")([^"]*)(?=")/g);

    let htmlUrls = []
    let pdfUrls = []
    for (const item of values) {


        if (item.endsWith('.html')) {
            let vol = parseInt(item.split('_').pop().replace('.html', ''))
            htmlUrls.push({ url: item, vol: vol })
        }
        if (item.endsWith('.pdf')) {
            // pdfUrls.push(item)
            let page = parseInt(item.split('_').pop().replace('.pdf', ''))
            pdfUrls.push({ url: item, page: page })
        }

    }
    htmlUrls.sort((a, b) => a.vol - b.vol)
    // const promise = htmlUrls.map(item => {
    //     return viewInfoStep(`${url}\\${item.url}`)
    // })

    let urls = []
    var page = 1
    for (const item of htmlUrls) {

        console.log(item)
        const vol = item.vol

        const baseUrl = `${url}/${item.url.split('/')[0]}`

        const infoRes = await viewInfoStep(`${url}\\${item.url}`)

        const infoHtml = await infoRes.text()
        let valuesArr = infoHtml.match(/(?<=<A.*href=")([^"]*)(?=")/g);
        for (const itemhef of valuesArr) {
            let volPage = parseInt(itemhef.split('p')[1].replace('.jpg'))

            urls.push({ url: `${baseUrl}/${itemhef}`, vol: vol, volPage: volPage, page: page })
            page++

        }


    }
    // console.log(urls)
    urls.sort((a, b) => a.page - b.page)

    pdfUrls.sort((a, b) => a.page - b.page)
    // console.log(htmlUrls)
    // console.log(pdfUrls)


    return { urls, pdfUrls }


}