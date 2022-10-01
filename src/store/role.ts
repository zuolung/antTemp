import { atom, RecoilState } from 'recoil'

export type IRoleItem = {
  name: string
  roleId: number
} & Record<string, any>

export type IRoleList = IRoleItem[]

export type IRoleStore = {
  roleList?: IRoleList
  role?: IRoleItem
}

export const roleStore = atom({
  key: 'roleStore',
  default: {},
}) as RecoilState<IRoleStore>
