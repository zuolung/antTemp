export type TProxy = 'warning' | 'info'
export type IPrefix = keyof typeof domain.real

export type IPathName<
  T extends string,
  K extends string,
> = T extends `/${K}${infer R}` ? `/${K}${R}` : never

export type IHref<T extends string> = T extends `https://${infer R}`
  ? `https://${R}`
  : T extends `http://${infer R}`
  ? `http://${R}`
  : never

export interface IRequestResponse {
  code: string
  header?: Record<string, any>
  data: any
  message?: string
}

/************************************************** */
/** 上半部分类型，下半部分逻辑 */
/************************************************** */

export const fedEnv: {
  [key: string]: string
} = {
  'xxx.com': 'real',
  'xxx-stable.com': 'stable',
  'xxx-dev.com': 'dev',
  'xxx-pre.com': 'pre',
}

export interface FED_ENV {
  real: 'real'
  pre: 'pre'
  stable: 'stable'
  dev: 'dev'
}

const domain = {
  real: {
    z: 'https://xxx.com',
  },
  pre: {
    z: 'https://xxx.pre.com',
  },
  stable: {
    z: 'https://xxx.stable.com',
  },
  dev: {
    z: 'https://xxx.dev.com',
  },
}

export default domain
