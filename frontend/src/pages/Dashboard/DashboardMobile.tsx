import React from 'react'
import { Typography, Box, Button, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Link } from 'react-router-dom'
import StartWorkoutModal from '../../components/workouts/StartWorkoutModal'
import StartTemplateModal from '../../components/template-workouts/StartTemplateModal'
import WorkoutCard from '../../components/workouts/WorkoutCard'
import TemplateWorkoutCard from '../../components/template-workouts/TemplateWorkoutCard'
import { Workout } from '../../api/workouts'
import { TemplateWorkout } from '../../api/templateWorkouts'
import DefaultLayout from '../../layouts/DefaultLayout'

interface Props {
  workouts: Workout[]
  templates: TemplateWorkout[]
  me: { role: string } | undefined
  showWorkoutModal: boolean
  setShowWorkoutModal: React.Dispatch<React.SetStateAction<boolean>>
  showTemplateModal: boolean
  setShowTemplateModal: React.Dispatch<React.SetStateAction<boolean>>
  handleLogout: () => void
}

export default function DashboardMobile({
  workouts,
  templates,
  me,
  showWorkoutModal,
  setShowWorkoutModal,
  showTemplateModal,
  setShowTemplateModal,
  handleLogout,
}: Props) {
  return (
    <DefaultLayout>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid size={{ xs: 12 }}>
          <StartWorkoutModal open={showWorkoutModal} onClose={() => setShowWorkoutModal(false)} />
        </Grid>
      </Grid>
      <Grid size={{ xs: 12 }}>
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
              <StartWorkoutModal open={showWorkoutModal} onClose={() => setShowWorkoutModal(false)} />
            </Box>
            <Grid container spacing={2}>
              {workouts.map(w => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={w.id}>
                  <WorkoutCard workout={w} />
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
              <StartTemplateModal open={showTemplateModal} onClose={() => setShowTemplateModal(false)} />
            </Box>
            <Box sx={{ position: 'relative' }}>
              <Grid container spacing={2}>
                {templates.map(t => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={t.id}>
                    <TemplateWorkoutCard templateWorkout={t} />
                  </Grid>
                ))}
              </Grid>
              <StartTemplateModal open={showTemplateModal} onClose={() => setShowTemplateModal(false)} />
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
    </DefaultLayout>
  )
}