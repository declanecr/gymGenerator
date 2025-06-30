import React, {useEffect, useState } from 'react'
import { Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { useNavigate,Link } from 'react-router-dom'
import { fetchWorkouts, Workout } from '../api/workouts'
import { fetchTemplateWorkouts, TemplateWorkout } from '../api/templateWorkouts'
import StartWorkoutModal from '../components/workouts/StartWorkoutModal'
import StartTemplateModal from '../components/template-workouts/StartTemplateModal'

export default function Dashboard() {
  const { logout, token } = useAuth()
  const navigate = useNavigate()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [templates, setTemplates] = useState<TemplateWorkout[]>([])

  const [showWorkoutModal, setShowWorkoutModal] =useState(false);
  const [showTemplateModal,setShowTemplateModal] = useState(false);

  const handleLogout = () => {
    logout()    // clear token + state
    navigate('/login')   //redirect immediately
  }

  useEffect(() => {
    fetchWorkouts()
      .then(setWorkouts)
      .catch((err) => console.error('Failed to load workouts', err))
    fetchTemplateWorkouts()
      .then(setTemplates)
      .catch((err) => console.error('Failed to load templates', err))
  }, [])

  return (
    <Box p={4}>
      <Box>
        {token}
      </Box>
      <button onClick={() => setShowWorkoutModal(true)}>Start New Workout</button>
      {showWorkoutModal && (
        <StartWorkoutModal
          open={showWorkoutModal}
          onClose={() => setShowWorkoutModal(false)}
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

      <button onClick={() => setShowTemplateModal(true)}>Create new Template</button>
      {showTemplateModal && (
        <StartTemplateModal
          open={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
        />
      )}
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
