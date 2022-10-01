import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import routersConfig from './config'
import { LoadPage, PageNotFind } from '@/components/common'

const NO_TOKEN_PAGES = ['/pages/login/index']

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="pages/list/index" />} />
        {routersConfig.map((item: any) => {
          return (
            <Route
              key={item.path}
              path={item.path}
              element={
                <LoadPage
                  {...item}
                  noTokenPages={NO_TOKEN_PAGES}
                  redirect="/pages/login/index"
                />
              }
            />
          )
        })}
        <Route path="*" element={<PageNotFind />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
