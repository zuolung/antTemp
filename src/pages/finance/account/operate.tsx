/** @title  */
import { useEffect } from "react"
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Select,
  DatePicker,
  InputNumber,
  message,
} from "antd"
import { accountDetailDemo, addOrUpdateDemo } from "@/actions/actions/demo"
import {
  ModuleBox,
  PageTitle,
  FooterButton,
  UploadImage,
} from "@/components/common"

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
const colProps = {
  xl: 8,
  lg: 12,
  sm: 24,
}

export default function Index(props: Project.IPageProps) {
  const [form] = Form.useForm()
  const { id } = props.location.query

  useEffect(() => {
    searchData()
  }, [])

  const searchData = async () => {
    const query = { id }
    if (!query.id) return
    const res = await accountDetailDemo(query)
    form.setFieldsValue(res.data)
  }

  const submit = function () {
    form
      .validateFields()
      .then(async (data) => {
        const params = {
          ...data,
          id,
        }
        const res = await addOrUpdateDemo(params)
        if (res.success) {
          message.success(res.message || "操作成功")
        } else {
          message.error(res.message || "服务异常")
        }
      })
      .catch((err) => {
        if (err.errorFields) message.error(err.errorFields[0].errors)
      })
  }

  return (
    <Form
      scrollToFirstError
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
    >
      <PageTitle title={`页面${id ? "编辑" : "新增"}`} />
      <FooterButton showBack>
        <Button type="primary" onClick={submit}>
          {id ? "编辑" : "新增"}
        </Button>
      </FooterButton>
      <ModuleBox title="基础信息">
        <Row>
          <Col {...colProps}>
            <FormItem label="用户名称" name="name" rules={[{ required: true }]}>
              <Input placeholder="请输入" />
            </FormItem>
          </Col>

          <Col {...colProps}>
            <FormItem label="数字输入" name="num" rules={[{ required: true }]}>
              <InputNumber placeholder="请输入" />
            </FormItem>
          </Col>

          <Col {...colProps}>
            <FormItem
              label="账户金额"
              name="amount"
              rules={[
                { required: true },
                () => ({
                  validator(_, value) {
                    const MAX = 9999999
                    const rtNumber = String(value).split(".")[1]
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
                      return Promise.reject(new Error("小数点位数不能大于2位"))
                    }
                    if (value < 0) {
                      return Promise.reject(new Error("不能为负数"))
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <Input placeholder="请输入" type="number" />
            </FormItem>
          </Col>

          <Col {...colProps}>
            <FormItem
              label="下拉选择"
              name="select"
              rules={[{ required: true }]}
            >
              <Select placeholder="请选择">
                <Option value="1">选项1</Option>
              </Select>
            </FormItem>
          </Col>

          <Col {...colProps}>
            <FormItem
              label="日期选择"
              name="timePicker"
              rules={[{ required: true }]}
            >
              <DatePicker />
            </FormItem>
          </Col>

          <Col {...colProps}>
            <FormItem
              label="范围日期"
              name="rangePicker"
              rules={[{ required: true }]}
            >
              <RangePicker />
            </FormItem>
          </Col>

          <Col {...colProps}>
            <FormItem
              label="上传图片"
              name="uploadImage"
              rules={[{ required: true }]}
            >
              <UploadImage />
            </FormItem>
          </Col>
        </Row>
      </ModuleBox>
    </Form>
  )
}
