// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { GlobalStyles } from '@mui/material'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme.js'
// Config react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// MUI dialog
import { ConfirmProvider } from 'material-ui-confirm'
// Config Redux Store
import { store } from '~/redux/store'
import { Provider } from 'react-redux'
// Config react-router-dom with BrowserRouter
import { BrowserRouter } from 'react-router-dom'
// Config Redux-Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)
// Inject store technique: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component
import { injectStore } from './utils/authorizeAxios'
injectStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider defaultOptions={{
            dialogProps: { maxWidth: 'xs' },
            confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
            cancellationButtonProps: { color: 'inherit' }
          }}>
            <GlobalStyles styles={{ a: { textDecoration: 'none' } }}/>
            <CssBaseline />
            <App />
            <ToastContainer position="bottom-right" theme="colored"/>
          </ConfirmProvider>
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
