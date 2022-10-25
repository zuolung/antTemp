import { useEffect, ReactNode } from 'react'
import { useRecoilState } from 'recoil'
import { commonStore } from '@/store'
import './index.less'

type Iprops = {
  title?: string
  renderTitle?: ReactNode
  renderRight?: ReactNode
}

export default function PageTitle({ title, renderRight, renderTitle }: Iprops) {
  const [common] = useRecoilState(commonStore)
  const { menuCollapsed } = common

  useEffect(
    function () {
      document.title = title || ''
    },
    [title],
  )

  return (
    <div
      className="components-page-title"
      style={{
        width: !menuCollapsed ? 'calc(100vw - 200px)' : 'calc(100vw - 80px)',
      }}
    >
      <span>{renderTitle || title}</span>
      {renderRight && renderRight}
    </div>
  )
}
