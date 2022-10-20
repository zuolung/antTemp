import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import classnames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import { Menu, Avatar, Dropdown, Tabs, Switch } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CaretDownOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { NavigateFunction, Location } from 'react-router-dom'
import { MenuInfo } from 'rc-menu/lib/interface'
import { ResourceNode } from '../sider-menu'
import { findChild0Url } from '../utils'

import './style.less'

export interface User {
  nickName: string
  name: string
  // eslint-disable-next-line camelcase
  roleName_zh: string
}

export interface DropdownMenu {
  /** 下拉菜单激活键名 */
  key: string
  /** 下拉菜单激活键值 */
  label: string
  /** 下拉菜单每项前的 icon */
  icon?: React.ReactNode
  /** 是否隐藏下拉菜单 */
  isHidden?: boolean
}

export interface ExtraProps {
  /** CRM 系统是否灰度 */
  hasCRMGray?: boolean
  /** CRM 系统当前灰度状态 */
  isCRMGray?: boolean
  /** 切换新老版本回调 */
  onClick?: () => void
  /** 用户区域 hover 下拉菜单 */
  dropdownMenus?: DropdownMenu[]
  /** 切换系统回调 */
  onTabChange?: (resourceNode: ResourceNode) => void
  /** 未登录时点击登录 */
  onLogin?: () => void
  /** 退出登录回调 */
  onLogout?: () => void
  /** 隐藏展开/收起按钮 */
  hideCollapsedButton?: boolean
}

export interface Dictionary<T = string> {
  [index: string]: T
}

export interface ThemeConfig {
  lightVars?: Dictionary
  darkVars?: Dictionary
  compactVars?: Dictionary
}

interface GlobalHeaderProps {
  /** 当前激活态系统名称 */
  activeKey?: string
  /** 资源树配置 */
  config: ResourceNode[]
  /** 当前登陆用户信息 */
  user?: User
  /** 下拉菜单额外的渲染参数 */
  extraProps?: ExtraProps
  /** 左侧菜单的状态 */
  collapsed?: boolean
  /** 展开/关闭左侧菜单回调 */
  onCollapsed?: (collapsed: boolean) => void
  /** 主题配置对象 */
  theme?: ThemeConfig
  navigate: NavigateFunction
  location: Location
  /** 应用类型：正常或微应用 */
  appType?: 'normal' | 'micro'
}

// 开启动态主题后，antd-theme-webpack-plugin 会在 index.html 内注入 less 文件，因此 window 对象上会添加 less 的相关方法，因此在此处兼容 less 的类型
type Window = globalThis.Window & typeof globalThis & { less: any }

const defaultExtraProps: GlobalHeaderProps['extraProps'] = {
  hasCRMGray: false,
  onLogin() {
    window.location.href = `/login/index?redirect=${window.location.href}`
  },
  async onLogout() {
    window.location.href = `/login/index?redirect=${window.location.href}`
  },
  onTabChange(tab) {
    if (tab.baseName) window.location.href = tab.baseName
  },
  dropdownMenus: [
    { key: 'switch', label: '切换角色' },
    { key: 'toggle-version', label: '去新版本' },
    { key: 'user-center', label: '个人中心' },
    { key: 'logout', label: '退出登录' },
  ],
}

