// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { GlobalStyles } from '@mui/material'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme.js'
import coverBg from '~/assets/Cover_Covezi.png'
// React Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Material-UI Confirm Dialog
import { ConfirmProvider } from 'material-ui-confirm'
// Redux Store
import { store } from '~/redux/store'
import { Provider } from 'react-redux'
// React Router
import { BrowserRouter } from 'react-router-dom'
// Redux Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)
// Inject store for external Redux access
import { injectStore } from './utils/authorizeAxios'
injectStore(store)
// Debug utility for clearing auth data
import './utils/clearAuth'

// Restore token from localStorage on app start (for page refresh)
const token = localStorage.getItem('accessToken')
if (token) {
  const authorizeAxios = require('./utils/authorizeAxios').default
  authorizeAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename='/'>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider defaultOptions={{
            dialogProps: { maxWidth: 'xs' },
            confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
            cancellationButtonProps: { color: 'inherit' }
          }}>
            <GlobalStyles styles={{ 
              a: { textDecoration: 'none' },
              'html, body, #root': {
                backgroundImage: `url(${coverBg})`,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh'
              }
            }}/>
            <CssBaseline />
            <App />
            <ToastContainer position="bottom-right" theme="colored"/>
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
