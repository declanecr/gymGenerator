import React, {useEffect, useState } from 'react'
import { Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { useNavigate,Link } from 'react-router-dom'
import { fetchWorkouts, Workout } from '../api/workouts'
import { listTemplateWorkouts, TemplateWorkout } from '../api/templateWorkouts'

export default function Dashboard() {
  const { logout, token } = useAuth()
  const navigate = useNavigate()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [templates, setTemplates] = useState<TemplateWorkout[]>([])

  const handleLogout = () => {
    logout()    // clear token + state
    navigate('/login')   //redirect immediately
  }

  useEffect(() => {
    fetchWorkouts()
      .then(setWorkouts)
      .catch((err) => console.error('Failed to load workouts', err))
    listTemplateWorkouts()
      .then(setTemplates)
      .catch((err) => console.error('Failed to load templates', err))
  }, [])

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
        color="text.primary"
        fontFamily="monospace"
        fontSize="0.9rem"
        mb={3}
      >
        {token}
      </Box>

      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
      <Typography variant="h5" mt={4} mb={1}>Your Workouts</Typography>
      <List>
        {workouts.map((w) => (
          <ListItem key={w.id} disablePadding>
            <ListItemText>
              <Link to={`/workouts/${w.id}`}>Workout {w.id}</Link>
            </ListItemText>
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" mt={4} mb={1}>Template Workouts</Typography>
      <List>
        {templates.map((t) => (
          <ListItem key={t.id} disablePadding>
            <ListItemText>
              <Link to={`/template-workouts/${t.id}`}>{t.name}</Link>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
