import {
  IPaginationParams,
  IResponsePageData,
  IResponseOk,
} from '../commonTypes/response'

export type IaccountListItem = {
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
   * 备注
   * @value #cparagraph(1,1,3)
   */
  remark: string
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

export type IaccountListParams = {
  name?: string
  select?: number
  time?: number
  treeSelect?: number
  month?: string
  cascader?: string
}

/**
 * 授信账额度管理
 * @url /z/demo/list
 * @method GET
 */
export type accountList = {
  request: IaccountListParams & IPaginationParams
  response: IResponsePageData<IaccountListItem>
}

/**
 * 授信详情
 * @url /z/demo/detail
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
 * @url /z/demo/addOrUpdate
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

/**
 * 数据删除
 * @url /z/demo/addOrUpdate
 * @method POST
 * @timeout 500
 */
export type deleteItem = {
  request: {
    id?: number
  }
  response: IResponseOk
}
