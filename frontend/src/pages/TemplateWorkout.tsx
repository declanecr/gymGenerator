import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material'
import { fetchTemplateWorkout, TemplateWorkout } from '../api/templateWorkouts'

export default function TemplateWorkoutPage() {
  const { id } = useParams()
  const [template, setTemplate] = useState<TemplateWorkout | null>(null)

  useEffect(() => {
    if (id) {
      fetchTemplateWorkout(id)
        .then(setTemplate)
        .catch((err) => console.error('Failed to load template', err))
    }
  }, [id])

  if (!template) return <Typography>Loading...</Typography>

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {template.name}
      </Typography>
      {template.notes && <Typography mb={2}>{template.notes}</Typography>}
      <List>
        {template.templateExercises?.map((ex) => (
          <ListItem key={ex.id} alignItems="flex-start">
            <ListItemText
              primary={ex.exercise?.name ?? `Exercise ${ex.exerciseId}`}
              secondary={ex.sets
                .map((s) => `Set ${s.position}: ${s.reps ?? 0} reps @ ${s.weight ?? 0}`)
                .join(', ')}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}