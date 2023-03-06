import axios, { AxiosResponse } from "axios";

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
  };
  return axios(apiUrl, {
    method,
    headers,
    params,
    data: body,
  }).then((res: AxiosResponse) => res.data);
};
