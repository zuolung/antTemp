import {
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'
import {
  Tree,
  Modal,
  Form,
  Input,
  Empty,
  Checkbox,
  Tabs,
  Spin,
  Button,
  message,
} from 'antd'
import { PicRightOutlined } from '@ant-design/icons'
import Draggable from 'react-draggable'
import { PAGE_CONFIG } from './config'
import './index.less'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const SERVER_PORT = 8181
const pageTypesMap = {
  list: '列表页',
  detail: '详情页',
  operate: '编辑页',
}

export default function PageInsert() {
  const [form] = Form.useForm()
  const [selectData, setSelectData] = useState<Record<string, any>>()
  const [, forceUpdate] = useState<any>()
  const [show, setShow] = useState<boolean>(false)
  const treeRef = useRef<any>()
  const [activeKey, setActiveKey] = useState<any>()

  const handSelect = useCallback(function (_, _node) {
    const node = _node.node
    form.resetFields()
    if (node) {
      form.setFieldsValue({
        target: '/src' + node.path.split('src')[1],
        originPath: node.path,
      })
      setSelectData(node)
    } else {
      setSelectData(node)
    }
  }, [])

  const renderPageConfig = useCallback(function (config, type, i) {
    return config.map((it, x) => {
      if (it.type === 'Input') {
        return (
          <FormItem
            key={`${x}${it.key}${type}`}
            name={[type, it.key]}
            label={it.title}
            rules={[{ required: true }]}
          >
            <Input placeholder={`请输入${it.title}`} />
          </FormItem>
        )
      }

      if (it.type === 'Checkbox') {
        return (
          <FormItem
            key={`${x}${it.key}${type}`}
            name={[type, it.key]}
            label={it.title}
            rules={[{ required: true }]}
          >
            <CheckboxGroup>
              {it.data.map((dd, index) => (
                <Checkbox
                  value={dd.key}
                  key={`operatecheck#${dd.title}${index}${i}${x}`}
                >
                  {dd.title}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </FormItem>
        )
      }

      return null
    })
  }, [])

  const submitAction = useCallback(function () {
    form
      .validateFields()
      .then((res) => {
        fetch(`http://localhost:${SERVER_PORT}/dir/update`, {
          method: 'post',
          body: JSON.stringify(res),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              message.success('更新成功')
              treeRef.current?.getTreeData()
              setShow(false)
              const newUrl = res.addDir
                ? `${res.target.replace('/src/pages', '')}/${res.addDir}/${
                    res.pageTypes[0]
                  }`
                : res.target.replace('/src/pages', '') + `/${res.pageTypes[0]}`
              setTimeout(() => {
                window.location.href = newUrl
              }, 100)
            } else message.error(data.message || '服务异常')
          })
      })
      .catch((err) => {
        if (err.errorFields && err.errorFields.length > 0) {
          if (err.errorFields[0].name.length > 1) {
            const pageTab = err.errorFields[0].name[0]
            setActiveKey(pageTab)
          }
        }
      })
  }, [])

  return (
    <>
      <Draggable>
        <Button
          shape="circle"
          className="components-page-insert-btn"
          onClick={() => setShow(true)}
          type="primary"
          icon={<PicRightOutlined />}
        ></Button>
      </Draggable>
      <Modal
        className="components-page-insert"
        title="页面插入"
        width={1100}
        style={{ top: 20 }}
        visible={show}
        onCancel={() => setShow(false)}
        footer={null}
      >
        <div className="page-insert-body">
          <div className="left-content">
            <TreeBox onSelect={handSelect} ref={treeRef} />
          </div>

          <div className="right-content">
            {selectData ? (
              <Form form={form}>
                <FormItem name="originPath" style={{ height: 0, margin: 0 }} />

                <FormItem
                  name="target"
                  label="目标文件"
                  rules={[{ required: true }]}
                >
                  <Input disabled />
                </FormItem>

                <FormItem name="addDir" label="新文件夹">
                  <Input placeholder="请输入插入文件夹名称" />
                </FormItem>

                <FormItem
                  name="pageTypes"
                  label="页面类型"
                  rules={[{ required: true }]}
                >
                  <CheckboxGroup
                    onChange={(e) => {
                      setActiveKey(e.length ? e[0] : undefined)
                      setTimeout(() => {
                        forceUpdate(e)
                      }, 100)
                    }}
                  >
                    <Checkbox value="list">列表页（list.tsx）</Checkbox>
                    <Checkbox value="operate">编辑页 (operate.tsx)</Checkbox>
                    <Checkbox value="detail">详情页（detail.tsx）</Checkbox>
                  </CheckboxGroup>
                </FormItem>

                {form.getFieldValue('pageTypes') ? (
                  <Tabs
                    activeKey={activeKey}
                    onChange={(e) => setActiveKey(e)}
                    style={{
                      padding: '0 34px',
                      position: 'relative',
                      top: -20,
                    }}
                    items={(form.getFieldValue('pageTypes') || []).map(
                      (item) => {
                        return {
                          label: pageTypesMap[item],
                          key: item,
                        }
                      },
                    )}
                  />
                ) : (
                  ''
                )}

                {(form.getFieldValue('pageTypes') || []).map((item, index) => (
                  <div
                    style={activeKey === item ? {} : { display: 'none' }}
                    key={`pageTypes#${index}`}
                  >
                    {renderPageConfig(PAGE_CONFIG[item], item, index)}
                  </div>
                ))}

                <Button
                  onClick={submitAction}
                  className="submit-btn"
                  type="primary"
                >
                  提交
                </Button>
              </Form>
            ) : (
              <Empty description="未选择" />
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}

const TreeBox = forwardRef(function TreeBox(props: any, ref?) {
  const [tree, setTree] = useState<any>({
    data: [],
    expandedKeys: undefined,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getTreeData()
  }, [])

  const getTreeData = useCallback(function () {
    setLoading(true)
    fetch('http://localhost:8181/dir/tree')
      .then((res) => res.json())
      .then((data) => {
        const defaultExpand = [data.key]
        data = transformTree(data)
        setTree({
          data: [data],
          expandedKeys: defaultExpand,
        })
        setLoading(false)
      })
  }, [])

  useImperativeHandle(ref, function () {
    return {
      getTreeData,
      setExpand: (expandedKeys) => {
        setTree({
          ...tree,
          expandedKeys: [...tree.expandedKeys, ...expandedKeys],
        })
      },
    }
  })

  return (
    <>
      {loading ? (
        <Spin tip="加载中" />
      ) : (
        <Tree
          showIcon
          expandedKeys={tree.expandedKeys}
          treeData={tree.data}
          onSelect={props.onSelect}
          onExpand={(e) => {
            setTree({
              ...tree,
              expandedKeys: e,
            })
          }}
        />
      )}
    </>
  )
})

function transformTree(data) {
  if (data.type === 'dir') {
    data.icon = (
      <svg viewBox="0 0 1024 1024" width="18" height="18">
        <path
          d="M860.16 869.3248H163.84a84.5312 84.5312 0 0 1-84.48-84.4288V239.104A84.5312 84.5312 0 0 1 163.84 154.6752h300.5952a120.6272 120.6272 0 0 1 94.8736 46.592l46.8992 60.672a65.3824 65.3824 0 0 0 51.2 25.2416H860.16a84.5312 84.5312 0 0 1 84.48 84.4288v413.2864a84.5312 84.5312 0 0 1-84.48 84.4288zM163.84 200.7552a38.4 38.4 0 0 0-38.4 38.3488v545.792a38.4 38.4 0 0 0 38.4 38.3488h696.32a38.4 38.4 0 0 0 38.3488-38.3488V371.6096a38.4 38.4 0 0 0-38.3488-38.3488h-202.5472a111.7184 111.7184 0 0 1-87.8592-43.1616l-46.8992-60.672a74.2912 74.2912 0 0 0-58.4192-28.672z"
          fill="#4D4D4D"
        ></path>
        <path
          d="M819.2 429.6192H114.432a23.04 23.04 0 1 1 0-46.08H819.2a23.04 23.04 0 0 1 0 46.08z"
          fill="#4D4D4D"
        ></path>
      </svg>
    )
  } else {
    data.icon = (
      <svg viewBox="0 0 1024 1024" width="18" height="18">
        <path d="M858.251002 65.538669 709.22692 65.538669l-0.204661 0.184195c-0.112564 0-0.204661-0.038886-0.312108-0.038886-13.967106 0-25.461905 10.3006-27.538193 23.667026l-0.248663 0.225127c-7.556093 33.045627-18.427698 76.41232-53.822836 76.41232l-246.183935-1.517563c-34.927487 0-45.37442-42.771129-53.413514-75.16491-1.36509-13.386892-12.069897-23.892153-25.568329-24.910343l-0.370437-0.375553L165.181063 64.020082c-20.552082 0-37.239136 16.666588-37.239136 37.239136l0 819.454394c0 20.571525 16.686031 37.238113 37.239136 37.238113l693.049472 1.517563c20.557198 0 37.239136-16.666588 37.239136-37.238113L895.469672 102.777805C895.490138 82.205257 878.788757 65.538669 858.251002 65.538669L858.251002 65.538669 858.251002 65.538669zM858.251002 922.232199l-693.069939-1.517563L165.181063 101.260242l126.998439 0c9.087982 36.459377 26.38288 100.44569 88.810698 100.44569l246.183935 1.517563c62.952774 0 80.69281-64.810075 88.940658-100.44569L858.230536 102.777805l0 819.454394L858.251002 922.232199 858.251002 922.232199 858.251002 922.232199zM407.172513 101.372805l209.110575 1.517563c10.295484 0 18.61701-8.346085 18.61701-18.622126 0-10.277064-8.321526-18.61701-18.61701-18.61701L407.172513 64.133669c-10.281157 0-18.622126 8.339946-18.622126 18.61701C388.550387 93.025697 396.891356 101.372805 407.172513 101.372805L407.172513 101.372805 407.172513 101.372805zM246.674099 381.845685c0 10.276041 8.339946 18.61701 18.61701 18.61701l497.744321 1.517563c10.295484 0 18.622126-8.340969 18.622126-18.61701 0-10.277064-8.326643-18.622126-18.622126-18.622126l-497.744321-1.517563C255.014044 363.223558 246.674099 371.56862 246.674099 381.845685L246.674099 381.845685 246.674099 381.845685zM763.03543 542.794353l-497.744321-1.517563c-10.277064 0-18.61701 8.321526-18.61701 18.61701 0 10.3006 8.339946 18.622126 18.61701 18.622126l497.744321 1.517563c10.295484 0 18.622126-8.321526 18.622126-18.622126C781.657556 551.115879 773.330914 542.794353 763.03543 542.794353L763.03543 542.794353 763.03543 542.794353zM763.03543 719.526497l-497.744321-1.517563c-10.277064 0-18.61701 8.321526-18.61701 18.622126 0 10.295484 8.339946 18.61701 18.61701 18.61701l497.744321 1.517563c10.295484 0 18.622126-8.321526 18.622126-18.61701C781.657556 727.848023 773.330914 719.526497 763.03543 719.526497L763.03543 719.526497 763.03543 719.526497zM763.03543 719.526497"></path>
      </svg>
    )
  }

  if (data.path.includes('.tsx') || data.path.includes('.ts'))
    data.selectable = false

  if (data.children && data.children.length) {
    data.children.forEach((item) => {
      transformTree(item)
    })
  }

  return data
}
