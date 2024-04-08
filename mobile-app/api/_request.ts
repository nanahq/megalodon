import axios, { Method} from 'axios'
import {persistence} from "@api/persistence";
import { showToastStandard } from "@components/commons/Toast";
import {ApiRoute, APIService, NetworkMapper} from "@api/network.mapper";
import {cookieParser} from "../../utils/cookieParser";

type Environment = 'production' | 'development' | string
export  function getUrl (gateway: APIService): string {
    const environment: Environment = 'production'

    let url: string

    if (environment === 'development') {
        url =   `${NetworkMapper.PLAYGROUND}/${ApiRoute[gateway]}/v1`
    } else  {
        url =`${NetworkMapper.PRODUCTION}/${ApiRoute[gateway]}/v1`
    }

    return url
}

const config = {
    baseUrl: getUrl('API_GATEWAY'),
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
    const cookies = await persistence.getSecure()
    const baseHeader = {
        'Cookie': cookies
    }


    setTimeout(() => {
        source.cancel();
    }, 50000);
    const axiosInstance =  axios({
        method: param.method,
        baseURL: param.baseUrl ?? config.baseUrl,
        url: param.url,
        headers: param.headers !== undefined ?  {...param.headers, ...baseHeader} : {...config.headers, ...baseHeader},
        cancelToken: source.token,
        data: param.data,
        withCredentials: true,
    })

        return await axiosInstance
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
            persistence.setSecure(cookieParser(res.cookies))
           }
           return Promise.resolve<{data: any, cookies: string[]}>(res)
        })
        .catch(err => Promise.reject(err));
}

async function requestData<T, K> (params: baseParamProps<T>): Promise<{data: K, cookies: string[]}> {
    return await base<T>({...params})
        .then(res => Promise.resolve<{data: any, cookies: string[]}>(res))
        .catch(err => Promise.reject(err));
}
export const _api = {
    request,
    requestData,
};
