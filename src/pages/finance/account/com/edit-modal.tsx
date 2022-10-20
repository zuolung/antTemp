import { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'
import { accountDetailAccount } from '@/actions/actions/account'
import { createFetch } from '@/utils/request'

const FormItem = Form.Item
const request = createFetch('/api/z', 'GET')

export default function Index(props: any) {
  const { visible, oncancel, refresh } = props
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible > 0) {
      searchData()
    }
  }, [visible])

  const searchData = async () => {
    const res = await accountDetailAccount({ id: visible })
    form.setFieldsValue(res.data)
  }

  const submit_ = () => {
    form.validateFields().then((res) => {
      console.info(res)
      refresh()
      request({})
    })
  }

  const oncancel_ = () => {
    oncancel()
    form.resetFields()
  }

  return (
    <Modal
      destroyOnClose
      width={700}
      title={visible < 0 ? '新增' : '编辑'}
      visible={visible}
      onOk={submit_}
      onCancel={oncancel_}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <FormItem
          label="合作伙伴/代理商/合资公司名称"
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="请输入" />
        </FormItem>

        <FormItem
          label="合作伙伴/代理商/合资公司ID"
          name="cId"
          rules={[{ required: true }]}
        >
          <Input placeholder="请输入" />
        </FormItem>

        <FormItem
          label="额度"
          name="amount"
          rules={[
            { required: true },
            () => ({
              validator(_, value) {
                const MAX = 9999999
                const rtNumber = String(value).split('.')[1]
                if (
                  value <= MAX &&
                  (!rtNumber || rtNumber.length < 3) &&
                  value > 0
                ) {
                  return Promise.resolve()
                }
                if (value > MAX) {
                  return Promise.reject(new Error(`不能大于${MAX}`))
                }
                if (rtNumber && rtNumber.length > 2) {
                  return Promise.reject(new Error('小数点位数不能大于2位'))
                }
                if (value < 0) {
                  return Promise.reject(new Error('不能为负数'))
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input placeholder="请输入" type="number" />
        </FormItem>
      </Form>
    </Modal>
  )
}
