import React, {useEffect, useState } from 'react'
import { Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { useNavigate,Link } from 'react-router-dom'
import { fetchWorkouts, Workout } from '../api/workouts'
import { listTemplateWorkouts, TemplateWorkout } from '../api/templateWorkouts'
import StartWorkoutModal from '../components/workouts/StartWorkoutModal'

export default function Dashboard() {
  const { logout, token } = useAuth()
  const navigate = useNavigate()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [templates, setTemplates] = useState<TemplateWorkout[]>([])

  const [showModal, setShowModal] =useState(false);

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
      <Box>
        {token}
      </Box>
      <button onClick={() => setShowModal(true)}>Start New Workout</button>
      {showModal && (
        <StartWorkoutModal
          open={showModal}
          onClose={() => setShowModal(false)}
        />
      )}

      
      <Typography variant="h5" mt={4} mb={1}>Your Workouts</Typography>
      <List>
        {workouts.map((w) => (
          <ListItem key={w.id} disablePadding>
            <ListItemText>
              <Link to={`/workouts/${w.id}`}>Workout {w.name}</Link>
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
      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  )
}
