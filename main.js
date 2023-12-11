import yargs from "https://deno.land/x/yargs/deno.ts";

import * as Hathitrust from "./hathitrust.js";
import * as Nl from "./nl.js";
import * as Ko from "./kostma.js";

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  yargs(Deno.args)
    .command("haget", "下载hathitrust.org图书", (yargs) => {
      return yargs.option("id", {
        type: "string",
        description: "文件id",
        alias: "i",
        demandOption: true,
      })
        .option("start", {
          type: "string",
          description: "起始页面",
          alias: "s",
          demandOption: true,
        }).option("end", {
          type: "string",
          description: "结束页面",
          alias: "e",
          demandOption: true,
        });
    }, async (argv) => {
      // console.info('2333')
      // console.info(argv)

      const urls = Hathitrust.generateUrls(
        argv.id,
        parseInt(argv.start),
        parseInt(argv.end),
      );
      await Deno.mkdir("haFiles", { recursive: true });

      //打断顺序
      urls.sort(() => Math.random() - 0.5);
      // console.log(urls)
      await Hathitrust.downLoadImages(urls);
    })
    .command(
      "rhaget",
      "如果有失败记录(文件位于haFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        const urls = await Hathitrust.undownLoad();
        //打断顺序
        urls.sort(() => Math.random() - 0.5);
        // console.log(urls)
        if (urls.length > 0) {
          await Hathitrust.downLoadImages(urls);
        } else {
          console.log("已全完下载!");
        }
      },
    )
    .command(
      "haconfig",
      "生成配置文haconfig.json(文件位于haFiles/haconfig.json)",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Hathitrust.config();
        // //打断顺序
        // urls.sort(() => Math.random() - 0.5)
        // // console.log(urls)
        // if (urls.length > 0) {
        //   await Hathitrust.downLoadImages(urls)
        // } else {
        //   console.log('已全完下载!')
        // }
      },
    )
    .command(
      "nlget",
      "下载韩国国立图书馆藏(https://www.nl.go.kr/)书籍",
      (yargs) => {
        return yargs.option("cno", {
          type: "string",
          description: "文件id",
          alias: "c",
          demandOption: true,
        })
          .option("vol", {
            type: "string",
            description: "文件册数",
            alias: "v",
            demandOption: true,
          }).option("start", {
            type: "string",
            description: "起始页",
            alias: "s",
            demandOption: true,
          }).option("end", {
            type: "string",
            description: "终止页",
            alias: "e",
            demandOption: true,
          });
      },
      async (argv) => {
        // console.info('2333')
        console.info(argv);

        const urls = Nl.generateUrls(
          argv.cno,
          parseInt(argv.vol),
          parseInt(argv.start),
          parseInt(argv.end),
        );
        console.log(urls);
        await Deno.mkdir("nlFiles", { recursive: true });
        // //打断顺序
        // urls.sort(() => Math.random() - 0.5)
        // console.log(urls)
        await Nl.downLoadImages(urls);
      },
    )
    .command(
      "rnlget",
      "如果有失败记录(文件位于nlFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        const urls = await Nl.undownLoad();
        console.log(urls);

        if (urls.length > 0) {
          await Nl.downLoadImages(urls);
        } else {
          console.log("已全完下载!");
        }
      },
    )
    .command(
      "nlconfig",
      "生成配置文nlconfig.json(文件位于nlFiles/nlconfig.json)",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Nl.config();
      },
    )
    .command(
      "koget",
      "下载高丽大学图书馆(http://kostma.korea.ac.kr/)",
      (yargs) => {
        return yargs.option("uci", {
          type: "string",
          description: "文件id",
          alias: "u",
          demandOption: true,
        })
          .option("start", {
            type: "string",
            description: "起始页",
            alias: "s",
            demandOption: true,
          }).option("end", {
            type: "string",
            description: "终止页",
            alias: "e",
            demandOption: true,
          });
      },
      async (argv) => {
        // console.info('2333')
        console.info(argv);

        const urls = Ko.generateUrls(
          argv.uci,
          parseInt(argv.start),
          parseInt(argv.end),
        );
        console.log(urls);
        await Deno.mkdir("koFiles", { recursive: true });
        // //打断顺序
        // urls.sort(() => Math.random() - 0.5)
        // console.log(urls)
        await Ko.downLoadImages(urls);
      },
    )
    .command(
      "rkoget",
      "如果有失败记录(文件位于koFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        const urls = await Nl.undownLoad();
        console.log(urls);

        if (urls.length > 0) {
          await Nl.downLoadImages(urls);
        } else {
          console.log("已全完下载!");
        }
      },
    )
    .command(
      "koconfig",
      "生成配置文koconfig.json(文件位于koFiles/koconfig.json)",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Ko.config();
      },
    )
    .example(
      "book-fetch.exe haget  -i hvd.32044067943118  -s 1 -e 305 ",
      "下载示例说明",
    )
    .example("book-fetch.exe rhaget ", "重试示例说明")
    .example(
      "book-fetch.exe haconfig ",
      "生成配置文件(位于haFiles/rhaConfig.toml)",
    )
    .example(
      "book-fetch.exe nlget -c CNTS-00109637789 -v 1 -s 1 -e 3  ",
      "nlget下载示例",
    )
    .example("book-fetch.exe rnlget  ", "rnlget下载示例")
    .example(
      "book-fetch.exe nlconfig ",
      "生成配置文件(位于nlFiles/nlConfig.toml)",
    )
    .example(
      "book-fetch.exe  koget -u RIKS+CRMA+KSM-WZ.1893.0000-20090716.AS_SA_244 -s 1 -e 57   ",
      "koget下载示例",
    )
    .example("book-fetch.exe rkoget  ", "rkoget重试示例")
    .example(
      "book-fetch.exe koconfig ",
      "生成配置文件(位于koFiles/koConfig.toml)",
    )
    .strictCommands()
    .scriptName("book-fetch.exe")
    .demandCommand(1)
    .parse();
}

//http://kostma.korea.ac.kr/viewer/viewerDes?uci=RIKS+CRMA+KSM-WZ.1865.0000-20170331.KY_W_283&bookNum=&pageNum=

//http://kostma.korea.ac.kr/viewer/viewerDes?uci=RIKS+CRMA+KSM-WZ.1893.0000-20090716.AS_SA_244&bookNum=&pageNum=
