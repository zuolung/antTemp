// @ts-nocheck
import { createFetch } from '@/utils/request'
import type { login, userInfo, uploadImage } from '../types/common'

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

// 用户信息
export const uploadImageCommon = createFetch<
  uploadImage['request'],
  uploadImage['response']
>('/z/api/1.0/uploadImage', 'POST')
