import React from 'react'
import { Typography, Box, Button } from '@mui/material'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { logout, token } = useAuth()

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard
      </Typography>

      <Typography variant="body1" mb={2}>
        You are logged in. Your token is:
      </Typography>

      <Box
        p={2}
        bgcolor="#f5f5f5"
        borderRadius="8px"
        fontFamily="monospace"
        fontSize="0.9rem"
        mb={3}
      >
        {token}
      </Box>

      <Button variant="outlined" onClick={logout}>
        Logout
      </Button>
    </Box>
  )
}
