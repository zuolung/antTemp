/** @title ddsdasd */
import { useEffect, useState } from 'react'
import { Button, Table, TableColumnsType, Modal, message } from 'antd'
import { SearchQuery, PageTitle } from '@/components/common'
import { accountListDemo, deleteItemDemo } from '@/actions/actions/demo'
import { IaccountListItem, IaccountListParams } from '@/actions/types/demo'

export default function Index(props: Project.IPageProps) {
  const { location, navigate } = props
  const [listData, setListData] = useState<IaccountListItem[]>([])
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
    const res = await accountListDemo({ ...pagination, ...po })
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

  const showWordDetail = (val, name) => {
    Modal.success({
      title: `查看${name}`,
      content: val,
    })
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后数据不可恢复！',
      onOk: async () => {
        await deleteItemDemo({ id: record.id })
        message.success('操作成功')
        searchData({})
      },
    })
  }

  const columns: TableColumnsType<IaccountListItem> = [
    {
      title: '用户名称',
      dataIndex: 'name',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (val) => {
        if (val.length < 8) {
          return val
        } else
          return (
            <span
              className="primary-color"
              onClick={() => showWordDetail(val, '备注')}
            >
              {val.substring(0, 8)}...
            </span>
          )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (re) => (
        <div>
          <span onClick={() => handleDelete(re)}>删除</span>
          <span onClick={() => navigate(`/finance/detail?id=${re.id}`)}>
            查看详情
          </span>
          <span onClick={() => navigate(`/finance/operate?id=${re.id}`)}>
            编辑
          </span>
        </div>
      ),
    },
  ]

  return (
    <div className="pages-account-index">
      <PageTitle title="ddsdasd" />
      <SearchQuery<IaccountListParams>
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
            key: 'month',
            label: '月份选择',
            type: 'monthPicker',
            format: 'YYYY-MM',
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
        <Button onClick={() => navigate('/finance/operate')}>新增</Button>
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
