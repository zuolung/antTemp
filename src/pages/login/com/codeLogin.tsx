import { message } from 'antd'
import { QRCodeCanvas } from 'qrcode.react'
import './codeLogin.less'

export default function CodeLogin({
  swtichType,
}: {
  swtichType: (type: string) => void
}) {
  return (
    <div className="login-components-code-login">
      <QRCodeCanvas value="https://antm-js.gitee.io/vantui" />
      <div className="qrcode-extra">
        <div className="qrcode-tip">电小二 App 扫码登录</div>
        <div className="btn-group">
          <span
            onClick={() => {
              message.info('功能暂未开启')
            }}
          >
            账号密码登录
          </span>
          <span onClick={() => swtichType('phone')}>验证码登录</span>
        </div>
      </div>
    </div>
  )
}
