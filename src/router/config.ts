export default [
  {
    path: '/finance/account/index',
    component: () => import('@/pages/finance/account/index'),
    resCode: 'finance_account_index',
    title: '账户管理',
  },
  {
    path: '/finance/credit/index',
    component: () => import('@/pages/finance/credit/index'),
    resCode: 'finance_credit_index',
    title: '信用管理',
  },
  {
    path: '/login/index',
    component: () => import('@/pages/login/index'),
    resCode: 'login_index',
    title: '登录',
  },
  {
    path: '/market/channel/index',
    component: () => import('@/pages/market/channel/index'),
    resCode: 'market_channel_index',
    title: '渠道管理',
  },
  {
    path: '/market/member/index',
    component: () => import('@/pages/market/member/index'),
    resCode: 'market_member_index',
    title: '会员管理',
  },
  {
    path: '/welcome',
    component: () => import('@/pages/welcome'),
    resCode: 'welcome',
    title: '欢迎',
  },
]
