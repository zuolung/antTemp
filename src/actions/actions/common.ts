// @ts-nocheck
import type { login, userInfo, menuList } from '../types/common'
import { createFetch } from '@/utils/request'

// 登录
export const loginCommon = createFetch<login['request'], login['response']>(
  '/z/api/1.0/login',
  'POST',
)

// 用户信息
export const userInfoCommon = createFetch<
  userInfo['request'],
  userInfo['response']
>('/z/api/1.0/userInfo', 'POST')

// 菜单列表
export const menuListCommon = createFetch<
  menuList['request'],
  menuList['response']
>('/z/api/1.0/menu/list', 'GET')
