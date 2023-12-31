import * as Toml from "https://deno.land/std@0.208.0/toml/mod.ts";
import * as GithubRestApi from "./githubRestApi.js";

export const addTask = async ({ fileName, command, config }) => {
  let body = "";
  if (command.includes("osfetch")) {
    body = `osFiles#${command.replace(".exe", "")}`;
  } else if (command.includes("hafetch")) {
    body = `haFiles#${command.replace(".exe", "")}`;
  } else if (command.includes("nlfetch")) {
    body = `nlFiles#${command.replace(".exe", "")}`;
  } else if (command.includes("kofetch")) {
    body = `koFiles#${command.replace(".exe", "")}`;
  } else if (command.includes("akfetch")) {
    body = `aksFiles#${command.replace(".exe", "")}`;
  }

  if (body == "") {
    throw "指令输入错误";
  }

  // console.log(body);

  let s = await GithubRestApi.openIssue({
    title: fileName,
    body: body,
    config: config,
  });
  const { data } = s;

  return data;
};

export const listTaskResult = async ({ config, page, pageSize }) => {
  const { status, data } = await GithubRestApi.listIssueComment({
    config,
    page: page,
    per_page: pageSize,
  });
  if (status != 200) {
    throw "数据查询异常";
  }

  const result = data.map((item) => {
    return { shareUrl: item.body };
  });

  // console.log(result);

  return result;
};

// export const listTask = async ({ size }) => {
//   const { data } = await GithubRestApi.ListRunJobs({ event: "issues" });
//   const { total_count, workflow_runs } = data;
//   const workflows = workflow_runs.map((item) => {
//     return {
//       run_id: item.id,
//       workflow_id: item.workflow_id,
//       display_title: item.display_title,
//     };
//   });
//   console.log(workflow_runs);

//   let workflowResult = [];
//   for (const workflow of workflows) {
//     try {
//       const { data: jobsData } = await GithubRestApi.getJobs({
//         run_id: workflow.run_id,
//       });
//       const job_id = jobsData.jobs[0].id;

//       const { data: logData } = await GithubRestApi.getJobLogs({ job_id });
//       console.log(logData);
//       let logContentArr = logData.split(/[(\r\n)\r\n]+/);
//       let effectLogArr = [];
//       let isTrue = false;
//       for (const item of logContentArr) {
//         if (item.includes("bookFetchStart:")) {
//           isTrue = true;
//         }
//         if (item.includes("bookFetchEnd:")) {
//           isTrue = false;
//         }

//         if (item.includes("uploadFilesStart:")) {
//           isTrue = true;
//         }
//         if (item.includes("uploadFilesEnd:")) {
//           isTrue = false;
//         }

//         if (item.includes("WAIT") || item.includes("postfile.php")) {
//           continue;
//         }

//         if (isTrue) {
//           effectLogArr.push(item);
//         }
//       }
//       console.log(effectLogArr.join("\n"));
//     } catch (error) {
//       // throw '查询工作流异常'
//     }
//   }
// };
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
export const readConfig = async () => {
  // if (await checkFileExists("actionFiles/actionConfig.toml")) {

  // }

  let config = null;

  if (await checkFileExists("actionFiles/actionConfig.toml")) {
    config = Toml.parse(Deno.readTextFileSync("actionFiles/actionConfig.toml"));
  }

  if (config == null) {
    throw "请先配置github token";
  }

  console.log(config);

  if (config?.github?.owner == "") {
    throw "请在配置中添加github账号名";
  }

  if (config?.github?.repo == "") {
    throw "请在配置中添加github仓库名";
  }

  if (config?.github?.authToken == "") {
    throw "请在配置中添加github私人令牌";
  }

  return config;
};

export const config = async () => {
  try {
    let github = {
      owner: "",
      repo: "",
      authToken: "",
    };

    let help = {
      github: {
        owner: "github账号名称",
        repo: "github布署book-fetch-action的仓库名",
        authToken: "github 私人访问令牌",
      },
    };
    if (await checkFileExists("actionFiles/actionConfig.toml")) {
      Deno.writeTextFileSync(
        "actionFiles/actionConfig.toml",
        Toml.stringify({ github: github, help: help }),
      );
    } else {
      await Deno.mkdir("actionFiles", { recursive: true });

      Deno.writeTextFileSync(
        "actionFiles/actionConfig.toml",
        Toml.stringify({ github: github, help: help }),
      );
    }

    console.log("文件已生成:actionFiles/actionConfig.toml");
  } catch (error) {
    console.log(error);
  }
};

export const runconfig = async () => {
  try {
    let text = Deno.readTextFileSync("./actionRunConfig.toml")

    let textArr = text.split("\n")

    let fileDir = null
    let fileName = null
    let command = ""
    for (const item of textArr) {

      if (item.startsWith('#')) {

        if (item.startsWith('#book-fetch')) {
          command = item.replace("#", "")
          continue
        }
        // let paramArr = item.split('#').filter(item=>item!='')

        fileDir = item.replace("#", "")


        if (fileDir == 'haFiles') {
          fileName = 'haConfig'
        } else if (fileDir == "nlFiles") {
          fileName = "nlConfig"
        } else if (fileDir == "koFiles") {
          fileName = "koConfig"
        } else if (fileDir == "osFiles") {
          fileName = "osConfig"
        } else if (fileDir == "aksFiles") {
          fileName = "aksConfig"
        }


      }




    }

    // console.log(fileDir)
    // console.log(fileName)
    if (fileDir && fileName) {
      await Deno.mkdir(fileDir, { recursive: true });

      let config = Toml.parse(text);
      if (config?.undownLoad) {

      
 
        Deno.writeTextFileSync(
          `${fileDir}/undownLoad.txt`, config?.undownLoad.text.join('\n'))
          console.log(`文件已生成:${fileDir}/undownLoad.txt`);
      }

      Deno.writeTextFileSync(
        `${fileDir}/${fileName}.toml`,
        Toml.stringify({ ...config, ...{ action: { command: command, dir: fileDir, fileName: fileName } } }),)
    }



    console.log(`文件已生成:${fileDir}/${fileName}.toml`);
  } catch (error) {
    console.log(error);
  }
};

