// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Store from './Store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={Store}>
      <HashRouter >
        <App />
      </HashRouter>
    </Provider>
  // </React.StrictMode>,
)
