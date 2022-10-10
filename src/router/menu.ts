export type menuSource = {
  baseName?: string
  children?: menuSource[] | null
  type?: '0' | '1' | '2'
  resCode: string
  resName: string
  parentCode?: string
}

export const menu: menuSource[] = [
  {
    resCode: 'system_PC',
    type: '0',
    resName: 'XX系统',
    children: [
      {
        resName: '财务管理',
        resCode: 'finance',
        parentCode: 'system_PC',
        type: '2',
        children: [
          {
            resName: '信用管理',
            resCode: 'finance_credit',
            parentCode: 'finance',
            type: '2',
            children: [
              {
                resName: '信用管理',
                resCode: 'finance_credit_index',
                parentCode: 'finance_credit',
                type: '2',
                children: [],
              },
            ],
          },
          {
            resName: '账户管理',
            resCode: 'finance_account',
            parentCode: 'finance',
            type: '2',
            children: [
              {
                resName: '账户管理',
                resCode: 'finance_account_index',
                parentCode: 'finance_account',
                type: '2',
                children: [],
              },
            ],
          },
        ],
      },
      {
        resName: '营销管理',
        resCode: 'market',
        parentCode: 'system_PC',
        type: '2',
        children: [
          {
            resName: '会员管理',
            resCode: 'market_member',
            parentCode: 'market',
            type: '2',
            children: [
              {
                resName: '会员列表',
                resCode: 'market_member_index',
                parentCode: 'market_member',
                type: '2',
                children: [],
              },
            ],
          },
          {
            resName: '渠道管理',
            resCode: 'market_channel_index',
            parentCode: 'market_member',
            type: '2',
          },
        ],
      },
    ],
  },
]
