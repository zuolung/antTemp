import App from './app'
import { createRoot } from 'react-dom/client'
import './index.css'

const targetDom = document.getElementById('root')
if (targetDom) {
  const root = createRoot(targetDom)
  root.render(<App />)
}
