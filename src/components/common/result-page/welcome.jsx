import React from 'react'
import { Result } from 'antd'

export default function Warning404 () {
  return (
    <Result
      icon={
        <i
          style={{ color: '#3DBD7D', fontSize: 54 }}
          className="dianfont icon-xiaodian"
        />
      }
      title=""
      // extra={<Button type="primary">Next</Button>}
    />
  )
}
