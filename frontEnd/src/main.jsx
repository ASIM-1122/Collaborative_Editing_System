import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../src/redux/store'    // <-- import your store
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import SocketProvider from "../src/SocketProvider";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>        {/* <-- wrap with Provider */}
      <AuthProvider>
        <BrowserRouter>
          <SocketProvider>
            <App />
          </SocketProvider>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
)
