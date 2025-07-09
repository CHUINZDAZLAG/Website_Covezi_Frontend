// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// MUI dialog
import { ConfirmProvider } from 'material-ui-confirm'
// Config Redux Store
import store from '~/redux/store'
import { Provider } from 'react-redux'
// Config react-router-dom with BrowserRouter
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <ConfirmProvider defaultOptions={{
          dialogProps: { maxWidth: 'xs' },
          confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
          cancellationButtonProps: { color: 'inherit' }
        }}>
          <CssBaseline />
          <App />
          <ToastContainer position="bottom-right" theme="colored"/>
        </ConfirmProvider>
      </CssVarsProvider>
    </Provider>
  </BrowserRouter>
)
