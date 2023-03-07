import axios, { AxiosResponse } from "axios";
import { openAIChatAPI } from "../constants";

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
  };
  return axios(apiUrl, {
    method,
    headers,
    params,
    data: body,
  }).then((res: AxiosResponse) => res.data);
};

export const chatWithGPT = async (messages: any[]) => {
  const headers: Record<string, any> = {
    Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
  };
  let apiUrl = openAIChatAPI
  let { CHATY_PROXY } = process.env
  if (CHATY_PROXY) {
    if (CHATY_PROXY[CHATY_PROXY.length - 1] !== '/') {
      CHATY_PROXY += '/'
    }
    headers.origin = 'https://app.uniswap.org'
    apiUrl = CHATY_PROXY + openAIChatAPI
  }
  const answer = await fetchApi(
    apiUrl,
    "POST",
    { headers },
    {
      model: "gpt-3.5-turbo",
      messages,
    }
  );
  return answer;
};

export const messageManager = (() => {
  let messageMap: Map<any, any[]> = new Map();
  return {
    sendMessage: (content: string, user: string) => {
      if (!messageMap.get(user)) {
        messageMap.set(user, []);
      }
      const data = messageMap.get(user);
      data?.push({ role: "user", content });
    },
    concatAnswer: (content: string, user: string) => {
      if (!messageMap.get(user)) {
        messageMap.set(user, []);
      }
      const data = messageMap.get(user);
      data?.push({ role: "assistant", content });
    },
    getMessages: (user: string) => {
      return messageMap.get(user);
    },
    shiftMessage: (user: string) => {
      const data = messageMap.get(user);
      data?.shift();
    },
    popMessage: (user: string) => {
      const data = messageMap.get(user);
      data?.pop();
    },
    clearMessage: (user: string) => {
      messageMap.delete(user);
    },
  };
})();
