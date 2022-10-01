import React from 'react'
import classnames from 'classnames'
import './index.less'
import alimask from './alimask'

export interface WatermarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string
  className?: string
  maskImgStyle?: React.CSSProperties
}
const Watermark: React.FC<WatermarkProps> = (props) => {
  const { text = '', className, maskImgStyle, ...restProps } = props
  const maskImg = alimask(text, {
    color: '#b1b1b1',
    width: 180,
    height: 80,
    font: '16px SimSun',
    ...maskImgStyle,
  })
  return (
    <div
      className={classnames('common-components-watermark', className)}
      style={{ backgroundImage: `url(${maskImg})` }}
      {...restProps}
    />
  )
}

export default Watermark
