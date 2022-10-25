import { Col, Row } from 'antd'
import { ReactNode } from 'react'
import BaseBox from '../module-box'
import './index.less'

type IDataItem = {
  /** 展示描述 */
  label?: string | JSX.Element
  /** 字段内容 */
  value?: string | JSX.Element | number
  /** 占总宽度24份的份数 */
  width?: 6 | 8 | 12 | 24 | 16
  /** 描述和内容布局形式上下|左右，默认row */
  direction?: 'column' | 'row'
  /** 是否不展示 */
  hideen?: boolean
}

type IProps = {
  /** 详情模块标题 */
  title?: ReactNode
  /** 详情渲染数据 */
  dataSource: Array<IDataItem>
  /** 默认栅格项宽度，默认为8 */
  defaultItemWidth?: 6 | 8 | 12 | 24 | 16
  renderHeaderRight?: ReactNode
}

export default function DetailPage({
  title,
  dataSource,
  defaultItemWidth = 8,
  renderHeaderRight,
}: IProps): JSX.Element {
  return (
    <BaseBox
      className="components-defail-box"
      title={title}
      renderHeaderRight={renderHeaderRight}
    >
      <Row className="detail-body" gutter={24}>
        {(dataSource || []).map((d, index) => {
          if (d.hideen) return ''

          return (
            <Col
              key={`defail-box${index}${d.value}`}
              className="data-item"
              xl={d.width || defaultItemWidth}
              lg={12}
              md={24}
              style={{ flexDirection: d.direction || 'row' }}
            >
              {d.label ? <div className="label">{d.label}:</div> : ''}
              <div
                className="detail-value"
                style={d.direction === 'column' ? { marginTop: 8 } : {}}
              >
                {d.value}
              </div>
            </Col>
          )
        })}
      </Row>
    </BaseBox>
  )
}
