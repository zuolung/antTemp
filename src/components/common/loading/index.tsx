import './index.less'

export default function Loading() {
  return (
    <div
      className="common-components-loading"
      style={{
        textAlign: 'center',
        position: 'absolute',
        top: '45%',
        left: '50%',
        marginLeft: '-100px',
        marginTop: '-110px',
      }}
    >
      <img
        style={{ width: 200 }}
        src="//lhc-image.oss-cn-beijing.aliyuncs.com/lhc/2017/09/18/500w_500h_0A4BA1505708674.gif"
      />
      <p>努力加载中...</p>
    </div>
  )
}
