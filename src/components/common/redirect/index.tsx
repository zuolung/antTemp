import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type Iprops = {
  /** 跳转地址 */
  url: string
  /** 是否replace跳转 */
  replace?: boolean
  /** 跳转前执行方法, 须要执行call() */
  before?: (call: () => void) => void
  children?: JSX.Element
}

export default function Redirect({
  children,
  url,
  replace = true,
  before,
}: Iprops): JSX.Element {
  const navitgate = useNavigate()

  useEffect(() => {
    if (before && typeof before === 'function') {
      before(action)
    } else {
      action()
    }
  }, [])

  const action = useCallback(
    function () {
      navitgate(url, {
        replace: replace,
      })
    },
    [url, replace],
  )

  return children || <></>
}
