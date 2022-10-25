import './index.less'

export default function ModuleBox({
  title,
  children,
  renderHeaderRight,
  className = '',
  style = {},
}: {
  title?: React.ReactNode
  children: React.ReactNode | JSX.Element[]
  renderHeaderRight?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div className={`components-base-box ${className}`} style={style}>
      {title && (
        <div className="box-title">
          <span>{title}</span>
          {renderHeaderRight && <span>{renderHeaderRight}</span>}
        </div>
      )}
      {children}
    </div>
  )
}
