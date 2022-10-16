// @ts-nocheck
import type { accountList, accountDetail, addOrUpdate } from '../types/account'
import { createFetch } from '@/utils/request'

// 授信账额度管理
export const accountListAccount = createFetch<
  accountList['request'],
  accountList['response']
>('/z/account/list', 'GET')

// 授信详情
export const accountDetailAccount = createFetch<
  accountDetail['request'],
  accountDetail['response']
>('/z/account/detail', 'GET')

// 授信账额度新增或编辑
export const addOrUpdateAccount = createFetch<
  addOrUpdate['request'],
  addOrUpdate['response']
>('/z/account/addOrUpdate', 'POST')
