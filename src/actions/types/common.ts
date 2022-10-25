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
    data: {
      /**
       * @value e2323e32eds32e2332ewdw
       */
      token: string
    }
    success: boolean
  }
}

/**
 * 用户信息
 * @url /z/api/1.0/userInfo
 * @method POST
 */
export type userInfo = {
  request: Record<string, any>
  response: {
    data: {
      /**
       * @value 若言
       */
      nickName: string
      /**
       * @value ruoyan
       */
      name: string
      /**
       * @value 运营
       */
      roleName_zh: string
    }
    success: boolean
  }
}

/**
 * 用户信息
 * @url /z/api/1.0/uploadImage
 * @method POST
 */
export type uploadImage = {
  request: Record<string, any>
  response: {
    /**
     * @value "@Image('100x100','@color','小甜甜')"
     */
    data: string
    success: boolean
  }
}
