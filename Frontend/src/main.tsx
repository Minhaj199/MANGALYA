import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SignupProvider } from './GlobalContext/signupData.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <BrowserRouter>
  <SignupProvider>


    <App/>
  </SignupProvider>

   </BrowserRouter>
  </StrictMode>,
)
