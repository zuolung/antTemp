import { useLocation, useNavigate } from 'react-router-dom'
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  DatePicker,
  Cascader,
  TreeSelect,
  Tooltip,
} from 'antd'
import dayjs from 'dayjs'
import { queryToObj, objToQuery } from '@/utils/common/query'
import './index.less'

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
const MonthPicker = DatePicker.MonthPicker
const DATA_FORMAT = 'YYYY-MM-DD'

export type TKeyValueType = {
  key: string | number
  value: string
}
export interface SearchConfig<T> {
  /** 对应type传给数据录入组件的props */
  props?: Record<string, any>
  /** 数据录入组件的类型 */
  type:
    | 'timePicker'
    | 'monthPicker'
    | 'rangePicker'
    | 'cascader'
    | 'treeSelect'
    | 'input'
    | 'select'
  /** 字段名称 */
  key: keyof T | string[]
  /** 时间日期等组件的格式 */
  format?: string
  /** 1200宽度以上表单项在24份中的宽度值 */
  col?: number
  label?: string
  options?: TKeyValueType[]
  showSearch?: boolean
  defaultValue?: any
}
export interface ISearchQuery<T> {
  /** 搜索项配置 */
  searchConfig: SearchConfig<T>[]
  /** 默认搜索数据 */
  searchData?: object
  /** 搜索方法, 返回false的时候不向地址加入请求参数 */
  fetchData?: (o: Record<string, any>) => boolean | void
  /** 重置后的回掉 */
  resetInfo?: () => void
  /** 到处方法触发 */
  exportResult?: () => void
  /** 实例 */
  searchRef?: any
  className?: string
}

