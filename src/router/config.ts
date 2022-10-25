export default [
  {
    path: '/login/index',
    component: () => import('@/pages/login/index'),
    resCode: 'login_index',
    title: '登录',
  },
  {
    path: '/welcome',
    component: () => import('@/pages/welcome'),
    resCode: 'welcome',
    title: '欢迎',
  },
  {
    path: '/finance/account/list',
    component: () => import('@/pages/finance/account/list'),
    resCode: 'finance_account_list',
    title: '管理列表',
  },
  {
    path: '/finance/account/detail',
    component: () => import('@/pages/finance/account/detail'),
    resCode: 'finance_account_detail',
    title: '详情',
  },
  {
    path: '/finance/account/operate',
    component: () => import('@/pages/finance/account/operate'),
    resCode: 'finance_account_operate',
    title: '--',
  },
]
