import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function Warning404() {
  const navigate = useNavigate()

  return (
    <Result
      status="404"
      title="404"
      subTitle="该页面不存在"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          回到首页
        </Button>
      }
    />
  )
}
