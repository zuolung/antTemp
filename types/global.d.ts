declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'production' | 'development'
    API_ENV: 'real' | 'dev'
  }
}

declare namespace Project {
  interface IPageProps {
    title?: string
    path: string
    navigate: NavigateFunction
    location: Location
  }
}

interface NavigateFunction {
  (to: string, options?: NavigateOptions): void
  (delta: number): void
}

interface NavigateOptions {
  replace?: boolean
  state?: any
  preventScrollReset?: boolean
  relative?: 'route' | 'path'
}

interface Location {
  state: any
  key: string
  pathname: string
  search: string
  hash: string
}
