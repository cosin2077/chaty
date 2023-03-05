import axios, { AxiosResponse } from "axios";
import readline from "readline";

export const confirmReadline = async (question: string, passReg: RegExp) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer: string) => {
      if (passReg.test(answer) || !answer) {
        return resolve({ confirm: true, answer });
      }
      resolve({ confirm: false, answer });
      rl.close();
    });
  });
};
export const asyncSleep = async (number: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, number);
  });
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
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
  };
  return axios(apiUrl, {
    method,
    headers,
    params,
    data: body,
  }).then((res: AxiosResponse) => res.data);
};

