import type {
  IPrefix,
  IPathName,
  IHref,
  IRequestResponse,
  TProxy,
} from './constants'
import { EMlf } from '@antmjs/trace'
import { monitor } from '@/trace'
import { cacheGetSync } from '@/cache'
import DOMAIN from './constants'
// 注意：下面三个方法的调用不需要处理reject的场景，内部对请求做了封装，统一抛出到resolve内
import _request from './innerRequest'
import _thirdRequest from './thirdRequest'

function sendMonitor(option: any, res: any) {
  const params = {
    d1: option.url,
    d2: JSON.stringify(option),
    d3: res.status,
    d4: res.code,
    d5: JSON.stringify(res),
  }
  if (process.env.NODE_ENV === 'development') {
    console.error('development:requestCatch', option, res)
  }
  monitor(EMlf.api, params)
}

function url(option: Request.Option) {
  const prefix = option.url.split('/')[1] as IPrefix
  const domain = DOMAIN[process.env.API_ENV][prefix] || ''
  // NOTE:
  //  如果是本地开发 强制改为当前域名的代理
  // if (getIsLocalDev()) {
  //   domain = `//${window.location.host}`
  // }
  option.url =
    domain +
    option.url +
    (option.url.indexOf('?') > -1 ? `&t=${+new Date()}` : `?t=${+new Date()}`)
}

function header(option: Request.Option) {
  const header = {
    Accept: '*/*',
    'Content-Type': 'application/json',
    'X-Z-VERSION': '',
    'x-z-token': cacheGetSync('token') || '',
  }
  option.header = header
}

// 只处理response.data为json的情况,其他返回都属于异常
export function request<
  T extends Omit<Request.Option, 'success' | 'fail' | 'header'>,
  M extends TProxy,
>(
  query: {
    [K in keyof T]: K extends 'url' ? IPathName<T[K], IPrefix> : T[K]
  },
  type?: M,
): Promise<M extends 'info' ? IRequestResponse : IRequestResponse['data']> {
  // warning: 直接内部帮你做了toast
  // info：直接把整个数据返回给请求的await结果
  url(query)
  header(query)
  return _request(query).then((res) => {
    if (res.code !== '200') {
      sendMonitor(query, res)
    }

    if (res.code === '200') {
      if (type === 'info') {
        return res
      } else {
        return res.data
      }
    } else {
      if (type === 'info') {
        return res
      } else {
        throw res
      }
    }
  })
}

// 自动化使用的方法
export function createFetch<
  REQ extends Record<string, any>,
  RES extends IRequestResponse,
>(url: any, method: any) {
  return <T extends TProxy = 'warning'>(
    data: REQ,
    type?: T,
  ): Promise<T extends 'info' ? RES & { header: any } : RES['data']> => {
    return request(
      {
        url,
        method,
        data: data,
      },
      type,
    )
  }
}

export function thirdRequest<
  T extends Omit<Request.Option, 'success' | 'fail'>,
>(query: {
  [K in keyof T]: K extends 'url' ? IHref<T[K]> : T[K]
}) {
  return _thirdRequest(query).then((res) => {
    if (res.code !== '200') {
      sendMonitor(query, res)
    }
    return res
  })
}
