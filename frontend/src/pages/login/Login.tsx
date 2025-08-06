import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { useDevice } from '../../context/DeviceContext'
import { Box, Paper, Typography, Alert, CircularProgress, Grid } from '@mui/material'
import { LoginForm } from '../../components/auth/LoginForm'

export default function Login() {
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isMobile, isTablet } = useDevice()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const maxWidth = isMobile ? 400 : isTablet ? 500 : 600

  return (
    <Grid>
      <Box width="100%" display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth }}>
          <Typography variant="h5" gutterBottom align="center">
            Login to Your Account
          </Typography>
          {loading && <CircularProgress data-testid="loading" />}
          {error && <Alert severity="error">{error}</Alert>}
          <LoginForm onLoadingChange={setLoading} onError={setError} />
        </Paper>
      </Box>
    </Grid>
  )
}