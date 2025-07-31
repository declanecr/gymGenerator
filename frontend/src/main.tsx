import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { getTheme } from './theme'
import { DeviceProvider } from './context/DeviceProvider'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={getTheme()}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <DeviceProvider>
            <CssBaseline />
            <App />
          </DeviceProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
