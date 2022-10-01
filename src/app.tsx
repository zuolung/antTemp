import Router from '@/router/index'
import { RecoilRoot } from 'recoil'
import { Watermark } from '@/components/common/index'

export default function App() {
  return (
    <RecoilRoot>
      <Router />
      <Watermark text="antmjs" />
    </RecoilRoot>
  )
}
