import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoadPage, PageNotFind } from '@/components/common'
import routersConfig from './config'
import PageWrapper from './pageWrapper'

const NO_TOKEN_PAGES = ['/login/index']
const NO_MENU_PAGES = ['/login/index']

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="welcome" />} />
        {routersConfig.map((item: any) => {
          return (
            <Route
              key={item.path}
              path={item.path}
              element={
                <PageWrapper noMenuPages={NO_MENU_PAGES}>
                  <LoadPage
                    {...item}
                    noTokenPages={NO_TOKEN_PAGES}
                    redirect="/login/index"
                  />
                </PageWrapper>
              }
            />
          )
        })}
        <Route path="*" element={<PageNotFind />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
