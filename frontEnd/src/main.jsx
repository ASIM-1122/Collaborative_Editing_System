import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux' // ✅ import Provider
import store from './redux/store' // ✅ import store

import App from './App'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>  {/* ✅ wrap entire app */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
