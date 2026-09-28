import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// §8.2 type families: Instrument Sans Variable (wght 400–700) and IBM Plex Mono 400/500
import '@fontsource-variable/instrument-sans/wght.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './styles/tokens.css'
import './styles/base.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
