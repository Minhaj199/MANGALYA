import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SignupProvider } from './GlobalContext/signupData.tsx'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from 'react-redux' 
import { PersistGate } from 'redux-persist/integration/react'
import store,{persistor} from './Redux/ReduxGlobal.ts'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";






createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <BrowserRouter>
  <SignupProvider>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <ToastContainer/> 
        <App/>
      
      </PersistGate>
    </Provider>
  </SignupProvider>
   </BrowserRouter>
   
  </StrictMode>,
)
