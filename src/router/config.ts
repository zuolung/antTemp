export default [
  {
    path: '/finance/account/detail',
    component: () => import('@/pages/finance/account/detail'),
    resCode: 'finance_account_detail',
    title: '账户详情',
  },
  {
    path: '/finance/account/index',
    component: () => import('@/pages/finance/account/index'),
    resCode: 'finance_account_index',
    title: '账户管理',
  },
  {
    path: '/finance/account/operate',
    component: () => import('@/pages/finance/account/operate'),
    resCode: 'finance_account_operate',
    title: '--',
  },
  {
    path: '/finance/credit/index',
    component: () => import('@/pages/finance/credit/index'),
    resCode: 'finance_credit_index',
    title: '授信管理',
  },
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
]
