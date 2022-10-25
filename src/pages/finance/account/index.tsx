/** @title 账户管理 */
import { useEffect, useState } from 'react'
import { Button, Table, TableColumnsType } from 'antd'
import moment from 'moment'
import { SearchQuery, PageTitle } from '@/components/common'
import { accountListAccount } from '@/actions/actions/account'
import { accountListItem, accountListParams } from '@/actions/types/account'

export default function Index(props: Project.IPageProps) {
  const { location, navigate } = props
  const [listData, setListData] = useState<accountListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    pageSize: 20,
    pageNo: 1,
    total: 0,
  })

  useEffect(() => {
    searchData({
      pageNo: 1,
      ...location.query,
    })
  }, [])

  const searchData = async (po) => {
    setLoading(true)
    const res = await accountListAccount({ ...pagination, ...po })
    setListData(res.data.list)
    setLoading(false)
    setPagination({
      total: res.data.totalCount,
      pageNo: res.data.pageNo,
      pageSize: res.data.pageSize,
    })
  }

  const handlePage = (pageNo, pageSize) => {
    searchData({
      pageNo,
      pageSize,
    })
  }

  const handleSearch = (params) => {
    searchData({
      pageNo: 1,
      ...params,
    })
  }

  const columns: TableColumnsType<accountListItem> = [
    {
      title: '用户名称',
      dataIndex: 'name',
    },
    {
      title: '账户金额',
      dataIndex: 'amount',
      render: (val) => val,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (val) =>
        typeof val === 'number'
          ? moment(val).format('YYYY-MM-DD HH:mm:ss')
          : val,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (re) => (
        <div>
          <span onClick={() => navigate(`/finance/account/detail?id=${re.id}`)}>
            查看详情
          </span>
          <span
            onClick={() => navigate(`/finance/account/operate?id=${re.id}`)}
          >
            编辑
          </span>
        </div>
      ),
    },
  ]

  return (
    <div className="pages-account-index">
      <PageTitle title="账户管理" />
      <SearchQuery<accountListParams>
        className="search-box"
        fetchData={handleSearch}
        searchData={pagination}
        searchConfig={[
          {
            key: 'name',
            label: '用户名称',
            type: 'input',
          },
          {
            key: 'select',
            label: '下拉搜索',
            type: 'select',
            options: [{ value: '选项1', key: 'key1' }],
          },
          {
            key: 'time',
            label: '日期选择',
            type: 'timePicker',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          {
            key: 'month',
            label: '月份选择',
            type: 'monthPicker',
            format: 'YYYY-MM',
          },
          {
            key: ['creatTime', 'creatTimeStart', 'creatTimeEnd'],
            label: '创建时间',
            type: 'rangePicker',
          },
          {
            key: 'treeSelect',
            label: '树选择',
            type: 'treeSelect',
            props: {
              treeData: [],
            },
          },
        ]}
      />
      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <Button onClick={() => navigate('/finance/account/operate')}>
          新增
        </Button>
      </div>
      <Table
        style={{ marginTop: 10 }}
        dataSource={listData}
        columns={columns}
        loading={loading}
        pagination={{
          total: pagination.total,
          pageSize: pagination.pageSize,
          current: pagination.pageNo || 1,
          onChange: handlePage,
          showSizeChanger: true,
        }}
        rowKey="id"
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}
