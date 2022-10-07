import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function Render403() {
  const navigate = useNavigate()

  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，你没有权限访问该页面"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          回到首页
        </Button>
      }
    />
  )
}
