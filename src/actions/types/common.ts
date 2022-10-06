import { IResponse } from '../commonTypes/response'

/**
 * 角色列表
 * @url /z/api/1.0/role/list
 * @method GET
 */
export type getAdsList = {
  request: Record<string, any>
  response: {
    success: boolean
    code: number
    /**
     * @rule 2-6
     */
    data: {
      roleId: number
      /**
       * @value #cname
       */
      roleName: string
    }[]
  }
}

/**
 * 登录
 * @url /z/api/1.0/login
 * @method POST
 */
export type login = {
  request: {
    phone: string
    code: string
  }
  response: {
    /**
     * @value e2323e32eds32e2332ewdw
     */
    token: string
    success: boolean
  }
}
