import Axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {Injectable, Ioc} from '@baidu/ioc';
import {replaceOfString, isFalse} from '@baidu/bce-helper';

@Injectable()
export class UNetService {
    static setHeader(key: string, value: string | boolean) {
        Axios.defaults.headers.common[key] = value;
    }
    static setTimeout(timeout: number) {
        Axios.defaults.timeout = timeout;
    }
    static setUrl(url: string) {
        Axios.defaults.baseURL = url;
    }
    static setInterceptors(interceptors: UInterceptor[]) {
        interceptors.forEach((interceptor: UInterceptor) => {
            Axios.interceptors.request.use(interceptor.request);
            Axios.interceptors.response.use(interceptor.response);
        });
    }
    static setWithCredentials(withCredentials: boolean) {
        Axios.defaults.withCredentials = withCredentials;
    }
    get<T, K, Q = never>(url: string, params?: T, query?: Q, config: AxiosRequestConfig = {}): Promise<ResponseObj<K>> {
        config.params = params;
        url = this.urlHandler(url, query);
        return this.sendData<T, K>('get', url, config);
    }
    post<T, K, Q = never>(url: string, params?: T, query?: Q, config: AxiosRequestConfig = {}): Promise<ResponseObj<K>> {
        url = this.urlHandler(url, query);
        return this.sendData<T, K>('post', url, params, config);
    }
    delete<T, K, Q = never>(url: string, params?: T, query?: Q, config: AxiosRequestConfig = {}): Promise<ResponseObj<K>> {
        config.params = params;
        url = this.urlHandler(url, query);
        return this.sendData<T, K>('delete', url, config);
    }
    put<T, K, Q = never>(url: string, params?: T, query?: Q, config: AxiosRequestConfig = {}): Promise<ResponseObj<K>> {
        url = this.urlHandler(url, query);
        return this.sendData<T, K>('put', url, params, config);
    }
    private urlHandler<Q>(url: string, query: Q) {
        if (query) {
            const assemblyUrlQuery: any = {};
            Object.keys(query).forEach((item: string) => {
                assemblyUrlQuery[`:${item}`] = (query as any)[item];
            });
            if (url.includes('http://') || url.includes('https://')) {
                return replaceOfString(url, assemblyUrlQuery);
            } else {
                return replaceOfString(url, assemblyUrlQuery).replace('//', '/');
            }
        } else {
            return url;
        }
    }
    private sendData<T, K>(methods: NetMethods, url: string, config1: AxiosRequestConfig | T = {}, config2: AxiosRequestConfig = null): Promise<ResponseObj<K>> {
        return new Promise(async (resolve, reject) => {
            try {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                await Axios[methods](url, config1, config2).then((data: AxiosResponse<ResponseObj<K>>) => {
                    if (!data.data || isFalse(data.data.success)) {
                        reject(data.data || null);
                    }
                    resolve(data.data);
                });
            } catch (e) {
                reject(e);
            }
        });
    }
}

// 给不想用的依赖注入的人一个便捷方式
export const netService = Ioc(UNetService);
export interface UInterceptor {
    response: (response: AxiosResponse) => Promise<AxiosResponse>;
    request: (config: AxiosRequestConfig) => Promise<AxiosRequestConfig>;
}


export type NetMethods = 'get' | 'post' | 'put' | 'delete';

// http响应
export interface ResponseObj<T, K = null> {
    success: boolean;
    status: number;
    code?: string;
    message?: ResponseMsgObj;
    error?: K; // 错误数据
    result?: T; // 正常数据
    page?: PageResponseObj<T>; // 分页数据
    errcode?: number;
    errmsg?: string;
}

// http message
export interface ResponseMsgObj {
    detail?: any;
    code?: number;
    requestId?: string;
    status?: number;
    success?: boolean;
    redirect?: string;
    global?: string;
}

// http分页响应
export interface PageResponseObj<T> {
    order: string;
    orderBy: string;
    pageNo: number;
    pageSize: number;
    totalCount: number;
    result: T[];
}

/** 分页请求 */
export interface PageRequestObj {
    pageNo: number;
    pageSize: number;
}