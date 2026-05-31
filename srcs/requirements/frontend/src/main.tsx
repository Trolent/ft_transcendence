import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import '@/features/i18n/index.ts'
import App from './App.tsx'
import { AuthProvider } from '@/features/auth'
import { StatusProvider } from '@/features/status'
import { ChatProvider } from '@/features/chat'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StatusProvider>
          <ChatProvider>
                <App />
          </ChatProvider>
        </StatusProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)


// ajouter bg à navbar et peut-être footer, peut-être faire circle du bas ?
// mettre une transparence