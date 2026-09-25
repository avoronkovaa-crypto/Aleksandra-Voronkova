import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import './styles/global.css'
import App from './App'
import { StoreProvider } from './state/store'
import { ToastProvider } from './components/Toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <StoreProvider>
        <MotionConfig reducedMotion="user">
          <ToastProvider>
            <App />
          </ToastProvider>
        </MotionConfig>
      </StoreProvider>
    </HashRouter>
  </StrictMode>,
)
