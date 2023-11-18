import axios, { Method} from 'axios'
import {persistence} from "@api/persistence";
import { showToastStandard } from "@components/commons/Toast";
import {cookieParser} from "../../utils/cookieParser";

// type Environment = 'production' | 'development'
export  function getUrl (): string {
    // const environment: Environment | any = process.env.NODE_ENV ?? 'production'
    //
    // let url: string
    //
    // if (environment === 'development') {
    //     url =   `${NetworkMapper.PLAYGROUND}:${PlaygroundServicePort[gateway]}/${ApiRoute[gateway]}/v1`
    // } else  {
    //     url =`${NetworkMapper.PRODUCTION}/${ApiRoute[gateway]}/v1`
    // }

    return 'http://k8s-default-nanahydr-874b0d28d1-561484973.af-south-1.elb.amazonaws.com/api-gateway/v1'
}

const config = {
    baseUrl: getUrl(),
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    withCredentials: true
};

interface baseParamProps<T> {
    method: Method
    url: string
    data?: T
    type?: 'requestData'
    headers?: any

    baseUrl?: string
}

async function base<T>(param: baseParamProps<T>) {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setTimeout(() => {
        source.cancel();
    }, 50000);
    return await axios({
        method: param.method,
        baseURL: param.baseUrl ?? config.baseUrl,
        url: param.url,
        headers: param.headers !== undefined ?  param.headers : config.headers,
        cancelToken: source.token,
        data: param.data,
    })
      .then(res => {
            return Promise.resolve({
                data: res?.data,
                cookies: res.headers['set-cookie'] ?? []
            });
        })
        .catch((err: any) => {
            if (err.message.includes('401')) {

                return Promise.reject(err.response?.data);
            }
            if (err.response) {
                return Promise.reject(err.response?.data);
            }
            showToastStandard('Something went wrong', 'error')

            return Promise.reject(err);
        })
}

async function request<T> (method: Method, url: string): Promise<{data: any, cookies: string[]}> {
    return await base<T>({method, url})
        .then(res => {
            if ( res.cookies.length > 0) {
            persistence.setSecure(cookieParser(res.cookies[0]))
           }
           return Promise.resolve<{data: any, cookies: string[]}>(res)
        })
        .catch(err => Promise.reject(err));
}

async function requestData<T> (params: baseParamProps<T>): Promise<{data: any, cookies: string[]}> {
    return await base<T>({...params})
        .then(res => Promise.resolve<{data: any, cookies: string[]}>(res))
        .catch(err => Promise.reject(err));
}
export const _api = {
    request,
    requestData,
};
