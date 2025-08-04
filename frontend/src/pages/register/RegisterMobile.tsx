import React from 'react'
import { Box, Paper, Typography, Alert, CircularProgress, Grid } from '@mui/material'
import { RegisterForm } from '../../components/auth/RegisterForm'

interface RegisterViewProps {
  loading: boolean
  error: string | null
  onLoadingChange: (loading: boolean) => void
  onError: (error: string | null) => void
}

export default function RegisterMobile({ loading, error, onLoadingChange, onError }: RegisterViewProps) {
  return (
    <Grid>
      <Box width='100%' display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h5" gutterBottom align="center">
            Create an Account
          </Typography>
          {loading && <CircularProgress data-testid="loading" />}
          {error && <Alert severity="error">{error}</Alert>}
          <RegisterForm onLoadingChange={onLoadingChange} onError={onError} />
        </Paper>
      </Box>
    </Grid>
  )
}