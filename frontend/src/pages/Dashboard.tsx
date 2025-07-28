import React, {useEffect, useState } from 'react'
import { Typography, Box, Button, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { useNavigate,Link } from 'react-router-dom'
import { fetchWorkouts, Workout } from '../api/workouts'
import { fetchTemplateWorkouts, TemplateWorkout } from '../api/templateWorkouts'
import StartWorkoutModal from '../components/workouts/StartWorkoutModal'
import StartTemplateModal from '../components/template-workouts/StartTemplateModal'
import { useGetMe } from '../hooks/users/useGetMe'
import DashboardLayout from '../layouts/DashboardLayout'

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const {data:me} =useGetMe()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [templates, setTemplates] = useState<TemplateWorkout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showWorkoutModal, setShowWorkoutModal] =useState(false);
  const [showTemplateModal,setShowTemplateModal] = useState(false);



  




  const handleLogout = () => {
    logout()    // clear token + state
    navigate('/login')   //redirect immediately
  }

  useEffect(() => {
    Promise.all([
      fetchWorkouts().then(setWorkouts),
      fetchTemplateWorkouts().then(setTemplates),
    ])
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Box p={4}>
        <CircularProgress data-testid="loading" />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <DashboardLayout >
      <Box p={4}>
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
        {me?.role === 'ADMIN' && (
          <Box mb={2}>
            <Link to="/admin">Go to Admin Page</Link>
          </Box>
        )}
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </DashboardLayout>
  )
}
