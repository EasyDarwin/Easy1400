import { message } from 'antd';
import axios, { AxiosError, GenericAbortSignal } from 'axios';
import { history } from 'umi';
// import { extend } from 'umi-request';
// // interface

const codeMessage: { [key: number]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
  511: '没有权限 , 非法操作',
};

export const service = axios.create({
  baseURL: process.env.BASEURL,
  timeout: 70000,
  headers: {
    'Content-Type': 'application/json',
    authorization: `token ${getToken()}`,
  },
  responseType: 'json',
});

service.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (!error) {
      message.error('网络异常');
      return Promise.reject(error);
    }

    let resp = error.response;
    let errTips = resp?.data['msg'];

    const errorText: string = codeMessage[resp.status] || resp.statusText;

    switch (resp.status) {
      case 401:
        message.error(errTips ?? 'token 无效');
        cleanStoreage();
        history.push(`/login`);
        break;
      case 404:
        message.error(errorText ?? '请求的资源不存在');
        history.push(`/404`);
        break;
      case 501:
      case 502:
      case 503:
      case 504:
        message.error(errorText ?? errTips ?? '网络异常');
        break;
      default:
        console.log(
          '🚀 ~ file: http.ts ~ line 50 ~ service.interceptors.response.use',
          errorText,
        );
        break;
    }

    return Promise.reject(error);
  },
);

const tokenStr = 'LNTON_TOKEN_V1';
const userID = 'LNTON_USER_ID';

export function getToken() {
  return sessionStorage.getItem(tokenStr) as string;
}
export function getUID() {
  let uid = sessionStorage.getItem(userID) as string;
  if (uid) {
    return Number.parseInt(uid);
  }
  return 0;
}

export function cleanStoreage() {
  sessionStorage.removeItem(tokenStr);
  sessionStorage.removeItem(userID);
}
export function setToken(token: string, id: number) {
  sessionStorage.setItem(tokenStr, token);
  sessionStorage.setItem(userID, id.toString());
}

service.interceptors.request.use((config) => {
  config.headers!['Content-Type'] = 'application/json';
  const token: string = getToken();
//   config.headers['authorization'] = `Bearer ${token}`;
  return config;
});

async function request<T>(
  url: string,
  method: string,
  data?: object,
  // cancelToken?: CancelToken,
  signal?: GenericAbortSignal,
) {
  return await service.request<T>({
    url,
    method,
    data: method == 'GET' ? {} : data,
    params: method == 'GET' ? data : {},
    // cancelToken: cancelToken,
    signal: signal,
  });
}
// 查询
export async function GET<T>(url: string, params?: any) {
  return request<T>(url, 'GET', params);
}

// 添加
export async function POST<T>(
  url: string,
  params?: any,
  // cancelToken?: CancelToken,
  signal?: GenericAbortSignal,
) {
  return request<T>(url, 'POST', params, signal);
}

// 更新
export async function PUT<T>(url: string, params?: any) {
  return request<T>(url, 'PUT', params);
}

// 删除
export async function DELETE<T>(url: string, params?: any) {
  return request<T>(url, 'DELETE', params);
}

// ErrorHandle 仅处理 400 错误，此错误为业务逻辑相关错误
export function ErrorHandle(error: any) {
  const err = error as AxiosError;
  if (!err.response || !err.response.data) {
    return;
  }
  const data = err.response.data as Model.Error;

  const key = Date.now().toString();
  if (err.response.status == 400) {
    message.error({
      content: `${data.msg} ${data.details?.length > 0 ? '😦' : ''}`,
      duration: 2,
      key: key,
      onClick(e) {
        message.destroy(key);
        data.details?.map((v: string) => {
          if (v) {
            message.error({
              content: v,
              duration: 3,
            });
          }
        });
      },
    });
  }
}
