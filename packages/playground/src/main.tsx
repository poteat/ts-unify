import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './app'
import RootElement from './root-element'

createRoot(RootElement.rootElement()).render(
  <StrictMode>
    <App.App />
  </StrictMode>,
)
