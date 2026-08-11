import React from 'react'
import { createRoot } from 'react-dom/client'

// We are renaming it here to MyRouter to bypass any cache
import MyRouter from './routes/Router.jsx' 

import './style/App.css'
import './style/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { store } from './app/store/store.js'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = '216590359988-7o09rnoeif1545flgl6qt1mtbtit9006.apps.googleusercontent.com'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <MyRouter />
    </GoogleOAuthProvider>
  </Provider>
)