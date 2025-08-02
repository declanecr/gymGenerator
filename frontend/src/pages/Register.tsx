import React, { useState } from 'react'
import { Box, Paper, Typography, CircularProgress, Alert, Grid } from '@mui/material'
import { RegisterForm } from '../components/auth/RegisterForm'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

export default function Register() {
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <Grid>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h5" gutterBottom align="center">
            Create an Account
          </Typography>
          {loading && <CircularProgress data-testid="loading" />}
          {error && <Alert severity="error">{error}</Alert>}
          <RegisterForm onLoadingChange={setLoading} onError={setError} />
        </Paper>
      </Box>
    </Grid>
  )
}