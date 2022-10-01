import { Result, Button } from 'antd'

export default function Render403(props) {
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，你没有权限访问该页面"
      extra={
        <Button type="primary" onClick={() => props.history.push('/')}>
          回到首页
        </Button>
      }
    />
  )
}
