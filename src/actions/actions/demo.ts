// @ts-nocheck
import { createFetch } from '@/utils/request'
import type {
  accountList,
  accountDetail,
  addOrUpdate,
  deleteItem,
} from '../types/demo'

// 授信账额度管理
export const accountListDemo = createFetch<
  accountList['request'],
  accountList['response']
>('/z/demo/list', 'GET')

// 授信详情
export const accountDetailDemo = createFetch<
  accountDetail['request'],
  accountDetail['response']
>('/z/demo/detail', 'GET')

// 授信账额度新增或编辑
export const addOrUpdateDemo = createFetch<
  addOrUpdate['request'],
  addOrUpdate['response']
>('/z/demo/addOrUpdate', 'POST')

// 数据删除
export const deleteItemDemo = createFetch<
  deleteItem['request'],
  deleteItem['response']
>('/z/demo/addOrUpdate', 'POST')
