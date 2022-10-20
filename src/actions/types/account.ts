import {
  IPaginationParams,
  IResponsePageData,
  IResponseOk,
} from '../commonTypes/response'

/**
 * 授信账额度管理
 * @url /z/account/list
 * @method GET
 */
export type accountList = {
  request: {
    id?: number
    /**
     * 合作伙伴或合资公司或代理商名称
     */
    name?: string
    /**
     * 设置的时间段
     */
    updateTimeStart?: number
    /**
     * 设置的时间段
     */
    updateTimeEnd?: number
  } & IPaginationParams
  response: IResponsePageData<{
    id: number
    /**
     * 合资公司或代理商Id
     * @value 1213
     */
    cId: number
    /**
     * 合资公司或代理商名称
     * @value #ctitle
     */
    name: string
    /**
     * @value [10000, 20000, 40000]
     */
    amount: string
    /**
     * 账户截图
     * @value ["@Image('100x100','@color','小甜甜')", "@Image('100x100','color','哈哈')"]
     */
    images: string[]
    /**
     * 设置时间
     * @value #datetime
     */
    createTime: string
  }>
}

/**
 * 授信详情
 * @url /z/account/detail
 * @method GET
 */
export type accountDetail = {
  request: {
    id: number
  }
  response: {
    success: boolean
    data: {
      id: number
      /**
       * 合资公司或代理商Id
       * @value 1213
       */
      cId: number
      /**
       * 合资公司或代理商名称
       * @value #ctitle
       */
      name: string
      /**
       * @value [10000, 20000, 40000]
       */
      amount: string
      /**
       * 账户截图
       * @value ["@Image('100x100','@color','小甜甜')", "@Image('100x100','color','哈哈')"]
       */
      images: string[]
      /**
       * 设置时间
       * @value #datetime
       */
      createTime: string
    }
  }
}

/**
 * 授信账额度新增或编辑
 * @url /z/account/addOrUpdate
 * @method POST
 * @timeout 500
 */
export type addOrUpdate = {
  request: {
    id?: number
    /**
     * 合资公司/代理商/合作伙伴
     */
    type: number
    /**
     * 合作伙伴/合资公司或代理商Id
     */
    cId: number
    /**
     * 合资公司或代理商名称
     */
    name: string
    amount: string
  }
  response: IResponseOk
}
