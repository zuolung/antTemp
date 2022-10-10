/**
 * @title 账户管理
 */
export default function Index(props: Project.IPageProps) {
  const { navigate, location } = props
  console.info(location, '__________ location')
  return (
    <div
      onClick={() => {
        navigate('/market/member/index', {
          state: {
            a: 1,
            b: 2,
          },
        })
      }}
    >
      'account-list''account-list''account-list''account-list''account-list''account-list''account-list''account-list''account-list'
    </div>
  )
}
