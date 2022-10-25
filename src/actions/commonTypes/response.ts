export type IResponseOk = {
  success: boolean
  code: number
  message?: string
}

export type IResponse<T> = {
  success: boolean
  data: T
  /**
   * @value 200
   */
  code: number
}

export type IResponsePageData<T> = IResponse<{
  /**
   * @rule 19-19
   */
  list: T[]
  /**
   * @value 39
   */
  totalCount: number
  /**
   * @value 1
   * @rule +1
   */
  pageNo: number
  /**
   * @value 10
   */
  pageSize: number
}>

export type IPaginationParams = {
  pageSize?: number
  pageNo?: number
}
