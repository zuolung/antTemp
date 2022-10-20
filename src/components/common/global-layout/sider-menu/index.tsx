import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'
import isArray from 'lodash/isArray'
import { Location, NavigateFunction } from 'react-router-dom'
import { Menu } from 'antd'

import './style.less'

export interface ResourceNode {
  /** 项目 basename */
  baseName?: string
  /** 子资源 */
  children?: ResourceNode[] | null
  /** 资源类型 1:系统 2:菜单 3:功能 */
  type?: string
  /** 资源code */
  resCode: string
  /** 资源名称 */
  resName: string
  /** 父资源 */
  parentCode?: string
}

export interface AppRoute {
  /** 路由 title 信息 */
  title?: string
  /** 全局面包屑 title 信息 */
  desc?: string
  /** 路由路径 */
  path?: string
  /** 页面资源代码 */
  resCode: string
  /** 菜单自定义跳转路径 */
  menu?: string
  /** 是否隐藏全局面包屑栏 */
  hideBreadcrumb?: boolean
}

interface MenuProps extends AppRoute, ResourceNode {
  children?: MenuProps[] | null
}

interface SiderMenuProps {
  /** 资源树配置 */
  config: ResourceNode[]
  /** 项目basename */
  basename?: string
  /** 项目路由配置 */
  appRoutes: AppRoute[]
  location: Location
  navigate: NavigateFunction
  collapsed?: boolean
}

const RESOURCE_MENU_TYPE = '2'

const SiderMenu: React.FC<SiderMenuProps> = (props) => {
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [collapseding, setCollapseding] = useState(false)
  const { config = [], basename, appRoutes, collapsed } = props

  const filterMenu = useCallback(
    (data?: ResourceNode['children']) =>
      (data || [])
        ?.filter(({ type }) => type === RESOURCE_MENU_TYPE)
        .map((item) => {
          const match = appRoutes.find(
            ({ resCode }) => item.resCode === resCode,
          ) || { resName: item.resName, resCode: item.resCode }
          const required: MenuProps = { ...match, ...item }

          if (item.children) {
            return { ...required, children: filterMenu(item.children) }
          }

          return required
        }),
    [appRoutes],
  )

  function getKey({ resName, parentCode, resCode }: ResourceNode) {
    return `${parentCode}${resCode}${resName}`
  }

  const [menuData] = useMemo(() => {
    let menu: MenuProps[] = []

    if (config.length > 0 && isArray(config[0]?.children)) {
      const data = config[0]?.children

      if (basename) {
        data?.forEach((node) => {
          if (node.resCode === basename) {
            menu = filterMenu(node.children)
          }
        })
      } else {
        menu = filterMenu(data?.[0]?.children)
      }
    }

    return [menu]
  }, [filterMenu, basename, config])

  useEffect(() => {
    const hasMatchPath = (path?: string) => path === location.pathname

    if (!hasMatchPath) return

    const arr: string[] = []
    let activeKey: string | null = null

    menuData?.forEach((subMenu) => {
      if (subMenu.children) {
        return subMenu.children.forEach((childMenu) => {
          if (hasMatchPath(childMenu.path)) {
            arr.push(getKey(childMenu))
            activeKey = getKey(subMenu)
          }
        })
      }

      if (hasMatchPath(subMenu.path)) {
        if (!subMenu.children) arr.push(getKey(subMenu))
        activeKey = subMenu.path as string
      }
    })

    setSelectedKeys(arr)
    activeKey && setOpenKeys([activeKey])
  }, [menuData, location.pathname])

  // 渲染二级菜单
  const renderMenuItem = useCallback(
    (item: MenuProps) => {
      const onMenuItemClick = ({ menu, path }: AppRoute) => {
        const link = menu || path
        if (link) props.navigate(link)
      }

      return (
        <Menu.Item key={getKey(item)} onClick={() => onMenuItemClick(item)}>
          {item.resName}
        </Menu.Item>
      )
    },
    [history, selectedKeys],
  )

  // 渲染一级菜单
  const renderSubMenu = useMemo(() => {
    return menuData?.map((route: MenuProps) => {
      const { children, resName } = route

      if (children && children.length > 0) {
        // 是否有二级菜单
        return (
          <Menu.SubMenu key={getKey(route)} title={resName}>
            {children.map((child) => renderMenuItem(child))}
          </Menu.SubMenu>
        )
      }

      return renderMenuItem(route)
    })
  }, [menuData, renderMenuItem])

  useEffect(() => {
    if (collapsed) {
      setCollapseding(true)
      setTimeout(() => {
        setCollapseding(false)
      }, 100)
    }
  }, [collapsed])

  return (
    <Menu
      mode="inline"
      theme="dark"
      className="__global-menu"
      openKeys={!collapseding ? openKeys : []}
      onOpenChange={(keys) => setOpenKeys(keys as string[])}
      selectedKeys={selectedKeys}
    >
      {renderSubMenu}
    </Menu>
  )
}

SiderMenu.defaultProps = {
  config: [{ children: [], resCode: 'PC_Backstage', resName: 'PC 后台' }],
  appRoutes: [],
}

export default memo(SiderMenu)
