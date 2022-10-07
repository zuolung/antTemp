export default [
  {
    path: '/pages/list/index',
    component: () => import('@/pages/list/index'),
    resCode: '_pages_list_index',
  },
  {
    path: '/pages/login/index',
    component: () => import('@/pages/login/index'),
    resCode: '_pages_login_index',
  },
]
