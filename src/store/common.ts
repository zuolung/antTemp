import { atom, RecoilState } from 'recoil'

export type IcommonStore = {
  error?: any
  menuCollapsed?: boolean
}

export const commonStore = atom({
  key: 'common',
  default: {},
}) as RecoilState<IcommonStore>
