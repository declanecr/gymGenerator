import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { getWorkout, Workout } from '../api/workouts'

export default function WorkoutPage() {
  const { id } = useParams()
  const [workout, setWorkout] = useState<Workout | null>(null)

  useEffect(() => {
    if (id) {
      getWorkout(id)
        .then(setWorkout)
        .catch((err) => console.error('Failed to load workout', err))
    }
  }, [id])

  if (!workout) return <Typography>Loading...</Typography>

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Workout {workout.id}
      </Typography>
      <Typography>
        Created: {new Date(workout.createdAt).toLocaleString()}
      </Typography>
      {workout.workoutTemplateId && (
        <Typography>Template: {workout.workoutTemplateId}</Typography>
      )}
    </Box>
  )
}