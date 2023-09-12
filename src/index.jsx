import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App'
import { initCometChat } from './services/Chat'


const root = ReactDOM.createRoot(document.getElementById('root'))
initCometChat().then(()=> {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
})
