import yargs from "https://deno.land/x/yargs/deno.ts";

import * as Hathitrust from "./hathitrust.js";
import * as Nl from "./nl.js";
import * as Os from "./ostasien.js";
import * as Ko from "./kostma.js";
import * as GitHubAction from "./githubAction.js";

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  yargs(Deno.args)
    .usage("book-fetch [command]")
    .wrap(200)
    .command("hafetch", "下载hathitrust.org图书", (yargs) => {
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
      console.log("bookFetchStart:hafetch");
      const urls = Hathitrust.generateUrls(
        argv.id,
        parseInt(argv.start),
        parseInt(argv.end),
      );
      await Deno.mkdir("haFiles", { recursive: true });

      //打断顺序
      // urls.sort(() => Math.random() - 0.5);
      // console.log(urls)
      await Hathitrust.downLoadImages(urls);

      console.log("bookFetchEnd:hafetch");
    })
    .command(
      "rhafetch",
      "如果有失败记录(文件位于haFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:rhafetch");

        const urls = await Hathitrust.undownLoad();
        //打断顺序
        urls.sort(() => Math.random() - 0.5);
        // console.log(urls)
        if (urls.length > 0) {
          await Hathitrust.downLoadImages(urls);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:rhafetch");
      },
    )
    .command(
      "haconfig",
      "生成配置文haconfig.json(文件位于haFiles/haconfig.toml)\n",
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
      "nlfetch",
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
        console.log("bookFetchStart:nlfetch");

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

        console.log("bookFetchEnd:nlfetch");
      },
    )
    .command(
      "rnlfetch",
      "如果有失败记录(文件位于nlFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:rnlfetch");

        const urls = await Nl.undownLoad();
        console.log(urls);

        if (urls.length > 0) {
          await Nl.downLoadImages(urls);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:rnlfetch");
      },
    )
    .command(
      "nlconfig",
      "生成配置文nlconfig.json(文件位于nlFiles/nlconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Nl.config();
      },
    )
    .command(
      "kofetch",
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
        console.log("bookFetchStart:kofetch");

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

        console.log("bookFetchEnd:kofetch");
      },
    )
    .command(
      "rkofetch",
      "如果有失败记录(文件位于koFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:rkofetch");
        const urls = await Nl.undownLoad();
        console.log(urls);

        if (urls.length > 0) {
          await Nl.downLoadImages(urls);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:rkofetch");
      },
    )
    .command(
      "koconfig",
      "生成配置文koconfig.json(文件位于koFiles/koconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Ko.config();
      },
    )
    .command(
      "osfetch",
      "下载巴伐利亞州立東亞圖書館(https://ostasien.digitale-sammlungen.de/)",
      (yargs) => {
        return yargs.option("id", {
          type: "string",
          description: "文件id",
          alias: "i",
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
        console.log("bookFetchStart:osfetch");

        const urls = Os.generateUrls(
          argv.id,
          parseInt(argv.start),
          parseInt(argv.end),
        );
        console.log(urls);
        await Deno.mkdir("osFiles", { recursive: true });
        // //打断顺序
        // urls.sort(() => Math.random() - 0.5)
        // console.log(urls)
        await Os.downLoadImages(urls);

        console.log("bookFetchEnd:osfetch");
      },
    )
    .command(
      "rosfetch",
      "如果有失败记录(文件位于osFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:rosfetch");
        const urls = await Os.undownLoad();
        console.log(urls);

        if (urls.length > 0) {
          await Os.downLoadImages(urls);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:rosfetch");
      },
    )
    .command(
      "osconfig",
      "生成配置文osconfig.json(文件位于osFiles/osconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Nl.config();
      },
    )
    .command(
      "actionfetch",
      "运行后端服务",
      (yargs) => {
        return yargs
        
        // .option("github", {
        //   type: "string",
        //   description: "指定平台",
        //   alias: "g",
        //   demandOption: true,
        // })
          .option("filename", {
            type: "string",
            description: "文件名默认为(files)",
            alias: "f",
            demandOption: false,
          })
          .option("command", {
            type: "string",
            description: "执行命令",
            alias: "c",
            demandOption: true,
          });
      },
      async (argv) => {
        // console.info('2333')
        console.log("bookFetchActionStart:github");
        console.info(argv);
        let fileName = "files";
        if (argv?.filename) {
          fileName = argv?.filename;
        }
        let command = argv?.command;
        console.log(fileName);
        try {
          const config = await GitHubAction.readConfig();
          let result = await GitHubAction.addTask({
            fileName,
            command,
            config,
          });
          const { url, number, title } = result;
          console.log("任务:" + title + "#" + number);
          console.log("详情:" + url);
      
        } catch (error) {
          console.log(error);
        }

        console.log("bookFetchActionEnd:github");
        Deno.exit(0);
      },
    )

    .command(
      "actionresult",
      "查看记录",
      (yargs) => {
        return yargs
        
        // .option("github", {
        //   type: "string",
        //   description: "指定平台",
        //   alias: "g",
        //   demandOption: true,
        // })
        
          .option("page", {
            type: "string",
            description: "查询第几页(默认第1页)",
            alias: "p",
            demandOption: false,
          })
          .option("pageSize", {
            type: "string",
            description: "每页几条(默认一页5条数据)",
            alias: "ps",
            demandOption: false,
          });
          ;

          
      },
      async (argv) => {
        // console.info('2333')
        console.log("bookFetchActionPageStart:github");
        console.info(argv);
        let page = "1";
        let pageSize = "5";
        if (argv?.page) {
          page = argv?.page;
        }
        if (argv?.pageSize) {
          pageSize = argv?.pageSize;
        }
    
        try {
          const config = await GitHubAction.readConfig();
          let result = await GitHubAction.listTaskResult({config, page:parseInt(page),pageSize:parseInt(pageSize)}) 
          console.log(result.map(item=>item.shareUrl).join('\n'))
          
      
        } catch (error) {
          console.log(error);
        }

        console.log("bookFetchActionPageEnd:github");
        Deno.exit(0);
      },
    )
    .command(
      "actioncfg",
      "生成配置文actionConfig.toml(文件位于gacFiles/actionConfig.toml)",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        try {
          await GitHubAction.config();
        } catch (error) {
          console.log(error);
        }
      },
    )
    .example(
      "book-fetch.exe hafetch  -i hvd.32044067943118  -s 1 -e 305 ",
      "下载示例说明",
    )
    .example("book-fetch.exe rhafetch ", "重试示例说明")
    .example(
      "book-fetch.exe haconfig ",
      "生成配置文件(位于haFiles/rhaConfig.toml)\n",
    )
    .example(
      "book-fetch.exe nlfetch -c CNTS-00109637789 -v 1 -s 1 -e 3  ",
      "nlfetch下载示例",
    )
    .example("book-fetch.exe rnlfetch  ", "rnlfetch下载示例")
    .example(
      "book-fetch.exe nlconfig ",
      "生成配置文件(位于nlFiles/nlConfig.toml)\n",
    )
    .example(
      "book-fetch.exe  kofetch -u RIKS+CRMA+KSM-WZ.1893.0000-20090716.AS_SA_244 -s 1 -e 57   ",
      "kofetch下载示例",
    )
    .example("book-fetch.exe rkofetch  ", "rkofetch重试示例")
    .example(
      "book-fetch.exe koconfig ",
      "生成配置文件(位于koFiles/koConfig.toml)\n",
    )
    .strictCommands()
    .scriptName("book-fetch.exe")
    .version("v1.0.0")
    .epilog("copyright 2023")
    .demandCommand(1)
    .parse();
}

//http://kostma.korea.ac.kr/viewer/viewerDes?uci=RIKS+CRMA+KSM-WZ.1865.0000-20170331.KY_W_283&bookNum=&pageNum=

//http://kostma.korea.ac.kr/viewer/viewerDes?uci=RIKS+CRMA+KSM-WZ.1893.0000-20090716.AS_SA_244&bookNum=&pageNum=
