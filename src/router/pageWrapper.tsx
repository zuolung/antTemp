import { cloneElement, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useNavigate, useLocation } from 'react-router-dom'
import ErrorBoundary from '@/components/common/error-boundary'
import { commonStore, userInfoStore } from '@/store/index'
import { GlobalLayout } from '@/components/common'
import { userInfoCommon } from '@/actions/actions/common'
import { queryToObj } from '@/utils/common/query'
import routersConfig from './config'
import { menu } from './menu'

export default function PageWrapper({
  children,
  noMenuPages = [],
}: {
  children: React.ReactNode
  noMenuPages: string[]
}) {
  const [common, setCommon] = useRecoilState(commonStore)
  const [userInfo, setUserinfo] = useRecoilState(userInfoStore)
  const navigate = useNavigate()
  const location = useLocation()
  const [baseName, setBaseName] = useState('finance')

  useEffect(function () {
    getUserInfo()
  }, [])

  const getUserInfo = async function () {
    const res = await userInfoCommon({})
    setUserinfo(res.data)
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
      basename={baseName}
      user={userInfo}
      appRoutes={routersConfig}
      resourceTree={menu || []}
      extraProps={{
        onTabChange: (e) => {
          if (e) setBaseName(e.resCode)
        },
      }}
    >
      <ErrorBoundary setError={setError}>
        {cloneElement(children as any, {
          navigate,
          location: {
            ...location,
            query: queryToObj(location.search.replace('?', '')),
          },
          setError,
        })}
      </ErrorBoundary>
    </GlobalLayout>
  )
}
