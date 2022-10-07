import { cloneElement, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useNavigate, useLocation } from 'react-router-dom'
import ErrorBoundary from '@/components/common/error-boundary'
import { commonStore, userInfoStore } from '@/store/index'
import { GlobalLayout } from '@/components/common'
import { userInfoCommon, menuListCommon } from '@/actions/actions/common'
import { menuSource } from '@/actions/types/common'
import routersConfig from './config'

export default function PageWrapper({
  children,
  noMenuPages = [],
}: {
  children: React.ReactNode
  noMenuPages: string[]
}) {
  const [common, setCommon] = useRecoilState(commonStore)
  const [userInfo, setUserinfo] = useRecoilState(userInfoStore)
  const [menu, setMenu] = useState<menuSource[]>()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(function () {
    getUserInfo()
    getMenuInfo()
  }, [])

  const getUserInfo = async function () {
    const res = await userInfoCommon({})
    setUserinfo(res.data)
  }

  const getMenuInfo = async function () {
    const res = await menuListCommon({})
    if (res[0]) {
      setMenu(res.data)
    } else {
      setMenu([
        {
          resName: '列表管理',
          resCode: '_pages_list_index',
          type: '2',
          baseName: 'list',
          children: [
            {
              resName: '列表管理',
              resCode: '_pages_list_index',
              parentCode: 'list',
              type: '2',
              children: [],
            },
          ],
        },
      ])
    }
  }

  const setError = function (error) {
    setCommon({
      ...common,
      error,
    })
  }

  if (noMenuPages.includes(location.pathname)) {
    return (
      <ErrorBoundary setError={setError}>
        {cloneElement(children as any, {
          navigate,
          location,
          setError,
        })}
      </ErrorBoundary>
    )
  }

  return (
    <GlobalLayout
      user={userInfo}
      appRoutes={routersConfig}
      resourceTree={menu || []}
    >
      <ErrorBoundary setError={setError}>
        {cloneElement(children as any, {
          navigate,
          location,
          setError,
        })}
      </ErrorBoundary>
    </GlobalLayout>
  )
}
