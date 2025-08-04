import React from 'react'
import { Box, Paper, Typography, Alert, CircularProgress, Grid } from '@mui/material'
import { LoginForm } from '../../components/auth/LoginForm'

interface LoginViewProps {
  loading: boolean
  error: string | null
  onLoadingChange: (loading: boolean) => void
  onError: (error: string | null) => void
}

export default function LoginTablet({ loading, error, onLoadingChange, onError }: LoginViewProps) {
  return (
    <Grid>
      <Box width='100%' display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
          <Typography variant="h5" gutterBottom align="center">
            Login to Your Account
          </Typography>
          {loading && <CircularProgress data-testid="loading" />}
          {error && <Alert severity="error">{error}</Alert>}
          <LoginForm onLoadingChange={onLoadingChange} onError={onError} />
        </Paper>
      </Box>
    </Grid>
  )
}