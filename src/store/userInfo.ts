import { atom, RecoilState } from 'recoil'

export type IUserInfoStore =
  | {
      nickName: string
      name: string
      roleName_zh: string
    }
  | undefined

export const userInfoStore = atom({
  key: 'userInfo',
  default: undefined,
}) as RecoilState<IUserInfoStore>
