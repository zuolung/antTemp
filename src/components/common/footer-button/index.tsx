import { Button } from 'antd'
import { useRecoilState } from 'recoil'
import { commonStore } from '@/store'
import { useNavigate } from 'react-router-dom'
import './index.less'
import React from 'react'

type Iprops = {
  renderLeft?: React.ReactNode
  children?: React.ReactNode
  showBack?: boolean
}

export default function PageTitle({ children, renderLeft, showBack }: Iprops) {
  const [common] = useRecoilState(commonStore)
  const { menuCollapsed } = common
  const navigate = useNavigate()

  return (
    <div
      className="components-footer-button"
      style={{
        width: !menuCollapsed ? 'calc(100vw - 200px)' : 'calc(100vw - 80px)',
      }}
    >
      <div className="left-content">{renderLeft}</div>
      <div className="right-content">
        {showBack && <Button onClick={() => navigate(-1)}>返回</Button>}
        {children}
      </div>
    </div>
  )
}
