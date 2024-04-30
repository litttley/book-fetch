import yargs from "https://deno.land/x/yargs/deno.ts";

import * as Hathitrust from "./hathitrust.js";
import * as Nl from "./nl.js";
import * as Os from "./ostasien.js";
import * as Ko from "./kostma.js";
import * as GitHubAction from "./githubAction.js";
import * as Aks from "./aks.js";
import * as RM from "./rmda.js";
import * as Gshare from "./gshare.js";
import * as Loc from "./loc.js";
import * as Dig from "./digital.js";
import * as Har from "./harvard.js";
import * as Was from "./waseda.js";
import * as Pr from "./princeton.js";
import * as Bo from "./bodleian.js";
import * as Sh from "./shanben.js";
import * as Ni from "./ni.js";
import * as Bn from "./bn.js";
import * as An from "./an.js";
import * as Nla from "./nla.js";
import * as Kan from "./kansai.js";
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

      try {
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
      } catch (error) {
        console.log(error?.message);
      }
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
      "nlbookindex",
      "下载old book类书目，书目下载保存到nlFiles/bookinde.md文件",
      (yargs) => {
        return yargs.option("start", {
          type: "string",
          description: "起始页",
          alias: "s",
          demandOption: true,
        }).option("end", {
          type: "string",
          description: "结束页",
          alias: "e",
          demandOption: true,
        });



        ;
      },
      async (argv) => {

        let start = parseInt(argv.start)
        let end = parseInt(argv.end) + 1

        let bookindexs = []
        for (let i = start; i < end; i++) {

          try {
            let result = await Nl.downIndex(i);

            bookindexs.push({ page: i, result })
            // console.log(bookindexs)
            // break
          } catch (error) {
            console.log(error)
            await Deno.writeTextFile(
              "nlFiles/indexundownLoad.txt",
              JSON.stringify({
                pageNum: i,
             
              }) + "\n",
              { append: true },
            );
          }



        }

        let markdown = ''

        let index=1
        for (const item of bookindexs) {
          let rsults = item.result

          for (const result of rsults) {
            markdown += `${index}. ${result.text}\n\n`
            markdown+=`${result.comment1} ${result.comment2} ${result.comment3} ${result.comment4}\n\n`
            index++
          }



        }
        await Deno.mkdir("nlFiles", { recursive: true });
        Deno.writeTextFile(`./nlFiles/bookIndex${start}-${end}.md`,markdown)

      },
    )

    .command(
      "rnlbookindex",
      "如果有失败记录(文件位于nlFiles/indexundownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:rnlbookindex");

        const urls = await Nl.indexundownLoad();
        console.log(urls);
      let bookindexs=[]
        for (const item of urls) {

          try {
            let result =   await Nl.downIndex(item.pageNum);
            bookindexs.push({ page: item.pageNum, result })
          } catch (error) {
            console.log(error)
            await Deno.writeTextFile(
              "nlFiles/indexundownLoad.txt",
              JSON.stringify({
                pageNum: i,
             
              }) + "\n",
              { append: true },
            );
          }
   
        }

        let markdown = ''

        let index=1
        for (const item of bookindexs) {
          let rsults = item.result

          for (const result of rsults) {
            markdown += `${index}. ${result.text}\n\n`
            markdown+=`${result.comment1} ${result.comment2} ${result.comment3} ${result.comment4}\n\n`
            index++
          }



        }
        await Deno.mkdir("nlFiles", { recursive: true });
        Deno.writeTextFile(`./nlFiles/bookIndex-补.md`,markdown)
        console.log("bookFetchEnd:rnlbookindex");
      },
    )

    .command(
      "kofetchlist",
      "查看下载详情",
      (yargs) => {
        return yargs.option("uci", {
          type: "string",
          description: "文件id",
          alias: "u",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:kofetchlist");

        try {


          const urls = await Ko.viewInfo(argv.uci);

          console.log(`下载列表:+${urls.length}`);
          const consoleUrls = urls.map((item) => {
            return `${item.url} vol=${item.vol} page=${item.page}`;
          }).join("\n");

          console.log(consoleUrls);

          await Deno.mkdir("koFiles", { recursive: true });
          // writeJsonSync('haFiles/haConfig.toml', { headers: headers, downLoad: downLoad, help: help }, { spaces: 2 });
          Deno.writeTextFileSync(
            "koFiles/koListInfo.txt",
            `下载列表:+${urls.length}\n${consoleUrls}\n`,
          );
          console.log("已保存至:koFiles/koListInfo.txt");
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:kofetchlist");
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

        const urls = await Ko.generateUrls(
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
          }).option("maxHeight", {
            type: "string",
            description: "文件高度限制(默认下载最大)",
            alias: "h",
            // demandOption: true,
          })
          .option("maxWidth", {
            type: "string",
            description: "文件宽限制(默认下载最大)",
            alias: "w",
            // demandOption: true,
          });

        ;
      },
      async (argv) => {
        // console.info('2333')
        console.log("bookFetchStart:osfetch");
        try {
          const urls = await Os.generateUrls(
            argv.id,
            parseInt(argv.start),
            parseInt(argv.end),
          );
          console.log(urls);
          await Deno.mkdir("osFiles", { recursive: true });
          // //打断顺序
          // urls.sort(() => Math.random() - 0.5)
          // console.log(urls)

          console.log(
            urls.map((item) => `${item.url} page=${item.page}`).join("\n"),
          );

          let maxHeight = argv?.maxHeight;
          let maxWidth = argv?.maxWidth;
          let command = ["-l"];
          if (maxHeight) {
            command = ["-h", parseInt(maxHeight)];
          }
          if (maxWidth) {
            command = ["-w", parseInt(maxWidth)];
          }

          if (maxHeight && maxWidth) {
            command = ["-h", parseInt(maxWidth), "-w", parseInt(maxWidth)];
          }


          await Os.downLoadImages(urls, command);
        } catch (error) {
          console.log(error?.message)
        }




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
          let command = urls[0].command;
          await Os.downLoadImages(urls, command);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:rosfetch");
      },
    )
    .command(
      "osfetchdpi",
      "查看图片分辨率详情",
      (yargs) => {
        return yargs.option("id", {
          type: "string",
          description: "文件id",
          alias: "i",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:osfetchdpi");

        try {
          await Os.viewDpi(argv.id);
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:osfetchdpi");
      },
    )
    .command(
      "osconfig",
      "生成配置文osconfig.json(文件位于osFiles/osconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Os.config();
      },
    )
    .command(
      "akfetch",
      "下载韩国收藏阁(https://jsg.aks.ac.kr/)",
      (yargs) => {
        return yargs.option("url", {
          type: "string",
          description: "文件url",
          alias: "u",
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
        })
          .option("maxHeight", {
            type: "string",
            description: "文件高度限制(默认下载最大)",
            alias: "h",
            // demandOption: true,
          })
          .option("maxWidth", {
            type: "string",
            description: "文件宽限制(默认下载最大)",
            alias: "w",
            // demandOption: true,
          });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:akfetch");
        // Aks

        const urls = await Aks.generateUrls(
          argv.url,
          parseInt(argv.start),
          parseInt(argv.end),
        );

        let maxHeight = argv?.maxHeight;
        let maxWidth = argv?.maxWidth;
        let command = ["-l"];
        if (maxHeight) {
          command = ["-h", parseInt(maxHeight)];
        }
        if (maxWidth) {
          command = ["-w", parseInt(maxWidth)];
        }

        if (maxHeight && maxWidth) {
          command = ["-h", parseInt(maxWidth), "-w", parseInt(maxWidth)];
        }

        console.log(urls);
        await Deno.mkdir("askFiles", { recursive: true });
        await Aks.downLoadImages(urls, command);

        console.log("bookFetchEnd:akfetch");
      },
    )
    .command(
      "rakfetch",
      "如果有失败记录(文件位于aksFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:rakfetch");
        const urls = await Aks.undownLoad();
        console.log(urls);

        if (urls.length > 0) {
          let command = urls[0].command;
          await Aks.downLoadImages(urls, command);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:rakfetch");
      },
    )
    .command(
      "akconfig",
      "生成配置文akconfig.json(文件位于akFiles/akconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Aks.config();
      },
    )
    .command(
      "akfetchdpi",
      "查看图片分辨率详情",
      (yargs) => {
        return yargs.option("url", {
          type: "string",
          description: "文件url",
          alias: "u",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:akfetchdpi");

        try {
          await Aks.viewDpi(argv.url);
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:akfetchdpi");
      },
    )
    .command(
      "rmfetch",
      "下载京都大学(https://rmda.kulib.kyoto-u.ac.jp/)",
      (yargs) => {
        return yargs
          .option("id", {
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
          })
          .option("maxHeight", {
            type: "string",
            description: "文件高度限制(默认下载最大)",
            alias: "h",
            // demandOption: true,
          })
          .option("maxWidth", {
            type: "string",
            description: "文件宽限制(默认下载最大)",
            alias: "w",
            // demandOption: true,
          });
      },
      async (argv) => {
        console.log(argv);
        console.log("bookFetchStart:rmfetch");
        // Aks()
        const urls = await RM.generateUrls(
          argv.id,
          parseInt(argv.start),
          parseInt(argv.end),
        );
        let maxHeight = argv?.maxHeight;
        let maxWidth = argv?.maxWidth;
        let command = ["-l"];
        if (maxHeight) {
          command = ["-h", parseInt(maxHeight)];
        }
        if (maxWidth) {
          command = ["-w", parseInt(maxWidth)];
        }

        if (maxHeight && maxWidth) {
          command = ["-h", parseInt(maxWidth), "-w", parseInt(maxWidth)];
        }

        // console.log(command)

        console.log(urls);

        await Deno.mkdir("rmFiles", { recursive: true });
        await RM.downLoadImages(urls, command);

        console.log("bookFetchEnd:rmfetch");
      },
    )
    .command(
      "rrmfetch",
      "如果有失败记录(文件位于aksFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:rrmfetch");
        const urls = await RM.undownLoad();

        if (urls) {
          let command = urls[0].command;

          await RM.downLoadImages(urls, command);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:rrmfetch");
      },
    )
    .command(
      "rmfetchdpi",
      "查看图片分辨率详情",
      (yargs) => {
        return yargs.option("id", {
          type: "string",
          description: "文件id",
          alias: "i",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:rmfetchdpi");
        // Aks()
        // const urls = await RM.generateUrls(
        //   argv.id,
        //   parseInt(argv.start),
        //   parseInt(argv.end),
        // );

        try {
          await RM.viewDpi(argv.id);
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:rmfetchdpi");
      },
    )
    .command(
      "rmconfig",
      "生成配置文akconfig.json(文件位于rmFiles/rmconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await RM.config();
      },
    )
    // https://www.loc.gov/item/c68002496/
    .command(
      "lofetch",
      "美国国会图书馆(https://www.loc.gov/)",
      (yargs) => {
        return yargs
          .option("id", {
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
          })
          .option("maxHeight", {
            type: "string",
            description: "文件高度限制(默认下载最大)",
            alias: "h",
            // demandOption: true,
          })
          .option("maxWidth", {
            type: "string",
            description: "文件宽限制(默认下载最大)",
            alias: "w",
            // demandOption: true,
          });
      },
      async (argv) => {
        // console.log(argv)
        console.log("11");
        console.log("bookFetchStart:lofetch");
        // Aks()
        const urls = await Loc.generateUrls(
          argv.id,
          // parseInt(argv.vol),
          parseInt(argv.start),
          parseInt(argv.end),
        );

        console.log(urls);

        let maxHeight = argv?.maxHeight;
        let maxWidth = argv?.maxWidth;
        let command = ["-l"];
        if (maxHeight) {
          command = ["-h", parseInt(maxHeight)];
        }
        if (maxWidth) {
          command = ["-w", parseInt(maxWidth)];
        }

        if (maxHeight && maxWidth) {
          command = ["-h", parseInt(maxWidth), "-w", parseInt(maxWidth)];
        }

        // console.log(command)
        let consoleText = urls.map((item) => `${item.url} page=${item.page}`)
          .join("\n");
        console.log(consoleText);
        // console.log(urls);

        await Deno.mkdir("loFiles", { recursive: true });

        //  let sse =    await Loc.getJsonInfo('https://www.loc.gov/resource/lcnclscd.c68002496.1A001/?sp=1')

        //  console.log(sse)
        await Loc.downLoadImages(urls, command);

        console.log("bookFetchEnd:lofetch");
      },
    )
    .command(
      "rlofetch",
      "如果有失败记录(文件位于loFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:lofetch");
        const urls = await Loc.undownLoad();
        console.log(urls);

        if (urls.length > 0) {
          let command = urls[0].command;
          await Loc.downLoadImages(urls, command);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:lofetch");
      },
    )

    .command(
      "lofetchlist",
      "查看下载详情",
      (yargs) => {
        return yargs.option("id", {
          type: "string",
          description: "文件id",
          alias: "i",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:lofetchlist");

        try {
          const urls = await Loc.viewInfo(argv.id);




          const consoleUrls = urls.map((item) => {
            return `${item.url} vol=${item.vol} volPage=${item.volPage} page=${item.page}`;
          }).join("\n");
          console.log(`详情列表+${urls.length}`);
          console.log(consoleUrls);



          await Deno.mkdir("loFiles", { recursive: true });
          // writeJsonSync('haFiles/haConfig.toml', { headers: headers, downLoad: downLoad, help: help }, { spaces: 2 });
          Deno.writeTextFileSync(
            "loFiles/loListInfo.txt",
            `详情列表+${urls.length}:\n${consoleUrls}\n`,
          );
          console.log("已保存至:loFiles/loListInfo.txt");
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:prfetchlist");
      },
    )
    .command(
      "loconfig",
      "生成配置文loconfig.json(文件位于rmFiles/loconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Loc.config();
      },
    )
    .command(
      "lofetchdpi",
      "查看图片分辨率详情",
      (yargs) => {
        return yargs.option("id", {
          type: "string",
          description: "文件id",
          alias: "i",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:lofetchdpi");
        // Aks()
        // const urls = await RM.generateUrls(
        //   argv.id,
        //   parseInt(argv.start),
        //   parseInt(argv.end),
        // );

        try {
          await Loc.viewDpi(argv.id);
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:rmfetchdpi");
      },
    )
    //https://digital.staatsbibliothek-berlin.de/werkansicht?PPN=PPN3303598916&PHYSID=PHYS_0008&DMDID=DMDLOG_0001
    .command(
      "difetch",
      "德国柏林国立图书馆(https://digital.staatsbibliothek-berlin.de/)",
      (yargs) => {
        return yargs
          .option("ppn", {
            type: "string",
            description: "文件id",
            alias: "p",
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
          })
          .option("maxHeight", {
            type: "string",
            description: "文件高度限制(默认下载最大)",
            alias: "h",
            // demandOption: true,
          })
          .option("maxWidth", {
            type: "string",
            description: "文件宽限制(默认下载最大)",
            alias: "w",
            // demandOption: true,
          });
      },
      async (argv) => {
        // console.log(argv)

        console.log("bookFetchStart:difetch");
        // Aks()
        const urls = await Dig.generateUrls(
          argv.ppn,
          // parseInt(argv.vol),
          parseInt(argv.start),
          parseInt(argv.end),
        );

        // console.log(urls)

        let maxHeight = argv?.maxHeight;
        let maxWidth = argv?.maxWidth;
        let command = ["-l"];
        if (maxHeight) {
          command = ["-h", parseInt(maxHeight)];
        }
        if (maxWidth) {
          command = ["-w", parseInt(maxWidth)];
        }

        if (maxHeight && maxWidth) {
          command = ["-h", parseInt(maxWidth), "-w", parseInt(maxWidth)];
        }

        // const NewCommand=[...command,'-H','Referer:https://digital.staatsbibliothek-berlin.de/','-H','User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0']

        // // console.log(command)
        let consoleText = urls.map((item) => `${item.url} page=${item.page}`)
          .join("\n");
        console.log(consoleText);
        // // console.log(urls);

        await Deno.mkdir("diFiles", { recursive: true });

        console.log(command);
        await Dig.downLoadImages(urls, command);

        console.log("bookFetchEnd:difetch");
      },
    )
    .command(
      "rdifetch",
      "如果有失败记录(文件位于diFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:rdifetch");
        const urls = await Dig.undownLoad();
        console.log(urls);

        if (urls.length > 0) {
          let command = urls[0].command;
          // const NewCommand=[...command,'-H','Referer:https://digital.staatsbibliothek-berlin.de/','-H','User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0']
          await Dig.downLoadImages(urls, command);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:rdifetch");
      },
    )
    .command(
      "difetchdpi",
      "查看图片分辨率详情",
      (yargs) => {
        return yargs.option("ppn", {
          type: "string",
          description: "文件id",
          alias: "p",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:difetchdpi");
        // Aks()
        // const urls = await RM.generateUrls(
        //   argv.id,
        //   parseInt(argv.start),
        //   parseInt(argv.end),
        // );

        try {
          await Dig.viewDpi(argv.ppn);
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:rmfetchdpi");
      },
    )
    .command(
      "diconfig",
      "生成配置文diconfig.json(文件位于diFiles/diconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Dig.config();
      },
    )
    //https://curiosity.lib.harvard.edu/chinese-rare-books
    //https://curiosity.lib.harvard.edu/chinese-rare-books/catalog/49-990032703120203941

    .command(
      "harfetch",
      "哈佛大学图书馆(https://curiosity.lib.harvard.edu/chinese-rare-books/catalog?search_field=all_fields)",
      (yargs) => {
        return yargs
          .option("url", {
            type: "string",
            description: "文件url",
            alias: "u",
            demandOption: true,
          })
          .option("type", {
            type: "string",
            description: "0:使用地址url下载1:使用manifest url",
            alias: "t",
            // demandOption: false,
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
          })
          .option("maxHeight", {
            type: "string",
            description: "文件高度限制(默认下载最大)",
            alias: "h",
            // demandOption: true,
          })
          .option("maxWidth", {
            type: "string",
            description: "文件宽限制(默认下载最大)",
            alias: "w",
            // demandOption: true,
          });
      },
      async (argv) => {
        // console.log(argv)

        console.log("bookFetchStart:harfetch");
        // Aks()
        let urls = null
        let type = argv?.type;

        if (type == '1') {

          urls = await Har.generateUrlsByManifest(
            argv.url,
            // parseInt(argv.vol),
            parseInt(argv.start),
            parseInt(argv.end),
          );
        } else {

          urls = await Har.generateUrls(
            argv.url,
            // parseInt(argv.vol),
            parseInt(argv.start),
            parseInt(argv.end),
          );
        }


        console.log(urls)

        let maxHeight = argv?.maxHeight;
        let maxWidth = argv?.maxWidth;
        let command = ["-l"];
        if (maxHeight) {
          command = ["-h", parseInt(maxHeight)];
        }
        if (maxWidth) {
          command = ["-w", parseInt(maxWidth)];
        }

        if (maxHeight && maxWidth) {
          command = ["-h", parseInt(maxWidth), "-w", parseInt(maxWidth)];
        }

        // const NewCommand=[...command,'-H','Referer:https://digital.staatsbibliothek-berlin.de/','-H','User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0']

        // // console.log(command)
        let consoleText = urls.map((item) => `${item.url} page=${item.page}`)
          .join("\n");
        console.log(consoleText);
        // // // console.log(urls);

        await Deno.mkdir("harFiles", { recursive: true });

        // console.log(command);
        await Har.downLoadImages(urls, command);

        console.log("bookFetchEnd:difetch");
      },
    )
    .command(
      "rharfetch",
      "如果有失败记录(文件位于harFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:rharfetch");
        const urls = await Har.undownLoad();
        console.log(urls);

        if (urls.length > 0) {
          let command = urls[0].command;
          // const NewCommand=[...command,'-H','Referer:https://digital.staatsbibliothek-berlin.de/','-H','User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0']
          await Har.downLoadImages(urls, command);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:rdifetch");
      },
    )
    .command(
      "harfetchdpi",
      "查看图片分辨率详情",
      (yargs) => {
        return yargs.option("url", {
          type: "string",
          description: "文件id",
          alias: "u",
          demandOption: true,
        })
          .option("type", {
            type: "string",
            description: "0:使用地址栏url下载1:使用manifest url",
            alias: "t",
            demandOption: true,
          })
          ;
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:difetchdpi");
        // Aks()
        // const urls = await RM.generateUrls(
        //   argv.id,
        //   parseInt(argv.start),
        //   parseInt(argv.end),
        // );

        try {

          let type = argv?.type

          if (type == '1') {
            await Har.viewDpiManifest(argv.url);
          } else {
            await Har.viewDpi(argv.url);
          }

        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:harfetchdpi");
      },
    )
    .command(
      "harconfig",
      "生成配置文harconfig.json(文件位于harFiles/harconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Har.config();
      },
    )

    .command(
      "harbookindex",
      "下载chinese-rubbings-collection书目下载保存到harFiles/bookindex.md文件",
      (yargs) => {
        return yargs.option("start", {
          type: "string",
          description: "起始页",
          alias: "s",
          demandOption: true,
        }).option("end", {
          type: "string",
          description: "结束页",
          alias: "e",
          demandOption: true,
        });



        ;
      },
      async (argv) => {

        let start = parseInt(argv.start)
        let end = parseInt(argv.end) 

        let bookindexs = []
        for (let i = start; i < end+1; i++) {
          console.log(`正下载第${i}页`)
          try {
            let result = await Har.downIndex(i);

            bookindexs.push({ page: i, result })
            // console.log(bookindexs)
    
          } catch (error) {
            console.log(error)
            await Deno.writeTextFile(
              "harFiles/indexundownLoad.txt",
              JSON.stringify({
                pageNum: i,
             
              }) + "\n",
              { append: true },
            );
          }



        }

        let markdown = ''

        let index=1
        for (const item of bookindexs) {
          let rsults = item.result

          for (const result of rsults) {
            markdown += `${result.text}\n\n`
            markdown+=`>${result.comment1}\n\n ${result.comment2} \n\n>${result.comment3}\n\n>${result.comment4}\n\n`
            index++
          }



        }
        await Deno.mkdir("harFiles", { recursive: true });
        Deno.writeTextFile(`./harFiles/bookIndex${start}-${end}.md`,markdown)
        Deno.writeTextFile(`./harFiles/bookIndex.json`,JSON.stringify(bookindexs))

      },
    )

    .command(
      "wafetch",
      "早稻田大学图馆(https://www.wul.waseda.ac.jp/kosho/)",
      (yargs) => {
        return yargs
          .option("url", {
            type: "string",
            description: "文件url",
            alias: "u",
            demandOption: true,
          })
          .option("type", {
            type: "string",
            description: "下载类型:(pdf,html),默认下载pdf",
            alias: "t",
            demandOption: false,
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
        // console.log(argv)

        console.log("bookFetchStart:wafetch");
        let type = "pdf";
        if (argv?.type == "html") {
          type = "html";
        }
        // Aks()
        const urls = await Was.generateUrls(
          argv.url,
          // parseInt(argv.vol),
          type,
          parseInt(argv.start),
          parseInt(argv.end),
        );

        console.log(urls);

        if (type == "html") {
          console.log("html详情列表:");

          const consoleUrls = urls.map((item) => {
            return `${item.url} vol=${item.vol} volPage=${item.volPage}  page=${item.page}`;
          }).join("\n");
          console.log(consoleUrls);
        } else {
          console.log("pdf列表:");
          const consolePdf = urls.map((item) => {
            return `${item.url} page=${item.page}`;
          }).join("\n");

          console.log(consolePdf);
        }

        await Deno.mkdir("waFiles", { recursive: true });

        // console.log(command);
        await Was.downLoadImages(urls);

        console.log("bookFetchEnd:difetch");
      },
    )
    .command(
      "rwafetch",
      "如果有失败记录(文件位于waFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:rwafetch");
        const urls = await Was.undownLoad();
        console.log(urls);

        if (urls.length > 0) {
          // const NewCommand=[...command,'-H','Referer:https://digital.staatsbibliothek-berlin.de/','-H','User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0']
          await Was.downLoadImages(urls);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:rwafetch");
      },
    )
    .command(
      "wafetchlist",
      "查看下载详情",
      (yargs) => {
        return yargs.option("url", {
          type: "string",
          description: "文件url",
          alias: "u",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:wafetchlist");

        try {
          const { urls, pdfUrls } = await Was.viewInfo(argv.url);

          console.log("pdf列表:");
          const consolePdf = pdfUrls.map((item) => {
            return `${item.url} page=${item.page}`;
          }).join("\n");

          console.log(consolePdf);
          console.log("html详情列表:");

          const consoleUrls = urls.map((item) => {
            return `${item.url} vol=${item.vol} volPage=${item.volPage}  page=${item.page}`;
          }).join("\n");
          console.log(consoleUrls);
          await Deno.mkdir("waFiles", { recursive: true });
          // writeJsonSync('haFiles/haConfig.toml', { headers: headers, downLoad: downLoad, help: help }, { spaces: 2 });
          Deno.writeTextFileSync(
            "waFiles/waListInfo.txt",
            `pdf列表:\n${consolePdf}\nhtml详情列表\n${consoleUrls}`,
          );
          console.log("已保存至:waFiles/waListInfo.txt");
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:wafetchlist");
      },
    )
    .command(
      "waconfig",
      "生成配置文waconfig.json(文件位于harFiles/waconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Was.config();
      },
    )
    //https://dpul.princeton.edu/eastasian/catalog/gh93h668k
    .command(
      "prfetch",
      "普林斯顿大学东亚图书馆(https://dpul.princeton.edu/eastasian)",
      (yargs) => {
        return yargs
          .option("url", {
            type: "string",
            description: "文件url",
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
          })
          .option("maxHeight", {
            type: "string",
            description: "文件高度限制(默认下载最大)",
            alias: "h",
            // demandOption: true,
          })
          .option("maxWidth", {
            type: "string",
            description: "文件宽限制(默认下载最大)",
            alias: "w",
            // demandOption: true,
          });
      },
      async (argv) => {
        // console.log(argv)

        console.log("bookFetchStart:prfetch");

        try {
          // Aks()
          const urls = await Pr.generateUrls(
            argv.url,
            parseInt(argv.start),
            parseInt(argv.end),
          );

          console.log(
            urls.map((item) => `${item.url} page=${item.page}`).join("\n"),
          );

          let maxHeight = argv?.maxHeight;
          let maxWidth = argv?.maxWidth;
          let command = ["-l"];
          if (maxHeight) {
            command = ["-h", parseInt(maxHeight)];
          }
          if (maxWidth) {
            command = ["-w", parseInt(maxWidth)];
          }

          if (maxHeight && maxWidth) {
            command = ["-h", parseInt(maxWidth), "-w", parseInt(maxWidth)];
          }

          await Deno.mkdir("prFiles", { recursive: true });

          // console.log(command);
          await Pr.downLoadImages(urls, command);
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:prfetch");
      },
    ).command(
      "rprfetch",
      "如果有失败记录(文件位于prFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:prfetch");
        const urls = await Pr.undownLoad();
        console.log(urls);

        if (urls.length > 0) {
          let command = urls[0].command;
          // const NewCommand=[...command,'-H','Referer:https://digital.staatsbibliothek-berlin.de/','-H','User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0']
          await Pr.downLoadImages(urls, command);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:prfetch");
      },
    )
    .command(
      "prfetchdpi",
      "查看图片分辨率详情",
      (yargs) => {
        return yargs.option("url", {
          type: "string",
          description: "文件url",
          alias: "u",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:prfetchdpi");

        try {
          await Pr.viewDpi(argv.url);
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:prfetchdpi");
      },
    )
    .command(
      "prfetchlist",
      "查看下载详情",
      (yargs) => {
        return yargs.option("url", {
          type: "string",
          description: "文件url",
          alias: "u",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:prfetchlist");

        try {
          const urls = await Pr.viewInfo(argv.url);




          const consoleUrls = urls.map((item) => {
            return `${item.url} vol=${item.vol} volPage=${item.volPage} page=${item.page}`;
          }).join("\n");
          console.log(`详情列表+${urls.length}`);
          console.log(consoleUrls);



          await Deno.mkdir("prFiles", { recursive: true });
          // writeJsonSync('haFiles/haConfig.toml', { headers: headers, downLoad: downLoad, help: help }, { spaces: 2 });
          Deno.writeTextFileSync(
            "prFiles/prListInfo.txt",
            `详情列表+${urls.length}:\n${consoleUrls}\n`,
          );
          console.log("已保存至:prFiles/prListInfo.txt");
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:prfetchlist");
      },
    )
    .command(
      "prconfig",
      "生成配置文prconfig.json(文件位于prFiles/prconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Pr.config();
      },
    )

    //https://digital.bodleian.ox.ac.uk/objects/5fb71c32-57a5-415a-868f-0ec6904838de/surfaces/dcd4921f-8b7b-4048-8fe7-11516932f84b/

    .command(
      "bofetch",
      "牛津大学博德利图书馆(https://digital.bodleian.ox.ac.uk/collections/chinese-digitization-project/)",
      (yargs) => {
        return yargs
          .option("id", {
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
          })
          .option("maxHeight", {
            type: "string",
            description: "文件高度限制(默认下载最大)",
            alias: "h",
            // demandOption: true,
          })
          .option("maxWidth", {
            type: "string",
            description: "文件宽限制(默认下载最大)",
            alias: "w",
            // demandOption: true,
          });
      },
      async (argv) => {
        // console.log(argv)

        console.log("bookFetchStart:bofetch");

        try {
          // Aks()
          const urls = await Bo.generateUrls(
            argv.id,
            parseInt(argv.start),
            parseInt(argv.end),
          );

          console.log(
            urls.map((item) => `${item.url} page=${item.page}`).join("\n"),
          );

          let maxHeight = argv?.maxHeight;
          let maxWidth = argv?.maxWidth;
          let command = ["-l"];
          if (maxHeight) {
            command = ["-h", parseInt(maxHeight)];
          }
          if (maxWidth) {
            command = ["-w", parseInt(maxWidth)];
          }

          if (maxHeight && maxWidth) {
            command = ["-h", parseInt(maxWidth), "-w", parseInt(maxWidth)];
          }

          await Deno.mkdir("boFiles", { recursive: true });

          // console.log(command);
          await Bo.downLoadImages(urls, command);
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:prfetch");
      },
    )

    .command(
      "rbofetch",
      "如果有失败记录(文件位于boFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:bofetch");
        const urls = await Bo.undownLoad();
        console.log(urls);

        if (urls.length > 0) {
          let command = urls[0].command;
          // const NewCommand=[...command,'-H','Referer:https://digital.staatsbibliothek-berlin.de/','-H','User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0']
          await Bo.downLoadImages(urls, command);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:bofetch");
      },
    )

    .command(
      "bofetchdpi",
      "查看图片分辨率详情",
      (yargs) => {
        return yargs.option("id", {
          type: "string",
          description: "文件id",
          alias: "i",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:bofetchdpi");

        try {
          await Bo.viewDpi(argv.id);
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:prfetchdpi");
      },
    )

    .command(
      "boconfig",
      "boconfig.json(文件位于boFiles/boconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Bo.config();
      },
    )

    .command(
      "shfetchlist",
      "查看下载详情",
      (yargs) => {
        return yargs.option("nu", {
          type: "string",
          description: "文件id",
          alias: "u",
          demandOption: true,
        }).option("no", {
          type: "string",
          description: "文件编号",
          alias: "o",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:shfetchlist");
        let url = `http://shanben.ioc.u-tokyo.ac.jp/main_p.php?nu=${argv.nu}&order=rn_no&no=${argv.no} `
        try {


          const { imageUrls, pdfUrls } = await Sh.viewInfo(url);




          const consolePdfUrls = pdfUrls.map((item) => {
            return `${item.url}   page=${item.page}`;
          }).join("\n");
          console.log(`pdf详情列表+${consolePdfUrls.length}`);
          console.log(consolePdfUrls);


          // const consoleImageUrls = imageUrls.map((item) => {
          //   return `${item.url}   page=${item.page}`;
          // }).join("\n");
          // console.log(`图片详情列表+${consoleImageUrls.length}`);
          // console.log(consoleImageUrls);


          await Deno.mkdir("shFiles", { recursive: true });
          // // writeJsonSync('haFiles/haConfig.toml', { headers: headers, downLoad: downLoad, help: help }, { spaces: 2 });
          Deno.writeTextFileSync(
            "shFiles/shListInfo.txt",
            `详情列表+${consolePdfUrls.length}:\n${consolePdfUrls}\n`,
          );
          // console.log("已保存至:prFiles/prListInfo.txt");
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:prfetchlist");
      },
    )
    .command(
      "shfetch",
      "东京大学图书馆(http://shanben.ioc.u-tokyo.ac.jp/)",
      (yargs) => {
        return yargs
          .option("nu", {
            type: "string",
            description: "文件id",
            alias: "u",
            demandOption: true,
          })
          .option("no", {
            type: "string",
            description: "文件编号",
            alias: "o",
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
          })

          ;
      },
      async (argv) => {
        // console.log(argv)

        console.log("bookFetchStart:shfetch");
        // Aks()
        const urls = await Sh.generateUrls(
          argv.nu,
          argv.no,
          // parseInt(argv.vol),
          parseInt(argv.start),
          parseInt(argv.end),
        );








        let consoleText = urls.map((item) => `${item.url} page=${item.page}`)
          .join("\n");
        console.log(consoleText);


        await Deno.mkdir("shFiles", { recursive: true });

        // console.log(command);
        await Sh.downLoadImages(urls);

        console.log("bookFetchEnd:shfetch");
      },
    )

    .command(
      "rshfetch",
      "如果有失败记录(文件位于shFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:bofetch");
        const urls = await Sh.undownLoad();
        console.log(urls);

        if (urls.length > 0) {


          await Sh.downLoadImages(urls);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:bofetch");
      },
    )

    .command(
      "shconfig",
      "生成配置文shconfig.json(文件位于shFiles/shconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Sh.config();
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

    //日本古典书籍的唯一门户网站
    //https://kokusho.nijl.ac.jp/?ln=ja


    .command(
      "nifetch",
      "日本古典书籍的唯一门户网站(https://kokusho.nijl.ac.jp/?ln=ja)",
      (yargs) => {
        return yargs
          .option("id", {
            type: "string",
            description: "文件id",
            alias: "i",
            demandOption: true,
          })
          // .option("no", {
          //   type: "string",
          //   description: "文件编号",
          //   alias: "o",
          //   demandOption: true,
          // })
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
          }).option("maxHeight", {
            type: "string",
            description: "文件高度限制(默认下载最大)",
            alias: "h",
            // demandOption: true,
          })
          .option("maxWidth", {
            type: "string",
            description: "文件宽限制(默认下载最大)",
            alias: "w",
            // demandOption: true,
          })

          ;
      },
      async (argv) => {
        // console.log(argv)

        console.log("bookFetchStart:nifetch");
        // Aks()
        const urls = await Ni.generateUrls(
          argv.id,

          // parseInt(argv.vol),
          parseInt(argv.start),
          parseInt(argv.end),
        );








        let consoleText = urls.map((item) => `${item.url} page=${item.page}`)
          .join("\n");
        console.log(consoleText);


        await Deno.mkdir("niFiles", { recursive: true });

        let maxHeight = argv?.maxHeight;
        let maxWidth = argv?.maxWidth;
        let command = ["-l"];
        if (maxHeight) {
          command = ["-h", parseInt(maxHeight)];
        }
        if (maxWidth) {
          command = ["-w", parseInt(maxWidth)];
        }

        if (maxHeight && maxWidth) {
          command = ["-h", parseInt(maxWidth), "-w", parseInt(maxWidth)];
        }

        await Ni.downLoadImages(urls, command);


        console.log("bookFetchEnd:nifetch");
      },
    )

    .command(
      "nifetchdpi",
      "查看图片分辨率详情",
      (yargs) => {
        return yargs.option("id", {
          type: "string",
          description: "文件id",
          alias: "i",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:nifetchdpi");

        try {
          await Ni.viewDpi(argv.id);
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:nifetchdpi");
      },
    )

    .command(
      "nifetchlist",
      "查看下载详情",
      (yargs) => {
        return yargs.option("id", {
          type: "string",
          description: "文件id",
          alias: "i",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:nifetchlist");

        try {


          const urls = await Ni.viewInfo(argv.id);




          const consoleUrls = urls.map((item) => {
            return `${item.url}   page=${item.page}`;
          }).join("\n");
          console.log(`pdf详情列表+${consoleUrls.length}`);
          console.log(consoleUrls);


          // const consoleImageUrls = imageUrls.map((item) => {
          //   return `${item.url}   page=${item.page}`;
          // }).join("\n");
          // console.log(`图片详情列表+${consoleImageUrls.length}`);
          // console.log(consoleImageUrls);


          await Deno.mkdir("niFiles", { recursive: true });
          // // writeJsonSync('haFiles/haConfig.toml', { headers: headers, downLoad: downLoad, help: help }, { spaces: 2 });
          Deno.writeTextFileSync(
            "niFiles/niListInfo.txt",
            `详情列表+${consoleUrls.length}:\n${consoleUrls}\n`,
          );
          // console.log("已保存至:prFiles/prListInfo.txt");
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:nifetchlist");
      },
    )

    .command(
      "rnifetch",
      "如果有失败记录(文件位于niFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:nifetch");
        const urls = await Ni.undownLoad();
        console.log(urls);

        if (urls.length > 0) {
          let command = urls[0].command;
          // const NewCommand=[...command,'-H','Referer:https://digital.staatsbibliothek-berlin.de/','-H','User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0']
          await Ni.downLoadImages(urls, command);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:bofetch");
      },
    )

    .command(
      "niconfig",
      "生成配置文niconfig.json(文件位于niFiles/niconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Ni.config();
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
      "bnfetch",
      "法国图书馆(https://gallica.bnf.fr/accueil/fr/content/accueil-fr?mode=desktop)",
      (yargs) => {
        return yargs
          .option("url", {
            type: "string",
            description: "文件url",
            alias: "u",
            demandOption: true,
          })
          // .option("no", {
          //   type: "string",
          //   description: "文件编号",
          //   alias: "o",
          //   demandOption: true,
          // })
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
          })

          // .option("maxHeight", {
          //   type: "string",
          //   description: "文件高度限制(默认下载最大)",
          //   alias: "h",
          //   // demandOption: true,
          // })
          // .option("maxWidth", {
          //   type: "string",
          //   description: "文件宽限制(默认下载最大)",
          //   alias: "w",
          //   // demandOption: true,
          // })

          ;
      },
      async (argv) => {
        // console.log(argv)

        console.log("bookFetchStart:bnfetch");
        // Aks()
        const urls = await Bn.generateUrls(
          argv.url,

          // parseInt(argv.vol),
          parseInt(argv.start),
          parseInt(argv.end),
        );








        let consoleText = urls.map((item) => `${item.url} page=${item.page}`)
          .join("\n");
        console.log(consoleText);


        await Deno.mkdir("bnFiles", { recursive: true });

        let maxHeight = argv?.maxHeight;
        let maxWidth = argv?.maxWidth;
        let command = ["-l"];
        if (maxHeight) {
          command = ["-h", parseInt(maxHeight)];
        }
        if (maxWidth) {
          command = ["-w", parseInt(maxWidth)];
        }

        if (maxHeight && maxWidth) {
          command = ["-h", parseInt(maxWidth), "-w", parseInt(maxWidth)];
        }

        await Bn.downLoadImages(urls, command);


        console.log("bookFetchEnd:bnfetch");
      },
    )

    .command(
      "bnfetchlist",
      "查看下载详情",
      (yargs) => {
        return yargs.option("url", {
          type: "string",
          description: "文件url",
          alias: "u",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:bnfetchlist");

        try {


          const urls = await Bn.viewInfo(argv.url);






          const consoleUrls = urls.map((item) => {
            return `${item.url}   page=${item.page}`;
          }).join("\n");
          console.log(`详情列表+${urls.length}`);
          console.log(consoleUrls);


          // const consoleImageUrls = imageUrls.map((item) => {
          //   return `${item.url}   page=${item.page}`;
          // }).join("\n");
          // console.log(`图片详情列表+${consoleImageUrls.length}`);
          // console.log(consoleImageUrls);


          await Deno.mkdir("bnFiles", { recursive: true });
          // // writeJsonSync('haFiles/haConfig.toml', { headers: headers, downLoad: downLoad, help: help }, { spaces: 2 });
          Deno.writeTextFileSync(
            "bnFiles/niListInfo.txt",
            `详情列表+${consoleUrls.length}:\n${consoleUrls}\n`,
          );
          // console.log("已保存至:prFiles/prListInfo.txt");
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:bnfetchlist");
      },
    )

    .command(
      "rbnfetch",
      "如果有失败记录(文件位于bnFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:bnfetch");
        const urls = await Bn.undownLoad();
        console.log(urls);

        if (urls.length > 0) {
          let command = urls[0].command;
          // const NewCommand=[...command,'-H','Referer:https://digital.staatsbibliothek-berlin.de/','-H','User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0']
          await Bn.downLoadImages(urls, command);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:bnfetch");
      },
    )

    // .command(
    //   "bnfetchdpi",
    //   "查看图片分辨率详情",
    //   (yargs) => {
    //     return yargs.option("url", {
    //       type: "string",
    //       description: "文件url",
    //       alias: "u",
    //       demandOption: true,
    //     });
    //   },
    //   async (argv) => {
    //     // console.log(argv)
    //     console.log("bookFetchStart:bnfetchdpi");

    //     try {
    //       await Bn.viewDpi(argv.url);
    //     } catch (error) {
    //       console.log(error?.message);
    //     }

    //     console.log("bookFetchEnd:bnfetchdpi");
    //   },
    // )

    .command(
      "bnconfig",
      "生成配置文bnconfig.json(文件位于bnFiles/bnconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Bn.config();
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


    //https://openresearch-repository.anu.edu.au/handle/1885/9199

    .command(
      "anfetch",
      "澳大利亚国立大学图书馆(https://openresearch-repository.anu.edu.au/handle/1885/9199)",
      (yargs) => {
        return yargs
          .option("url", {
            type: "string",
            description: "文件url",
            alias: "u",
            demandOption: true,
          })
          // .option("no", {
          //   type: "string",
          //   description: "文件编号",
          //   alias: "o",
          //   demandOption: true,
          // })
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
          })

          .option("type", {
            type: "string",
            description: "type[pdf,tif]默认pdf",
            alias: "t",
            // demandOption: true,
          })
          // .option("maxWidth", {
          //   type: "string",
          //   description: "文件宽限制(默认下载最大)",
          //   alias: "w",
          //   // demandOption: true,
          // })

          ;
      },
      async (argv) => {
        // console.log(argv)

        console.log("bookFetchStart:anfetch");
        let downType = 'pdf'
        if (argv.type == 'tif') {
          downType = argv.tif
        }
        const urls = await Kan.generateUrls(
          argv.url,

          // parseInt(argv.vol),
          parseInt(argv.start),
          parseInt(argv.end),
          downType
        );








        let consoleText = urls.map((item) => `${item.url} page=${item.page}`)
          .join("\n");
        console.log(consoleText);


        await Deno.mkdir("anFiles", { recursive: true });

        // let maxHeight = argv?.maxHeight;
        // let maxWidth = argv?.maxWidth;
        // let command = ["-l"];
        // if (maxHeight) {
        //   command = ["-h", parseInt(maxHeight)];
        // }
        // if (maxWidth) {
        //   command = ["-w", parseInt(maxWidth)];
        // }

        // if (maxHeight && maxWidth) {
        //   command = ["-h", parseInt(maxWidth), "-w", parseInt(maxWidth)];
        // }

        await An.downLoadImages(urls);


        console.log("bookFetchEnd:anfetch");
      },
    )


    .command(
      "anfetchlist",
      "查看下载详情",
      (yargs) => {
        return yargs.option("url", {
          type: "string",
          description: "文件url",
          alias: "u",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:anfetchlist");

        try {


          const { pdfUrls, tifUrls } = await An.viewInfo(argv.url);






          const consolePdfUrls = pdfUrls.map((item) => {
            return `${item.url}   page=${item.page}`;
          }).join("\n");
          console.log(`pdf详情列表+${pdfUrls.length}`);
          console.log(consolePdfUrls);


          const consoleTifUrls = tifUrls.map((item) => {
            return `${item.url}   page=${item.page}`;
          }).join("\n");
          console.log(`图片详情列表+${tifUrls.length}`);
          console.log(consoleTifUrls);


          await Deno.mkdir("anFiles", { recursive: true });
          // // writeJsonSync('haFiles/haConfig.toml', { headers: headers, downLoad: downLoad, help: help }, { spaces: 2 });
          Deno.writeTextFileSync(
            "anFiles/anListInfo.txt",
            `pdf详情列表+${pdfUrls.length}:\n${consolePdfUrls}\n\ntif详情列表+${tifUrls.length}:\n${consoleTifUrls}`,
          );
          // console.log("已保存至:prFiles/prListInfo.txt");
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:anfetchlist");
      },
    )

    .command(
      "nifetchdpi",
      "查看图片分辨率详情",
      (yargs) => {
        return yargs.option("id", {
          type: "string",
          description: "文件id",
          alias: "i",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:nifetchdpi");

        try {
          await Ni.viewDpi(argv.id);
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:nifetchdpi");
      },
    )

    .command(
      "ranfetch",
      "如果有失败记录(文件位于anFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:anfetch");
        const urls = await An.undownLoad();
        console.log(urls);

        if (urls.length > 0) {

          // const NewCommand=[...command,'-H','Referer:https://digital.staatsbibliothek-berlin.de/','-H','User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0']
          await An.downLoadImages(urls);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:bnfetch");
      },
    )

    .command(
      "anconfig",
      "生成配置文anconfig.json(文件位于anFiles/anconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await An.config();
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
      "nlafetch",
      "澳大利亚国家图书馆(https://catalogue.nla.gov.au/catalog?f%5Baccess_ssim%5D%5B%5D=National+Library+%28digitised+item%29&f%5Blanguage_ssim%5D%5B%5D=Chinese&search_field=subject)",
      (yargs) => {
        return yargs
          .option("url", {
            type: "string",
            description: "文件url",
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
          })

          .option("maxWidth", {
            type: "string",
            description: "文件宽限制(默认下载最大)",
            alias: "w",
            // demandOption: true,
          })
          // .option("maxHeight", {
          //   type: "string",
          //   description: "文件宽限制(默认下载最大)",
          //   alias: "w",
          //   // demandOption: true,
          // })

          ;
      },
      async (argv) => {
        // console.log(argv)

        console.log("bookFetchStart:nlafetch");

        let maxWidth = argv?.maxWidth;
        if (maxWidth) {
          maxWidth = parseInt(maxWidth)
        } else {
          maxWidth = -1
        }

        const urls = await Nla.generateUrls(
          argv.url,

          // parseInt(argv.vol),
          parseInt(argv.start),
          parseInt(argv.end),
          maxWidth

        );








        let consoleText = urls.map((item) => `${item.url} page=${item.page}`)
          .join("\n");
        console.log(consoleText);


        await Deno.mkdir("nlaFiles", { recursive: true });



        await Nla.downLoadImages(urls);


        console.log("bookFetchEnd:nlafetch");
      },
    )
    .command(
      "rnlafetch",
      "如果有失败记录(文件位于nlaFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:nlgfetch");
        const urls = await Nla.undownLoad();
        console.log(urls);

        if (urls.length > 0) {

          // const NewCommand=[...command,'-H','Referer:https://digital.staatsbibliothek-berlin.de/','-H','User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0']
          await Nla.downLoadImages(urls);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:nlgfetch");
      },
    )

    .command(
      "nlafetchlist",
      "查看下载详情",
      (yargs) => {
        return yargs.option("url", {
          type: "string",
          description: "文件url",
          alias: "u",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:nlafetchlist");

        try {


          const urls = await Nla.viewInfo(argv.url);






          const consoleUrls = urls.map((item) => {
            return `${item.url}   page=${item.page} maxWidth=${item.maxWidth}  maxHeight=${item.maxHeight}`;
          }).join("\n");
          console.log(`详情列表+${urls.length}`);
          console.log(consoleUrls);


          // const consoleTifUrls = tifUrls.map((item) => {
          //   return `${item.url}   page=${item.page}`;
          // }).join("\n");
          // console.log(`图片详情列表+${tifUrls.length}`);
          // console.log(consoleTifUrls);


          await Deno.mkdir("nlaFiles", { recursive: true });
          // // writeJsonSync('haFiles/haConfig.toml', { headers: headers, downLoad: downLoad, help: help }, { spaces: 2 });
          Deno.writeTextFileSync(
            "nlaFiles/nlaListInfo.txt",
            `详情列表+${urls.length}:\n${consoleUrls}\n`,
          );
          // console.log("已保存至:prFiles/prListInfo.txt");
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:nlafetchlist");
      },
    )

    .command(
      "nlaconfig",
      "生成配置文nlaconfig.json(文件位于nlaFiles/nlaconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Nla.config();
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
      "kafetch",
      "日本关西大学(https://www.iiif.ku-orcas.kansai-u.ac.jp/open_platform/search?kywd=&title=&creator=&spatial=&temporal=&language=75157&type%5Bdb_books%5D=db_books&type%5Bhakuen_bunko%5D=hakuen_bunko&type%5Bosaka_gadan%5D=osaka_gadan&type%5Byinpu%5D=yinpu&f%5B0%5D=temporal%3A1901&page=1)",
      (yargs) => {
        return yargs
          .option("id", {
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
          })

          .option("maxWidth", {
            type: "string",
            description: "文件宽限制(默认下载最大)",
            alias: "w",
            // demandOption: true,
          })
          .option("maxHeight", {
            type: "string",
            description: "文件宽限制(默认下载最大)",
            alias: "w",
            // demandOption: true,
          })

          ;
      },
      async (argv) => {
        // console.log(argv)

        console.log("bookFetchStart:kafetch");





        const urls = await Kan.generateUrls(
          argv.id,

          // parseInt(argv.vol),
          parseInt(argv.start),
          parseInt(argv.end),
        );








        let consoleText = urls.map((item) => `${item.url} page=${item.page}`)
          .join("\n");
        console.log(consoleText);


        await Deno.mkdir("kaFiles", { recursive: true });

        let maxHeight = argv?.maxHeight;
        let maxWidth = argv?.maxWidth;
        let command = ["-l"];
        if (maxHeight) {
          command = ["-h", parseInt(maxHeight)];
        }
        if (maxWidth) {
          command = ["-w", parseInt(maxWidth)];
        }

        if (maxHeight && maxWidth) {
          command = ["-h", parseInt(maxWidth), "-w", parseInt(maxWidth)];
        }

        await Kan.downLoadImages(urls, command);




        console.log("bookFetchEnd:kafetch");
      },
    )


    .command(
      "kafetchlist",
      "查看下载详情",
      (yargs) => {
        return yargs.option("id", {
          type: "string",
          description: "文件id",
          alias: "i",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:kafetchlist");

        try {


          const urls = await Kan.viewInfo(argv.id);






          const consoleUrls = urls.map((item) => {
            return `${item.url}   page=${item.page}`;
          }).join("\n");
          console.log(`详情列表+${urls.length}`);
          console.log(consoleUrls);


          // const consoleImageUrls = imageUrls.map((item) => {
          //   return `${item.url}   page=${item.page}`;
          // }).join("\n");
          // console.log(`图片详情列表+${consoleImageUrls.length}`);
          // console.log(consoleImageUrls);


          await Deno.mkdir("kaFiles", { recursive: true });
          // // writeJsonSync('haFiles/haConfig.toml', { headers: headers, downLoad: downLoad, help: help }, { spaces: 2 });
          Deno.writeTextFileSync(
            "kaFiles/kaListInfo.txt",
            `详情列表+${consoleUrls.length}:\n${consoleUrls}\n`,
          );
          // console.log("已保存至:prFiles/prListInfo.txt");
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:kafetchlist");
      },
    )
    .command(
      "kafetchdpi",
      "查看图片分辨率详情",
      (yargs) => {
        return yargs.option("id", {
          type: "string",
          description: "文件id",
          alias: "i",
          demandOption: true,
        });
      },
      async (argv) => {
        // console.log(argv)
        console.log("bookFetchStart:kafetchdpi");

        try {
          await Kan.viewDpi(argv.id);
        } catch (error) {
          console.log(error?.message);
        }

        console.log("bookFetchEnd:kafetchdpi");
      },
    )

    .command(
      "rkafetch",
      "如果有失败记录(文件位于kaFiles/undownLoad.txt)则重新下载,每次操作完成后需要手动删除历史记录,然后再下",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        console.log("bookFetchStart:kafetch");
        const urls = await Kan.undownLoad();
        console.log(urls);

        if (urls.length > 0) {
          let command = urls[0].command;
          // const NewCommand=[...command,'-H','Referer:https://digital.staatsbibliothek-berlin.de/','-H','User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0']
          await Kan.downLoadImages(urls, command);
        } else {
          console.log("已全完下载!");
        }

        console.log("bookFetchEnd:kafetch");
      },
    )
    .command(
      "kaconfig",
      "生成配置文kaconfig.json(文件位于kaFiles/kaconfig.toml)\n",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        await Kan.config();
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
        // console.info(argv);
        let fileName = "files";
        if (argv?.filename) {
          fileName = argv?.filename;
        }
        let command = argv?.command;
        console.log(command);
        console.log(fileName);
        let newCommand = command.replaceAll("'", '"');

        try {
          const config = await GitHubAction.readConfig();
          let result = await GitHubAction.addTask({
            fileName,
            command: newCommand,
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
          let result = await GitHubAction.listTaskResult({
            config,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
          });

          console.log(result.map((item) => item.shareUrl).join("\n"));
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
    .command(
      "actionruncfg",
      "读取当前目录actionRunConfig.toml配置(主要用于github action服务器使用,本地不需要使用)",
      (yargs) => {
        return yargs;
      },
      async (argv) => {
        try {
          await GitHubAction.runconfig();
        } catch (error) {
          console.log(error);
        }
      },
    )
    .command("gshare", "下载google云盘分享文件", (yargs) => {
      return yargs.option("url", {
        type: "分享url",
        description: "分享id",
        alias: "u",
        demandOption: true,
      });
    }, async (argv) => {
      // console.log(argv)

      try {
        await Deno.mkdir("gshareFiles", { recursive: true });

        await Gshare.downLoadImages(argv.url);
      } catch (error) {
        console.log(error?.message);
      }
    })
    .example("hafetch使用说明:")
    .example(
      "book-fetch.exe hafetch  -i hvd.32044067943118  -s 1 -e 305 ",
      "下载示例说明",
    )
    .example("book-fetch.exe rhafetch ", "重试示例说明")
    .example(
      "book-fetch.exe haconfig ",
      "生成配置文件(位于haFiles/rhaConfig.toml)\n",
    )
    .example("韩国国立图书馆使用说明:")
    .example(
      "book-fetch.exe nlfetch -c CNTS-00109637789 -v 1 -s 1 -e 3  ",
      "nlfetch下载示例",
    )
    .example("book-fetch.exe rnlfetch  ", "rnlfetch下载示例")
    .example(
      "book-fetch.exe nlconfig ",
      "生成配置文件(位于nlFiles/nlConfig.toml)\n",
    )
    .example("高丽大学图书馆使用说明:")
    .example(
      "book-fetch.exe  kofetch -u RIKS+CRMA+KSM-WZ.1893.0000-20090716.AS_SA_244 -s 1 -e 57   ",
      "kofetch下载示例",
    )
    .example(
      "book-fetch.exe  kofetchlist -u RIKS+CRMA+KSM-WZ.1893.0000-20090716.AS_SA_244",
      "kofetchlist示例",
    )
    .example("book-fetch.exe rkofetch  ", "rkofetch重试示例")
    .example(
      "book-fetch.exe koconfig ",
      "生成配置文件(位于koFiles/koConfig.toml)\n",
    )
    .example("巴伐利亞州立東亞圖書館使用说明:")
    .example(
      "book-fetch.exe osfetch -i bsb11122602 -s 1 -e 2   ",
      "osfetch说明",
    )
    .example("book-fetch.exe rosfetch", "rosfetch示例")
    // .example(
    //   'book-fetch.exe rmfetchdpi -u "https://jsg.aks.ac.kr/viewer/viewIMok?dataId=K3-427%7C001#node?depth=2&upPath=001&dataId=001" ',
    //   "查看图片分辨率",
    // )
    .example(
      "book-fetch.exe osconfig ",
      "生成配置文件(位于osFiles/osConfig.toml)\n",
    )
    .example("韩国收藏阁使用说明:")
    .example(
      'book-fetch.exe akfetch -u "https://jsg.aks.ac.kr/viewer/viewIMok?dataId=K3-427%7C001#node?depth=2&upPath=001&dataId=001" -s 1 -e 2  -h 100 -w 100',
      "akfetch说明:url需要加引号;-h -w参数可选",
    )
    .example("book-fetch.exe rakfetch", "rakfetch示例")
    .example(
      'book-fetch.exe rmfetchdpi -u "https://jsg.aks.ac.kr/viewer/viewIMok?dataId=K3-427%7C001#node?depth=2&upPath=001&dataId=001" ',
      "查看图片分辨率",
    )
    .example(
      "book-fetch.exe akconfig ",
      "生成配置文件(位于akFiles/akConfig.toml)\n",
    )
    .example("京都大学图书馆使用说明:")
    .example(
      "book-fetch.exe rmfetch -i rb00007972 -s 1 -e 2 -h 100 -w 100 ",
      "rmfetch说明:-h -w参数可选",
    )
    .example("book-fetch.exe rmfetchdpi -i rb00007972 ", "查看图片分辨率")
    .example("book-fetch.exe rrmkfetch", "rrmfetch示例")
    .example(
      "book-fetch.exe rmconfig ",
      "生成配置文件(位于rmFiles/rmConfig.toml)\n",
    )
    .example("谷歌云盘使用说明:")
    .example(
      'book-fetch.exe gshare  -u "https://drive.google.com/file/d/1oIMIKhztjQXr-t6z19BAbJw5yFekLoJ4/view?usp=sharing"\n',
      "gshare\n",
    )
    .example("德国柏林国立图书馆使用说明:")
    .example(
      "book-fetch.exe difetch -p PPN3303598916 -s 1 -e 2 -h 100 -w 100 ",
      "difetch说明:-h -w参数可选",
    )
    .example("book-fetch.exe difetchdpi -p PPN3303598916 ", "查看图片分辨率")
    .example("book-fetch.exe rdimkfetch", "rdifetch示例")
    .example(
      "book-fetch.exe diconfig ",
      "生成配置文件(位于diFiles/diConfig.toml)\n",
    )
    .example("哈佛大学图书馆使用说明:")
    .example(
      "book-fetch.exe harfetch -u https://curiosity.lib.harvard.edu/chinese-rare-books/catalog/49-990032703120203941 -s 1 -e 2 -h 100 -w 100 ",
      "harfetch说明:-h -w参数可选",
    )
    .example(
      "book-fetch.exe harfetchdpi -u https://curiosity.lib.harvard.edu/chinese-rare-books/catalog/49-990032703120203941 ",
      "查看图片分辨率",
    )
    .example("book-fetch.exe rharfetch", "重试")
    .example(
      "book-fetch.exe harconfig ",
      "生成配置文件(位于harFiles/harConfig.toml)\n",
    )
    .example("早稻田大学图书馆使用说明:")
    .example(
      "book-fetch.exe wafetch -u https://archive.wul.waseda.ac.jp/kosho/chi06/chi06_03730/ -s 1 -e 2 -t pdf ",
      "wafetch说明:-t(pdf或html 默认pdf)",
    )
    .example(
      "book-fetch.exe wafetchlist -u https://archive.wul.waseda.ac.jp/kosho/chi06/chi06_03730/ ",
      "查看pdf html分页详情",
    )
    .example("book-fetch.exe rwafetch", "重试")

    .example("普林斯顿大学东亚图书馆使用说明:")
    .example(
      "book-fetch.exe prfetch -u https://dpul.princeton.edu/eastasian/catalog/gh93h668k  -s 1 -e 2  -w 100 -h 100  ",
      "prfetch说明:-w(可选) -h(可选)",
    )
    .example(
      "book-fetch.exe bofetchdpi -u https://dpul.princeton.edu/eastasian/catalog/gh93h668k  ",
      "查看图片分辨率",
    )
    .example("book-fetch.exe prfetchlist", "查看列表详情")
    .example("book-fetch.exe rprfetch", "重试")
    .example(
      "book-fetch.exe prconfig ",
      "生成配置文件(位于prFiles/prConfig.toml)\n",
    )

    .example("牛津大学博德利图书馆使用说明:")
    .example(
      "book-fetch.exe bofetch -i 5fb71c32-57a5-415a-868f-0ec6904838de -s 1 -e 2  -w 100 -h 100 ",
      "bofetch说明:-w(可选) -h(可选)",
    )
    .example(
      "book-fetch.exe bofetchdpi -i 5fb71c32-57a5-415a-868f-0ec6904838de ",
      "查看图片分辨率",
    )

    .example("book-fetch.exe rbofetch", "重试")
    .example(
      "book-fetch.exe boconfig ",
      "生成配置文件(位于boFiles/boConfig.toml)\n",
    )
    .example("日本古典书籍的唯一门户网站:")
    .example(
      "book-fetch.exe nifetch -i 100380752 -s 1 -e 2  -w 100 -h 100 ",
      "bofetch说明:-w(可选) -h(可选)",
    )
    .example("book-fetch.exe nifetchlist", "查看列表详情")
    .example(
      "book-fetch.exe nifetchdpi -i 100380752",
      "查看图片分辨率",
    )



    .example("book-fetch.exe rnifetch", "重试")





    .example(
      "book-fetch.exe niconfig ",
      "生成配置文件(位于niFiles/niConfig.toml)\n",
    )


    .example("法国图书馆:")
    .example(
      "book-fetch.exe bnfetch -u https://gallica.bnf.fr/ark:/12148/btv1b52519915t -s 1 -e 1",
      "bofetch说明: ",
    )
    .example("book-fetch.exe bnfetchlist", "查看列表详情")
    // .example(
    //   "book-fetch.exe nifetchdpi -i 100380752",
    //   "查看图片分辨率",
    // )

    .example("book-fetch.exe rbnfetch", "重试")
    .example(
      "book-fetch.exe bnconfig ",
      "生成配置文件(位于bnFiles/bnConfig.toml)\n",
    )



    .example("澳大利亚国立大学图书馆:")
    .example(
      "book-fetch.exe anfetch -u https://openresearch-repository.anu.edu.au/handle/1885/205926 -s 1 -e 1",
      "bofetch说明: ",
    )
    .example("book-fetch.exe anfetchlist", "查看列表详情")
    // .example(
    //   "book-fetch.exe nifetchdpi -i 100380752",
    //   "查看图片分辨率",
    // )

    .example("book-fetch.exe ranfetch", "重试")
    .example(
      "book-fetch.exe anconfig ",
      "生成配置文件(位于anFiles/anConfig.toml)\n",
    )




    .example("澳大利亚国家图书馆:")
    .example(
      "book-fetch.exe nlafetch -u https://catalogue.nla.gov.au/catalog/1920597 -s 1 -e 1 -w 100",
      "bofetch说明: ",
    )
    .example("book-fetch.exe nlafetchlist", "查看列表详情")
    // .example(
    //   "book-fetch.exe nifetchdpi -i 100380752",
    //   "查看图片分辨率",
    // )

    .example("book-fetch.exe rnlafetch", "重试")
    .example(
      "book-fetch.exe nlaconfig ",
      "生成配置文件(位于nlaFiles/nlaConfig.toml)\n",
    )



    .example("日本关西大学")
    .example(
      "book-fetch.exe kafetch -i 1136 -s 1 -e 1 -w 100",
      "bofetch说明: ",
    )
    .example("book-fetch.exe kafetchlist -i 1136", "查看列表详情")
    .example(
      "book-fetch.exe kafetchdpi -i 1136",
      "查看图片分辨率",
    )

    .example("book-fetch.exe rkafetch", "重试")
    .example(
      "book-fetch.exe kaconfig ",
      "生成配置文件(位于kaFiles/kaConfig.toml)\n",
    )

    .strictCommands()
    .scriptName("book-fetch.exe")
    .version("v1.0.0")
    .epilog("copyright 2023 book-fetch")
    .demandCommand(1)
    .parse();
}

// https://jsg.aks.ac.kr/viewer/viewIMok?dataId=K3-427%7C001#node?depth=2&upPath=001&dataId=001

//http://kostma.korea.ac.kr/viewer/viewerDes?uci=RIKS+CRMA+KSM-WZ.1865.0000-20170331.KY_W_283&bookNum=&pageNum=

//http://kostma.korea.ac.kr/viewer/viewerDes?uci=RIKS+CRMA+KSM-WZ.1893.0000-20090716.AS_SA_244&bookNum=&pageNum=
