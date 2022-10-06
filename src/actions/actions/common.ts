// @ts-nocheck
import { createFetch } from '@/utils/request'
import type { getAdsList, login } from '../types/common'

// 角色列表
export const getAdsListCommon = createFetch<
  getAdsList['request'],
  getAdsList['response']
>('/z/api/1.0/role/list', 'GET')

// 登录
export const loginCommon = createFetch<login['request'], login['response']>(
  '/z/api/1.0/login',
  'POST',
)
