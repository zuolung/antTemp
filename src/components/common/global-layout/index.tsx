import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import classnames from 'classnames'
import { Layout } from 'antd'
import Breadcrumb from './breadcrumb'
import GlobalHeader, { User, ExtraProps, ThemeConfig } from './global-header'
import SiderMenu, { ResourceNode, AppRoute } from './sider-menu'
import { computedBreadcrumbParams } from './utils'

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
  } = props

  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  // 获取面包屑列表
  const breadcrumbInfo = computedBreadcrumbParams({
    resourceTree,
    appRoutes,
    basename,
    pathname: location.pathname,
  })
  const { breadcrumbConfig, title } = breadcrumbInfo

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
          onCollapsed={() => setCollapsed(!collapsed)}
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
          />
        </Layout.Sider>
        <Layout className={mainContentCls}>
          <Layout.Header className="__breadcrumb-header">
            <Breadcrumb title={title} config={breadcrumbConfig} />
          </Layout.Header>
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

export default GlobalLayout
export { GlobalHeader, SiderMenu, Breadcrumb }
