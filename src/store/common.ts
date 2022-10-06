import { atom, RecoilState } from 'recoil'

export type IcommonStore = {
  error?: any
}

export const commonStore = atom({
  key: 'common',
  default: {},
}) as RecoilState<IcommonStore>
