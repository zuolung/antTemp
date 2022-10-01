import { Result, Button } from 'antd'

export default function Warning404(props) {
  return (
    <Result
      status="404"
      title="404"
      subTitle="该页面不存在"
      extra={
        <Button type="primary" onClick={() => props.history.push('/')}>
          回到首页
        </Button>
      }
    />
  )
}
