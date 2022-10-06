export type IResponseOk = {
  success: boolean
  code: number
}

export interface IResponse<T> {
  success: boolean
  data: T
}

export type ResponsePageData<T> = IResponse<{
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
  pageSize: number
  pageNo: number
}
