import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import Store from './Store/Store'
import { Toaster } from './components/ui/sonner'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
    <BrowserRouter>
    <App />
    <Toaster />
  </BrowserRouter>
  </Provider>
)