function SearchQuery<T>(props: ISearchQuery<T>) {
  const location: any = useLocation()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const {
    searchData = {},
    searchConfig,
    fetchData,
    resetInfo,
    exportResult,
  } = props
  location.query = queryToObj(location.search.replace('?', ''))
  const formData = {}
  const query = { ...location.query, ...searchData }

  function computedValue(item, query) {
    const { type, key, defaultValue, format } = item

    if (type === 'timePicker') {
      return query[key] || defaultValue
        ? dayjs(query[key] || defaultValue, format || 'YYYY-MM-DD')
        : undefined
    } else if (type === 'monthPicker') {
      return query[key] || defaultValue
        ? dayjs(query[key] || defaultValue, format || 'YYYY-MM-DD')
        : undefined
    } else if (type === 'rangePicker') {
      return (query[key[1]] && query[key[2]]) || defaultValue
        ? [
            dayjs(query[key[1]] || defaultValue[0], format || DATA_FORMAT),
            dayjs(query[key[2]] || defaultValue[1], format || DATA_FORMAT),
          ]
        : undefined
    } else if (type === 'cascader') {
      return query[key] ? query[key] : defaultValue || null
    } else if (type === 'treeSelect') {
      return query[key] ? query[key] / 1 : undefined
    } else if (type === 'select') {
      return query[key] || defaultValue || undefined
    }
    return query[key] || defaultValue || null
  }

  searchConfig.map((item) => {
    const { key, type } = item
    let currentKey = key as string
    if (type === 'rangePicker') {
      currentKey = key[0]
    }
    formData[currentKey] = computedValue(item, query)
  })

  function handleCurFormData(val, config) {
    const formData = form.getFieldsValue()
    form.setFieldsValue({ [config.key]: val })
    searchConfig.map((item) => {
      if (item.type === 'timePicker') {
        formData[item.key] = formData[item.key]
          ? dayjs(formData[item.key]).format(item.format || 'YYYY-MM-DD')
          : undefined
      } else if (item.type === 'rangePicker') {
        const dateValue = formData[item.key[0]]

        if (!dateValue) {
          formData[item.key[1]] = undefined
          formData[item.key[2]] = undefined
        } else {
          formData[item.key[1]] = dayjs(dateValue[0]).format(
            item.format || 'YYYY-MM-DD',
          )
          formData[item.key[2]] = dayjs(dateValue[1]).format(
            item.format || 'YYYY-MM-DD',
          )
          formData[item.key[0]] = [formData[item.key[1]], formData[item.key[2]]]
        }
      } else if (item.type === 'cascader') {
        formData[item.key] = formData[item.key] ? formData[item.key] : undefined
      } else if (item.type === 'input' || !item.type) {
        formData[item.key] =
          formData[item.key] === '' ? undefined : formData[item.key]
      }
    })

    config.onSelect(val, { ...formData, [config.key]: val })
  }

  function submit(params, notVerify) {
    for (const key in params) {
      if (!params[key] && params[key] !== 0) {
        params[key] = undefined
      }
    }
    if (fetchData && notVerify !== 'notVerify') {
      if (fetchData(params) === false) return
    }

    const query_ = {
      ...query,
      ...params,
    }

    navigate(
      `${
        location.pathname.includes('?')
          ? location.pathname
          : `${location.pathname}?`
      }${objToQuery(query_)}`,
      {
        replace: true,
      },
    )
  }

  function handleFinish(notVerify) {
    const formData = form.getFieldsValue()
    searchConfig.map((item) => {
      if (item.type === 'timePicker') {
        formData[item.key] = formData[item.key]
          ? dayjs(formData[item.key]).format(item.format || 'YYYY-MM-DD')
          : undefined
      } else if (item.type === 'monthPicker') {
        formData[item.key] = formData[item.key]
          ? dayjs(formData[item.key]).format(item.format || 'YYYY-MM-DD')
          : undefined
      } else if (item.type === 'rangePicker') {
        const dateValue = formData[item.key[0]]

        if (!dateValue) {
          formData[item.key[1]] = undefined
          formData[item.key[2]] = undefined
        } else {
          formData[item.key[1]] = dayjs(dateValue[0]).format(
            item.format || 'YYYY-MM-DD',
          )
          formData[item.key[2]] = dayjs(dateValue[1]).format(
            item.format || 'YYYY-MM-DD',
          )
          formData[item.key[0]] = undefined
        }
      } else if (item.type === 'cascader') {
        formData[item.key] = formData[item.key] ? formData[item.key] : undefined
      } else if (item.type === 'input' || !item.type) {
        formData[item.key] =
          formData[item.key] === '' ? undefined : formData[item.key]
      } else if (item.type === 'select') {
        formData[item.key] =
          formData[item.key] === '' || formData[item.key] === undefined
            ? undefined
            : `${formData[item.key]}` === '0'
            ? '0'
            : formData[item.key]
      }
    })
    submit({ ...formData }, notVerify)
  }

  function handleReset() {
    const formData = {}
    searchConfig.map((item) => {
      const { key, type } = item

      let currentKey = key as string
      if (type === 'rangePicker') {
        currentKey = key[0]
      }
      formData[currentKey] = computedValue(item, searchData)
    })
    form.setFieldsValue(formData)

    handleFinish('notVerify')
    resetInfo && resetInfo()
  }

  function renderItem(config) {
    const {
      type,
      label,
      placeholder,
      props,
      showSearch,
      options,
      onSelect,
      format,
    } = config
    if (type === 'input') {
      return (
        <Input
          allowClear
          placeholder={placeholder || `请输入${label}`}
          {...props}
        />
      )
    } else if (type === 'select') {
      const opts =
        options &&
        options.map((o, index) => {
          return (
            <Option
              key={index}
              value={o.key ? `${o.key}` : `${o.key}` === '0' ? '0' : ''}
            >
              <Tooltip title={o.value}>{o.value}</Tooltip>
            </Option>
          )
        })
      return showSearch ? (
        <Select
          allowClear
          showSearch
          placeholder={`请选择${label}`}
          onSelect={(val) => onSelect && handleCurFormData(val, config)}
          filterOption={(input, option) =>
            option?.['props'].children.props.title
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
          {...props}
        >
          {opts}
        </Select>
      ) : (
        <Select
          allowClear
          placeholder={`请选择${label}`}
          {...props}
          onSelect={(val) => onSelect && handleCurFormData(val, config)}
        >
          {opts}
        </Select>
      )
    } else if (type === 'timePicker') {
      return (
        <DatePicker
          allowClear
          {...props}
          format={format || DATA_FORMAT}
          placeholder="请选择"
        />
      )
    } else if (type === 'monthPicker') {
      return (
        <MonthPicker
          allowClear
          {...props}
          format={format || DATA_FORMAT}
          placeholder="请选择"
        />
      )
    } else if (type === 'rangePicker') {
      return (
        <RangePicker
          allowClear
          {...props}
          placeholder={['开始时间', '结束时间']}
          format={format || DATA_FORMAT}
        />
      )
    } else if (type === 'cascader') {
      return (
        <Cascader
          allowClear
          {...props}
          options={options}
          placeholder={`请选择${label}`}
          showSearch
        />
      )
    } else if (type === 'treeSelect') {
      let searchProps = {}
      if (showSearch) {
        searchProps = {
          showSearch: true,
          filterTreeNode: (input, TreeNode) =>
            TreeNode.props.title.toLowerCase().indexOf(input.toLowerCase()) >
            -1,
        }
      }
      return (
        <TreeSelect
          allowClear
          {...searchProps}
          placeholder="请选择"
          treeData={config.treeData}
        />
      )
    } else if (type === 'whiteSpace') {
      return <div />
    }
    return <Input placeholder={placeholder || `请输入${label}`} {...props} />
  }

  return (
    <Form
      initialValues={formData || {}}
      form={form}
      layout="inline"
      className="components-search-query"
      ref={props.searchRef}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
    >
      <Row style={{ width: '100%' }}>
        {searchConfig.map((config) => {
          if (config.type === 'rangePicker') {
            return (
              <Col
                xl={config.col || 8}
                lg={12}
                md={12}
                sm={24}
                xs={24}
                key={config.key[0]}
                style={{ marginBottom: '24px' }}
              >
                <FormItem label={config.label} name={config.key[0]}>
                  <RangePicker
                    {...config.props}
                    placeholder={
                      config.props?.['placeholder'] || ['开始时间', '结束时间']
                    }
                    format={config.format || DATA_FORMAT}
                    style={{ width: '100%' }}
                    allowClear
                  />
                </FormItem>
              </Col>
            )
          }
          return (
            <Col
              xl={config.col || 8}
              lg={12}
              md={12}
              sm={24}
              xs={24}
              key={config.key as string}
              style={{ marginBottom: '24px' }}
            >
              <FormItem label={config.label} name={config.key as string}>
                {renderItem(config)}
              </FormItem>
            </Col>
          )
        })}
      </Row>
      <Row style={{ width: '100%' }}>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button onClick={handleReset}>重置</Button>
          <Button
            type="primary"
            style={{ marginLeft: 8 }}
            onClick={handleFinish}
          >
            搜索
          </Button>
          {exportResult && (
            <Button
              type="primary"
              onClick={exportResult}
              style={{ marginLeft: 8 }}
            >
              导出筛选结果
            </Button>
          )}
        </Col>
      </Row>
    </Form>
  )
}

export default SearchQuery
