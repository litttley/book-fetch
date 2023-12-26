// Octokit.js
// https://github.com/octokit/core.js#readme

import { App, Octokit } from "https://esm.sh/octokit?dts";

export const openIssue = async ({ title, body, config }) => {
  /**
   * https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#create-an-issue
   */

  const octokit = new Octokit({
    auth: config.github.authToken,
  });

  const response = await octokit.request(
    `POST /repos/${config.github.owner}/${config.github.repo}/issues`,
    {
      owner: config.github.owner,
      repo: config.github.repo,
      title: title,
      body: body,
    },
  );
  // console.log(response);
  return response;
};
export const listIssue = async ({ config, page, per_page }) => {
  const octokit = new Octokit({
    auth: config.github.authToken,
  });

  const resp = await octokit.request(
    `GET /repos/${config.github.owner}/${config.github.repo}/issues`,
    {
      owner: config.github.owner,
      repo: config.github.repo,
      per_page: per_page,
      page: page,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  return resp;
};

export const listIssueComment = async ({ config, page, per_page }) => {
  const octokit = new Octokit({
    auth: config.github.authToken,
  });

  const resp = await octokit.request(
    `GET /repos/${config.github.owner}/${config.github.repo}/issues/comments`,
    {
      owner: config.github.owner,
      repo: config.github.repo,
      per_page: per_page,
      page: page,

      direction: "desc",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  return resp;
};

export const ListRunJobs = async ({ event }) => {
  const octokit = new Octokit({
    auth: config.github.authToken,
  });
  const result = await octokit.request(
    `GET /repos/${config.github.owner}/${config.github.repo}/actions/runs`,
    {
      owner: config.github.owner,
      repo: config.github.repo,
      event: event,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
  return result;
};

export const getJobs = async ({ run_id }) => {
  const octokit = new Octokit({
    auth: config.github.authToken,
  });
  const result0 = await octokit.request(
    `GET /repos/${config.github.owner}/${config.github.repo}/actions/runs/${run_id}/jobs`,
    {
      owner: config.github.owner,
      repo: config.github.repo,
      run_id: run_id,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  return result0;
};

export const getJobLogs = async ({ job_id }) => {
  const octokit = new Octokit({
    auth: config.github.authToken,
  });
  const result = await octokit.request(
    `GET /repos/${config.github.owner}/${config.github.repo}/actions/jobs/${job_id}/logs`,
    {
      owner: config.github.owner,
      repo: config.github.repo,
      job_id: job_id,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  return result;
};
