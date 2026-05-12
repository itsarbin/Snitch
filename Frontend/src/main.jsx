import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/index.css'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './app/App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
