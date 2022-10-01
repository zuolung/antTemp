import { BrowserRouter, Routes, Route } from 'react-router-dom'
import routersConfig from './config'
import { AsyncComponent } from '@/components/common'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={'--'} />
        {routersConfig.map((item: any) => {
          return (
            <Route
              key={item.path}
              path={item.path}
              element={<AsyncComponent {...item} />}
            />
          )
        })}
      </Routes>
    </BrowserRouter>
  )
}
