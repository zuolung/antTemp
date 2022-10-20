import { pathToRegexp } from 'path-to-regexp'
import { ResourceNode, AppRoute } from './sider-menu'

interface ComputedBreadcrumbProps {
  resourceTree: ResourceNode[]
  appRoutes: AppRoute[]
  basename?: string
  pathname: string
}

export function findResourceNodeByResCode(
  tree: ResourceNode[],
  resCode: string,
): ResourceNode {
  const list = JSON.parse(JSON.stringify(tree))

  while (list.length) {
    const node = list.pop()
    if (node.resCode === resCode) return node
    if (node.children) list.push(...node.children)
  }

  return { resName: '', resCode: '', children: null }
}

/**
 * 面包屑，顶部菜单，中间部分可以点击
 */
export function computedBreadcrumbParams(props: ComputedBreadcrumbProps): {
  breadcrumbConfig: string[]
  title: string
} {
  const { resourceTree, appRoutes, basename, pathname } = props
  // 如果在 route 里配置了 hideBreadcrumb: true，隐藏
  const appRoute = appRoutes.find((i) => {
    // 避免 path 中有 '?' 导致 pathToRegexp 解析报错
    const path = (i.path || '').split('?')[0] || ''
    const regexp = pathToRegexp(path)
    return regexp.exec(pathname)
  })

  if (appRoute?.hideBreadcrumb) {
    return { breadcrumbConfig: [], title: '' }
  }

  const others = pathname.split('/').filter((i) => i)
  const othersRouter: string[] = []
  const desc: string[] = []

  for (let i = 0; i < others.length; i++) {
    const path = `/${others.slice(0, i + 1).join('/')}`
    const appRoute = appRoutes.find((i) => i.path === path)

    // 优先匹配 appRoute，没找的话 再匹配 resourceTree
    if (appRoute) {
      if (appRoute.title) othersRouter.push(appRoute.title)
      if (appRoute.desc) desc.push(appRoute.desc)
      continue
    }

    const computedOthers = others.map((v) => v.replace('-', '_'))

    const prefix = basename ? `${basename}_` : ''
    const resCode = `${prefix}${computedOthers.slice(0, i + 1).join('_')}`
    othersRouter.push(findResourceNodeByResCode(resourceTree, resCode).resName)
  }
  const breadcrumbTitle = desc.length > 0 ? desc[desc.length - 1] : ''

  return {
    breadcrumbConfig: othersRouter.filter((v) => v),
    title: breadcrumbTitle as any,
  }
}

export function findChild0Url(data) {
  if (data.children[0] && data.children[0].url) {
    return data.children[0].url
  } else if (data.children[0]) {
    return findChild0Url(data.children[0])
  } else {
    return ''
  }
}
