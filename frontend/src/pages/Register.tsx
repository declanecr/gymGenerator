import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import { RegisterForm } from '../components/auth/RegisterForm'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

export default function Register() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom align="center">
          Create an Account
        </Typography>
        <RegisterForm />
      </Paper>
    </Box>
  )
}
