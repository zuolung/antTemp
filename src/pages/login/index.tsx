import { useState } from 'react'
import PhoneLogin from './com/phoneLogin'
import CodeLogin from './com/codeLogin'
import { MobileOutlined, QrcodeOutlined } from '@ant-design/icons'
import './index.less'

type IloginType = 'phone' | 'code'

export default function Login() {
  const [loginType, setLoginType] = useState<IloginType>('phone')

  return (
    <div className="pages-login">
      {/* <img src="" className="logo" /> */}
      <div className="login-center">
        <div className="login-body">
          <div className="text-wrap">
            <div className="popover">
              <div className="popover-content">
                <div className="popover-arrow" />
                {loginType === 'phone' && '扫码登录'}
                {loginType === 'code' && '手机验证码登录'}
              </div>
            </div>

            <div className="icon-wrap">
              <div
                className="icon"
                onClick={() =>
                  setLoginType(loginType === 'code' ? 'phone' : 'code')
                }
              >
                {loginType === 'phone' && <QrcodeOutlined />}
                {loginType === 'code' && <MobileOutlined />}
              </div>
            </div>

            {loginType === 'phone' && (
              <PhoneLogin swtichType={() => setLoginType('code')} />
            )}
            {loginType === 'code' && (
              <CodeLogin swtichType={() => setLoginType('phone')} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