const GlobalHeader: React.FC<GlobalHeaderProps> = (props) => {
  const {
    collapsed,
    onCollapsed,
    activeKey,
    user,
    config = [],
    theme = {},
    appType = 'normal',
    navigate,
  } = props

  const themeApplied = useRef(false)
  const getThemeVars = () => {
    const initialVars = theme.lightVars ?? {}
    const storeVars = window.localStorage.getItem('app-theme')

    if (!storeVars) {
      themeApplied.current = true
      return initialVars
    }
    return { ...JSON.parse(storeVars) }
  }
  const [themeVars, setThemeVars] = useState(getThemeVars())
  const [themeName, setThemeName] = useState(themeVars['@theme'] ?? 'light')
  const enableDynamicTheme = !isEmpty(theme)

  const extraProps = useMemo(() => {
    return { ...defaultExtraProps, ...(props.extraProps ?? {}) }
  }, [props.extraProps])

  const [memoConfig] = useMemo(() => {
    const headers: ResourceNode[] = []

    config[0]?.children?.forEach((node: ResourceNode) => {
      headers.push(node)
    })

    return [headers]
  }, [config])

  const jumpPath = useCallback(
    function (url, replace?: boolean) {
      if (appType === 'normal') {
        navigate(url, { replace })
      } else {
        if (replace) {
          window.location.replace(url)
        } else {
          window.location.href = url
        }
      }
    },
    [appType],
  )

  // 线上环境且传入了主题变量对象才开启菜单
  if (enableDynamicTheme) {
    if (!extraProps.dropdownMenus?.find((item) => item.key === 'dark-theme')) {
      extraProps.dropdownMenus?.unshift({
        key: 'dark-theme',
        label: '深色模式',
      })
    }
  }

  const lessModifyVars = (vars, thenCallback) => {
    ;(window as Window).less
      ?.modifyVars(vars)
      .then(thenCallback)
      .catch((error) => {
        throw new Error(error)
      })
  }

  useEffect(() => {
    if (enableDynamicTheme && !themeApplied.current) {
      lessModifyVars(themeVars, () => {
        themeApplied.current = true
      })
    }
  }, [themeApplied, themeVars, enableDynamicTheme])

  useEffect(function () {
    /** 微应用不执行, 可使用 ExtraProps.onTabChange 自行切换url */
    if (appType === 'normal') {
      const currentResCode = location.pathname.split('/')[1] || ''
      tabChange(currentResCode, true)
    }
  }, [])

  const tabChange = (key, notChangeUrl?: boolean) => {
    const current = memoConfig.find((v) => v.resCode === key)
    if (extraProps.onTabChange) {
      extraProps.onTabChange(current as ResourceNode)
    }
    if (!notChangeUrl) {
      const redirectUrl = findChild0Url(current)
      if (redirectUrl) {
        jumpPath(redirectUrl)
      }
    }
  }

  const onMenuClick = (item: MenuInfo) => {
    switch (item.key) {
      case 'logout':
        extraProps.onLogout?.()
        break
      case 'switch':
        window.location.href = '/checkRole'
        break
      case 'toggle-version':
        extraProps.onClick?.()
        break
      case 'user-center':
        window.location.href = `${location.origin}/settings/user-center/own-authority`
        break
      default:
        break
    }
  }

  const onSwitchChange = useCallback(
    (checked) => {
      const vars = checked ? theme.darkVars : theme.lightVars

      setThemeName(checked ? 'dark' : 'light')
      setThemeVars(vars)

      lessModifyVars(vars, () => {
        window.localStorage.setItem('app-theme', JSON.stringify(vars))
      })
    },
    [theme],
  )

  const renderDropdownMenuItem = useCallback(
    (node) => {
      if (node.isHidden) return null

      const rightArrow = node.key !== 'logout' && <RightOutlined />

      switch (node.key) {
        case 'dark-theme': {
          return (
            <Menu.Item key={node.key}>
              <div className="content">
                <span>{node.label}</span>
                <Switch
                  checked={themeName === 'dark'}
                  onChange={onSwitchChange}
                />
              </div>
            </Menu.Item>
          )
        }
        case 'switch': {
          return (
            <Menu.Item key={node.key} className="switch-role">
              <div className="content">
                <span>{node.label}</span>
                <span className="current">
                  当前：{user?.roleName_zh || '-'}
                </span>
              </div>
              {rightArrow}
            </Menu.Item>
          )
        }
        case 'toggle-version': {
          if (!extraProps.hasCRMGray) return null

          return (
            <Menu.Item key={node.key}>
              <span>{extraProps.isCRMGray ? '去旧版页面' : '去新版页面'}</span>
              {rightArrow}
            </Menu.Item>
          )
        }
        default: {
          return (
            <Menu.Item key={node.key}>
              <span>{node.label}</span>
              {rightArrow}
            </Menu.Item>
          )
        }
      }
    },
    [user, extraProps, themeName, onSwitchChange],
  )

  const menu = (
    <Menu className="comps_menu" onClick={onMenuClick}>
      {(extraProps.dropdownMenus || []).map(renderDropdownMenuItem)}
    </Menu>
  )

  const logoCls = classnames('logo', { collapsed })

  return (
    <div className="__global-header">
      <div className="header-left">
        <div
          className={logoCls}
          key="logo"
          onClick={() => {
            const host = window.location.host
            host && jumpPath('/')
          }}
        >
          <div className="logo-con">
            <img
              src="https://antm-js.gitee.io/resource/antmjs-vantui.jpg"
              alt=""
            />
            <span>Antmjs</span>
          </div>
        </div>
        {!extraProps.hideCollapsedButton && (
          <div
            className="collapsed-button"
            onClick={() => onCollapsed?.(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        )}
        <div className="system-tabs">
          <Tabs
            activeKey={activeKey}
            onChange={tabChange}
            className="tab-header"
          >
            {memoConfig.map(({ resCode, resName }) => {
              return <Tabs.TabPane key={resCode} tab={resName} />
            })}
          </Tabs>
        </div>
      </div>
      {user ? (
        <div className="header-right">
          <Dropdown overlayClassName="__global-dropdown-menu" overlay={menu}>
            <div className="action account">
              <Avatar size="small" className="avatar">
                {user.nickName}
              </Avatar>
              <div className="name">
                <p className="nick">{user.nickName || user.name}</p>
                {user.roleName_zh && <p className="role">{user.roleName_zh}</p>}
              </div>
              <CaretDownOutlined />
            </div>
          </Dropdown>
        </div>
      ) : (
        <div className="header-right">
          <a onClick={extraProps.onLogin}>登录</a>
        </div>
      )}
    </div>
  )
}

export default GlobalHeader
