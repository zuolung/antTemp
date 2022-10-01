import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Redirect({
  children,
  url,
  replace = true,
  before,
}: {
  children?: JSX.Element
  url: string
  replace?: boolean
  before?: (call: () => void) => void
}): JSX.Element {
  const navitgate = useNavigate()

  useEffect(() => {
    if (before && typeof before === 'function') {
      before(action)
    } else {
      action
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
