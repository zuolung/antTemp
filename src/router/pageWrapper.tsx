import { cloneElement } from 'react'
import ErrorBoundary from '@/components/common/error-boundary'
import { useRecoilState } from 'recoil'
import { commonStore } from '@/store/index'
import { useNavigate, useLocation } from 'react-router-dom'

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [common, setCommon] = useRecoilState(commonStore)
  const navigate = useNavigate()
  const location = useLocation()

  const setError = function (error) {
    setCommon({
      ...common,
      error,
    })
  }

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
