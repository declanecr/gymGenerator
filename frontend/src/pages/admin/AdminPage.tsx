import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAllWorkouts } from '../../hooks/workouts/useAllWorkouts'
import { Box, CircularProgress, Alert, List, ListItem, ListItemText, Grid, Button, Typography } from '@mui/material'
import { useGetMe } from '../../hooks/users/useGetMe'
import StartGlobalTemplateModal from '../../components/template-workouts/StartGlobalTemplateModal'
import DefaultLayout from '../../layouts/DefaultLayout'

export default function AdminPage() {
  const { data: me, isLoading: loadingMe } = useGetMe()
  const { data: workouts, isLoading, error } = useAllWorkouts()
  const [showTemplateModal, setShowTemplateModal] = useState(false)

  if (loadingMe || isLoading) {
    return (
      <Box p={4}>
        <CircularProgress data-testid="loading" />
      </Box>
    )
  }

  if (me?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">Failed to load workouts</Alert>
      </Box>
    )
  }

  return (
    <DefaultLayout>
      <Box p={4}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid>
            <Link to="/dashboard">Back to dashboard</Link>
          </Grid>
          <Grid>
            <Button variant="contained" onClick={() => setShowTemplateModal(true)}>
              Create Global Template
            </Button>
          </Grid>
          <Grid>
            <Link to="/create-exercise">Create Default Exercise</Link>
          </Grid>
        </Grid>
        {showTemplateModal && (
          <StartGlobalTemplateModal open={showTemplateModal} onClose={() => setShowTemplateModal(false)} />
        )}
        <Typography variant="h5" mt={4} mb={1}>
          All Workouts
        </Typography>
        <List>
          {workouts?.map(w => (
            <ListItem key={w.id} disablePadding>
              <ListItemText primary={w.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </DefaultLayout>
  )
}