import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { useDevice } from '../context/DeviceContext'
import RegisterMobile from './register/RegisterMobile'
import RegisterTablet from './register/RegisterTablet'
import RegisterDesktop from './register/RegisterDesktop'
import { Box } from '@mui/material'

export default function Register() {
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isMobile, isTablet } = useDevice()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const View = isMobile ? RegisterMobile : isTablet ? RegisterTablet : RegisterDesktop

  return (
    <Box sx={{ width: '100vw', height: '100vh' }}>
      <View loading={loading} error={error} onLoadingChange={setLoading} onError={setError} />
    </Box>
  )
}
