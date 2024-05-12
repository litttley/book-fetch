import {
    DOMParser,
    Element,
  } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

export const downIndex = async (num,pageNum) => {






    let url = ``
   let param='1'
   if(pageNum!=1){
      param=pageNum+'01'
   } 
    if(num==1){

        url=`https://www.digital.archives.go.jp/DAS/meta/result?DEF_XSL=default&IS_KIND=hierarchy&IS_STYLE=default&DB_ID=G9100001EXTERNAL&GRP_ID=G9100001&IS_START=${param}&IS_NUMBER=100&IS_TAG_S51=prnid&IS_CND_S51=ALL&IS_KEY_S51=F2008112110364221711&ON_LYD=on&IS_EXTSCH=F9999999999999900000%2BF2009121017025600406%2BF2005031812174403109%2BF2008112110364221711&IS_SORT_FLD=sort.tror%2Csort.refc&IS_SORT_KND=asc&LIST_TYPE=default&IS_ORG_ID=F2008112110364221711&CAT_XML_FLG=on`
    }else if(num==2){
        url=`https://www.digital.archives.go.jp/DAS/meta/result?DEF_XSL=default&IS_KIND=hierarchy&IS_STYLE=default&DB_ID=G9100001EXTERNAL&GRP_ID=G9100001&IS_START=${param}&IS_NUMBER=100&IS_TAG_S51=prnid&IS_CND_S51=ALL&IS_KEY_S51=F2008112110370021712&ON_LYD=on&IS_EXTSCH=F9999999999999900000%2BF2009121017025600406%2BF2005031812174403109%2BF2008112110370021712&IS_SORT_FLD=sort.tror%2Csort.refc&IS_SORT_KND=asc&LIST_TYPE=default&IS_ORG_ID=F2008112110370021712&CAT_XML_FLG=on`
    }else if(num==3){
        url=`https://www.digital.archives.go.jp/DAS/meta/result?DEF_XSL=default&IS_KIND=hierarchy&IS_STYLE=default&DB_ID=G9100001EXTERNAL&GRP_ID=G9100001&IS_START=${param}&IS_NUMBER=100&IS_TAG_S51=prnid&IS_CND_S51=ALL&IS_KEY_S51=F2008112110371121713&ON_LYD=on&IS_EXTSCH=F9999999999999900000%2BF2009121017025600406%2BF2005031812174403109%2BF2008112110371121713&IS_SORT_FLD=sort.tror%2Csort.refc&IS_SORT_KND=asc&LIST_TYPE=default&IS_ORG_ID=F2008112110371121713&CAT_XML_FLG=on`
    }else if(num==4){
        url=`https://www.digital.archives.go.jp/DAS/meta/result?DEF_XSL=default&IS_KIND=hierarchy&IS_STYLE=default&DB_ID=G9100001EXTERNAL&GRP_ID=G9100001&IS_START=${param}&IS_NUMBER=100&IS_TAG_S51=prnid&IS_CND_S51=ALL&IS_KEY_S51=F2008112110372321714&ON_LYD=on&IS_EXTSCH=F9999999999999900000%2BF2009121017025600406%2BF2005031812174403109%2BF2008112110372321714&IS_SORT_FLD=sort.tror%2Csort.refc&IS_SORT_KND=asc&LIST_TYPE=default&IS_ORG_ID=F2008112110372321714&CAT_XML_FLG=on`
    }else if(num==5){
        url=`https://www.digital.archives.go.jp/DAS/meta/result?DEF_XSL=default&IS_KIND=hierarchy&IS_STYLE=default&DB_ID=G9100001EXTERNAL&GRP_ID=G9100001&IS_START=${param}&IS_NUMBER=100&IS_TAG_S51=prnid&IS_CND_S51=ALL&IS_KEY_S51=F2008112110373521715&ON_LYD=on&IS_EXTSCH=F9999999999999900000%2BF2009121017025600406%2BF2005031812174403109%2BF2008112110373521715&IS_SORT_FLD=sort.tror%2Csort.refc&IS_SORT_KND=asc&LIST_TYPE=default&IS_ORG_ID=F2008112110373521715&CAT_XML_FLG=on`
    }else if(num==6){
        url=`https://www.digital.archives.go.jp/DAS/meta/result?DEF_XSL=default&IS_KIND=hierarchy&IS_STYLE=default&DB_ID=G9100001EXTERNAL&GRP_ID=G9100001&IS_START=${param}&IS_NUMBER=100&IS_TAG_S51=prnid&IS_CND_S51=ALL&IS_KEY_S51=F2008112110374621716&ON_LYD=on&IS_EXTSCH=F9999999999999900000%2BF2009121017025600406%2BF2005031812174403109%2BF2008112110374621716&IS_SORT_FLD=sort.tror%2Csort.refc&IS_SORT_KND=asc&LIST_TYPE=default&IS_ORG_ID=F2008112110374621716&CAT_XML_FLG=on`
    }

    console.log(url)

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
    
    const elements = doc.querySelectorAll(".search_list>.slw3");
    let pagelist=[]
    for (const ele of elements) {
        let aele = ele.querySelector('.list_ti>a')
        let title = aele.textContent
        console.log(title)
        let spanEles = ele.querySelectorAll('.list_detail>li')
        let detail=''
        for (const ele2 of spanEles) {
           let text = ele2.textContent
           detail+= ` ${text.trim().replaceAll('\n\n',' ').replaceAll('\n',' ').replaceAll('			,',',') } `
        }

        pagelist.push({title,detail})
        
    }
    return pagelist
}
