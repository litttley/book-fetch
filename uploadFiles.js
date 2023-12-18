import yargs from "https://deno.land/x/yargs/deno.ts";
import * as FileBig from "./filebigUpload.js";

if (import.meta.main) {
  yargs(Deno.args)
    .usage(" uploadFiles  [command]")
    .wrap(200)
    .command(
      "filebig",
      "上传文件到filebig(https://www.filebig.net/)",
      (yargs) => {
        return yargs.option("file", {
          type: "string",
          description: "上传文件",
          alias: "f",
          demandOption: true,
        });
      },
      async (argv) => {
        console.log("uploadFilesStart:");

        try {
          let url = await FileBig.uploadFileToFileBig(argv.file);
          await Deno.writeTextFile(
            `./${argv.file.replace(".7z", "")}.txt`,
            url,
          );
        } catch (error) {
          console.log(error);
        }
        console.log("uploadFilesEnd:");
      },
    )
    .example(
      "uploadFiles filebig -f osFiles1.7z ",
      "下载示例说明",
    )
    .strictCommands()
    .scriptName("uploadFiles.exe")
    .version("v1.0.0")
    .epilog("copyright 2023")
    .demandCommand(1)
    .parse();

  // await uploadFileToFileBig('./7.jpeg')

  // await requestProgressRefresh()
}
