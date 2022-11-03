import { RecoilRoot } from 'recoil'
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'
import { Watermark } from '@/components/common/index'
import Router from '@/router/index'
import PageInsert from '@/components/page-insert'
import './style/common.less'

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      {process.env.NODE_ENV === 'development' && <PageInsert />}
      <RecoilRoot>
        <Router />
        <Watermark text="antmjs" />
      </RecoilRoot>
    </ConfigProvider>
  )
}
