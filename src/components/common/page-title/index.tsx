import { Button } from 'antd'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { commonStore } from '@/store'
import './index.less'

type Iprops = {
  title?: string
  backBtnShow?: boolean
}

export default function PageTitle({ title, backBtnShow }: Iprops) {
  const [common] = useRecoilState(commonStore)
  const { menuCollapsed } = common
  const navigate = useNavigate()

  useEffect(
    function () {
      document.title = title || ''
    },
    [title],
  )

  const backAction = useCallback(function () {
    navigate(-1)
  }, [])

  return (
    <div
      className="components-page-title"
      style={{
        width: !menuCollapsed ? 'calc(100vw - 200px)' : 'calc(100vw - 80px)',
      }}
    >
      <span>{title}</span>
      {backBtnShow && (
        <Button
          onClick={backAction}
          type="default"
          size="small"
          className="page-title-back-btn"
        >
          返回
        </Button>
      )}
    </div>
  )
}
