import React from 'react'
import classnames from 'classnames'
import isPlainObject from 'lodash/isPlainObject'
import omit from 'lodash/omit'
import { Breadcrumb } from 'antd'
import {
  BreadcrumbProps as ATBreadcrumbProps,
  BreadcrumbItemProps as ATBreadcrumbItemProps,
} from 'antd/lib/breadcrumb'

import './style.less'

export interface BreadcrumbProps extends ATBreadcrumbProps {
  /** 面包屑配置项 */
  config: (BreadcrumbItemProps | React.ReactNode)[]
  /** 页面主内容标题 */
  title?: React.ReactNode
}

interface BreadcrumbItemProps extends ATBreadcrumbItemProps {
  /** 自定义子节点 */
  self?: React.ReactNode
  /** 子节点文本信息 */
  text?: string
}

const GlobalBreadcrumb: React.FC<BreadcrumbProps> = (props) => {
  const { config, title } = props
  const omitProperties = ['config', 'title', 'children']

  if (!config || config.length === 0) return null

  return (
    <div className="__global-breadcrumb">
      <Breadcrumb {...omit(props, omitProperties)}>
        {config.map((node, index) => {
          if (isPlainObject(node)) {
            const item = node as BreadcrumbItemProps

            if (item.self) {
              return <Breadcrumb.Item key={index}>{item.self}</Breadcrumb.Item>
            }

            const textCls = classnames({ link: item.href })

            return (
              <Breadcrumb.Item key={index} {...item}>
                <span className={textCls}>{item.text}</span>
              </Breadcrumb.Item>
            )
          } else {
            return <Breadcrumb.Item key={index}>{node as any}</Breadcrumb.Item>
          }
        })}
      </Breadcrumb>
      {title && <h3>{title}</h3>}
    </div>
  )
}

export default GlobalBreadcrumb
