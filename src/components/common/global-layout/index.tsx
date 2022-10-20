import React, { memo, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import classnames from 'classnames'
import { Layout } from 'antd'
import { useRecoilState } from 'recoil'
import { commonStore } from '@/store'
import GlobalHeader, { User, ExtraProps, ThemeConfig } from './global-header'
import SiderMenu, { ResourceNode, AppRoute } from './sider-menu'
import './style.less'

interface GlobalLayoutProps {
  /** 当前应用的 basename */
  basename?: string
  /** 当前登陆用户信息 */
  user?: User
  /** 资源树配置 */
  resourceTree: ResourceNode[]
  /** 项目路由配置 */
  appRoutes: AppRoute[]
  /** 主题配置对象 */
  theme?: ThemeConfig
  /** 额外的配置参数 */
  extraProps?: ExtraProps
  children?: React.ReactNode
  /** 应用类型：正常或微应用 */
  appType?: 'normal' | 'micro'
}

const GlobalLayout: React.FC<GlobalLayoutProps> = (props) => {
  const {
    basename,
    user,
    resourceTree,
    appRoutes,
    theme,
    extraProps,
    children,
    appType = 'normal',
  } = props

  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [common, setCommon] = useRecoilState(commonStore)

  useEffect(
    function () {
      setCommon({
        ...common,
        menuCollapsed: collapsed,
      })
    },
    [collapsed],
  )

  const mainContentCls = classnames('__main-content', { collapsed })

  return (
    <Layout className="__global-layout">
      <Layout.Header className="__top-header">
        <GlobalHeader
          activeKey={basename}
          user={user}
          config={resourceTree}
          theme={theme}
          collapsed={collapsed}
          appType={appType}
          onCollapsed={(e) => {
            setCollapsed(e)
          }}
          location={location}
          extraProps={extraProps}
          navigate={navigate}
        />
      </Layout.Header>
      <Layout>
        <Layout.Sider collapsed={collapsed}>
          <SiderMenu
            config={resourceTree}
            appRoutes={appRoutes}
            basename={basename}
            navigate={navigate}
            location={location}
            collapsed={collapsed}
          />
        </Layout.Sider>
        <Layout className={mainContentCls}>
          <Layout.Content>{children}</Layout.Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

GlobalLayout.defaultProps = {
  resourceTree: [],
  appRoutes: [],
}

export default memo(GlobalLayout)
export { GlobalHeader, SiderMenu }
