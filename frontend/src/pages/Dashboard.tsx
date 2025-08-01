import React, {useEffect, useState } from 'react'
import { Typography, Box, Button, CircularProgress, Alert, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { useNavigate,Link } from 'react-router-dom'
import { fetchWorkouts, Workout } from '../api/workouts'
import { fetchTemplateWorkouts, TemplateWorkout } from '../api/templateWorkouts'
import StartWorkoutModal from '../components/workouts/StartWorkoutModal'
import StartTemplateModal from '../components/template-workouts/StartTemplateModal'
import { useGetMe } from '../hooks/users/useGetMe'
import DashboardLayout from '../layouts/DashboardLayout'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WorkoutCard from '../components/workouts/WorkoutCard'
import TemplateWorkoutCard from '../components/template-workouts/TemplateWorkoutCard'

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
      <Grid container spacing={2} sx={{ p: 2}}>
        <Grid size={{xs:12}}>
          <StartWorkoutModal
            open={showWorkoutModal}
            onClose={() => setShowWorkoutModal(false)}
          />
        </Grid>
      </Grid>
      <Grid size={{ xs:12 }}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='h5'>Workouts</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box mb={2}>
                <Button
                  variant='contained'
                  fullWidth
                  onClick={() => setShowWorkoutModal(true)}
                >
                  Start New Workout
                </Button>
                <StartWorkoutModal
                  open={showWorkoutModal}
                  onClose={() => setShowWorkoutModal(false)}
                />
              </Box>
              <Grid container spacing={2}>
                {workouts.map(w => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={w.id}>
                    <WorkoutCard workout={w}/>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid size={{ xs: 12 }}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">Template Workouts</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box mb={2}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setShowTemplateModal(true)}
                >
                  Create Template
                </Button>
                <StartTemplateModal
                  open={showTemplateModal}
                  onClose={() => setShowTemplateModal(false)}
                />
              </Box>
              <Box sx={{ position: 'relative' }}>
                <Grid container spacing={2}>
                  {templates.map(t => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={t.id}>
                      <TemplateWorkoutCard templateWorkout={t}/>
                    </Grid>
                  ))}
                </Grid>
                <StartTemplateModal
                  open={showTemplateModal}
                  onClose={() => setShowTemplateModal(false)}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>
        {me?.role === 'ADMIN' && (
          <Grid size={{ xs: 12 }}>
            <Box mb={2}>
              <Link to="/admin">Go to Admin Page</Link>
            </Box>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Grid>
    </DashboardLayout>
  )
}
