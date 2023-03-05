import axios, { AxiosResponse } from "axios";
import readline from "readline";
import os from "os";
import dotenv from "dotenv";
import child from "child_process";
import { chatyDebug } from "../main/prepare/debug";
import { appConfigPath } from "../constants";
import path from "path";
import { readFileSync, writeFileSync } from "fs-extra";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const confirmReadline = async (
  question: string,
  passReg: RegExp
): Promise<any> => {
  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      if (passReg.test(answer) || !answer /* enter key */) {
        return resolve({ confirm: true, answer, close: () => rl.close() });
      }
      resolve({ confirm: false, answer, close: () => rl.close() });
    });
  });
};
export const asyncSleep = async (number: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, number);
  });
};
export const defaultUserAgent = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36 ",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Mozilla/5.0 (Android 9; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0",
];
export const randomUserAgent = () => {
  return defaultUserAgent[Math.trunc(Math.random() * defaultUserAgent.length)];
};
export const fetchApi = async (
  apiUrl: string,
  method = "GET",
  params: any,
  body: any
) => {
  let defineHeaders = {};
  let type: any = { "Content-Type": "application/json" };
  if (
    (params && params.type && params.type !== "json") ||
    (body && body.type && body.type !== "json")
  ) {
    type = {};
  }
  if (params && params.headers) {
    defineHeaders = { ...defineHeaders, ...params.headers };
    delete params.headers;
  }
  if (body && body.headers) {
    defineHeaders = { ...defineHeaders, ...body.headers };
    delete body.headers;
  }
  if (params) delete params.type;
  if (body) delete body.type;
  const headers = {
    ...type,
    ...defineHeaders,
    "User-Agent": randomUserAgent(),
  };
  return axios(apiUrl, {
    method,
    headers,
    params,
    data: body,
  }).then((res: AxiosResponse) => res.data);
};

export const runChildProcess = (
  name: string,
  execPath: string,
  args: string[],
  options: any
) => {
  const childProcess = child.spawn(execPath, args, options);
  chatyDebug(`runChildProcess: ${name}, pid: ${childProcess.pid}`);
  childProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });
  childProcess.stderr.on("data", (data) => {
    console.log(data.toString());
  });
  childProcess.on("exit", (code) => {
    chatyDebug(`childProcess.on('exit'): ${name}, data: ${code}`);
  });
  return childProcess;
};
export function writeHomeEnv(prop: string, value: string) {
  const destEnvPath = path.resolve(appConfigPath, ".env");
  const destKey = dotenv.parse(readFileSync(destEnvPath, "utf-8"));
  destKey[prop] = value;
  let newContent = "";
  for (let line in destKey) {
    const content = `${os.EOL}${line}=${destKey[line]}${os.EOL}`;
    newContent += content;
  }
  writeFileSync(destEnvPath, newContent, "utf-8");
}