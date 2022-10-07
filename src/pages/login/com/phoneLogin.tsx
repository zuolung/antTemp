import { Form, Input, Button, Row, Avatar, message } from 'antd'
import {
  DingdingOutlined,
  WechatOutlined,
  EllipsisOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import './phoneLogin.less'
import classnames from 'classnames'
import { loginCommon } from '@/actions/actions/common'
import { login } from '@/actions/types/common'

export default function PhoneLogin({
  swtichType,
  success,
}: {
  swtichType: (type: string) => void
  success: (data: login['response']['data']) => void
}) {
  const [data, setData] = useState({
    phone: '',
    code: '',
    collapsed: true,
  })

  const onAvatarClick = (type) => {
    switch (type) {
      case 'ellipsis': {
        setData({
          ...data,
          collapsed: !data.collapsed,
        })
        break
      }
      default:
        message.info('功能暂未开启')
        break
    }
  }

  const avatarCls = (cls) =>
    classnames(`avatar-${cls}`, { collapsed: data.collapsed })

  const loginAction = async function () {
    const res = await loginCommon({ phone: data.phone, code: data.code })
    if (res.success) {
      message.success('登录成功').then(() => {
        success(res.data)
      })
    }
  }

  return (
    <Form className="login-components-phone-login" onFinish={() => {}}>
      <h3>验证码登录</h3>
      <Row>
        <Input
          required
          type="text"
          name="login-phone"
          onChange={(e) => setData({ ...data, phone: e.target.value })}
        />
        <label title="请输入手机号" placeholder="我的账号" />
      </Row>
      <Row className="smsCode">
        <Input
          required
          type="text"
          onChange={(e) => setData({ ...data, code: e.target.value })}
        />
        <label title="请输入验证码" placeholder="验证码" />
        <Button block className="code-btn">
          获取验证码
        </Button>
      </Row>
      <Button
        block
        className="confirm-login"
        type="primary"
        htmlType="submit"
        disabled={!data.code || !data.phone}
        onClick={loginAction}
      >
        立即登录
      </Button>
      <Row className="operate-group">
        <div className="avatars">
          <Avatar
            className={avatarCls('dingtalk')}
            icon={<DingdingOutlined />}
            onClick={() => onAvatarClick('dingtalk')}
          />
          <Avatar
            className={avatarCls('wechat')}
            icon={<WechatOutlined />}
            onClick={() => onAvatarClick('wechat')}
          />
          <Avatar
            className={avatarCls('ellipsis')}
            icon={<EllipsisOutlined />}
            onClick={() => onAvatarClick('ellipsis')}
          />
        </div>
        <Button type="link" onClick={() => swtichType('code')}>
          二维码登录
        </Button>
      </Row>
    </Form>
  )
}
