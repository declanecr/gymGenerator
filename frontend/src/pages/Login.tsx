import React, { useState } from 'react'
import { Box, Paper, Typography, Alert, CircularProgress, Grid } from '@mui/material'
import { LoginForm } from '../components/auth/LoginForm'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

export default function Login() {
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <Grid>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
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