declare module 'react-draggable'
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
    navigate: {
      (
        to: string,
        options?: {
          replace?: boolean
          state?: any
          preventScrollReset?: boolean
          relative?: 'route' | 'path'
        },
      ): void
      (delta: number): void
    }
    location: {
      state: any
      key: string
      pathname: string
      search: string
      hash: string
      query: Record<string, any>
    }
    setError: (err: {
      code?: string | number
      message?: string
      data?: { error?: any; errorInfo?: any }
    }) => void
  }
}
