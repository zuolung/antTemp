/** @title 账户管理 */
import { useEffect, useState } from 'react'
import { Button, Table, TableColumnsType } from 'antd'
import moment from 'moment'
import { SearchQuery } from '@/components/common'
import { accountListAccount } from '@/actions/actions/account'
import { accountList } from '@/actions/types/account'
import PageTitle from '@/components/common/page-title'
import EditModal from './com/edit-modal'

export default function Index(props: Project.IPageProps) {
  const { location } = props
  const [listData, setListData] = useState<
    accountList['response']['data']['list']
  >([])
  const [loading, setLoading] = useState(false)
  const [visibleId, setVisibleId] = useState<number>()
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

  const columns: TableColumnsType<any> = [
    {
      title: '合作伙伴/合资公司/代理商ID',
      dataIndex: 'cId',
    },
    {
      title: '合作伙伴/合资公司/代理商名称',
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
          <span
            onClick={() =>
              props.navigate(`/finance/account/detail?id=${re.id}`)
            }
          >
            查看详情
          </span>
          <span onClick={() => setVisibleId(re.id)}>编辑</span>
        </div>
      ),
    },
  ]

  return (
    <div className="pages-account-index">
      <PageTitle title="账户管理" />
      <EditModal
        visible={visibleId}
        oncancel={() => setVisibleId(undefined)}
        refresh={() => {
          searchData({
            pageNo: 1,
          })
        }}
      />
      <SearchQuery
        className="search-box"
        fetchData={handleSearch}
        searchData={pagination}
        searchConfig={[
          {
            key: 'companyOrAgentId',
            label: '合作伙伴/代理商/合资公司ID',
            type: 'input',
          },
          {
            key: 'companyOrAgentName',
            label: '合作伙伴/代理商/合资公司名称',
            type: 'input',
          },
          {
            key: ['lastrepayTime', 'lastrepayTimeStart', 'lastrepayTimeEnd'],
            label: '授信使用时间',
            type: 'rangePicker',
          },
        ]}
      />
      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <Button onClick={() => setVisibleId(-1)}>新增</Button>
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
