import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useGetWorkout } from '../../hooks/workouts/useGetWorkout'
import { WorkoutFormValues, ExerciseFormValues, SetFormValues } from '../../components/forms/types'
import { useCreateExercise } from '../../hooks/workoutExercises/useCreateExercise'
import { useCreateSet } from '../../hooks/workoutSets/useCreateSet'
import { WorkoutExercise } from '../../api/exercises'
import { WorkoutSet } from '../../api/sets'
import { fetchWorkoutSets } from '../../api/sets'
import { useWorkoutExercises } from '../../hooks/workoutExercises/useExercises'
import { useQueries } from '@tanstack/react-query'

import { useUpdateExercise } from '../../hooks/workoutExercises/useUpdateExercise'
import { useUpdateSet } from '../../hooks/workoutSets/useUpdateSet'
import { useDeleteExercise } from '../../hooks/workoutExercises/useDeleteExercise'
import { useDeleteSet } from '../../hooks/workoutSets/useDeleteSet'
import { useDeleteWorkout } from '../../hooks/workouts/useDeleteWorkout'
import { Grid, Typography, Button } from '@mui/material'
import { WorkoutContainer } from '../../components/workouts/WorkoutContainer'
import DefaultLayout from '../../layouts/DefaultLayout'

function toSetFormValues(apiSet: WorkoutSet): SetFormValues {
  return {
    id: apiSet.id,
    reps: apiSet.reps,
    weight: apiSet.weight,
    position: apiSet.position,
  }
}

export default function WorkoutPage() {
  const { id } = useParams()
  const workoutId = id as string
  const navigate= useNavigate()
  const { mutateAsync: createExercise } = useCreateExercise()
  const { mutateAsync: updateExercise } = useUpdateExercise()
  const { mutateAsync: deleteExercise } = useDeleteExercise()
  const { mutateAsync: createSet } = useCreateSet()
  const { mutateAsync: updateSet } = useUpdateSet()
  const { mutateAsync: deleteSet } = useDeleteSet()
  const { mutateAsync: deleteWorkout } = useDeleteWorkout()

  const {
    data: workout,
    isLoading: isWorkoutLoading,
    error: workoutError
  } = useGetWorkout(workoutId)

  const {
    data: workoutExercises,
    isLoading: isExercisesLoading,
    error: exercisesError,
  } = useWorkoutExercises(workoutId)

  const setsQueries = useQueries({
    queries:
      workoutExercises?.map((ex: WorkoutExercise) => ({
        queryKey: ['sets', workoutId, ex.workoutExerciseId],
        queryFn: () => fetchWorkoutSets(workoutId, ex.workoutExerciseId),
      })) || [],
  })

  const isSetsLoading = setsQueries.some(q => q.isLoading)
  const hasSetsError = setsQueries.some(q => q.error)

  if (isWorkoutLoading || isExercisesLoading || isSetsLoading) {
    return (
      <Grid container justifyContent="center" p={4}>
        <Typography>Loading…</Typography>
      </Grid>
    )
  }
  if (workoutError || exercisesError || hasSetsError || !workout) {
    return (
      <Grid container justifyContent="center" p={4}>
        <Typography>Error loading workout</Typography>
      </Grid>
    )
  }

  const initialExercises: ExerciseFormValues[] =
    (workoutExercises || []).map((ex:WorkoutExercise, idx: number) => ({
      id: ex.workoutExerciseId,
      exerciseId: ex.exerciseId,
      position: ex.position,
      sets:
        ((setsQueries[idx].data as WorkoutSet[]) || [])
          .map(toSetFormValues),
    }))

  const initialValues: WorkoutFormValues = {
    id: workout.id,
    name: workout.name,
    notes: workout.notes ?? '',
    exercises: initialExercises,
  }

  async function handleSubmit(data: WorkoutFormValues) {
    const originalIds = initialValues.exercises.map(e => e.id).filter(Boolean) as string[]
    const currentIds = data.exercises.map(e => e.id).filter(Boolean) as string[]
    await Promise.all(
      originalIds
        .filter(id => !currentIds.includes(id))
        .map(id => deleteExercise({ id, workoutId }))
    )

    for (const ex of data.exercises) {
      const dtoEx = { exerciseId: ex.exerciseId, position: ex.position }
      let exId = ex.id
      if (exId) {
        await updateExercise({ workoutId, id: exId, dto: dtoEx })
      } else {
        const newEx = await createExercise({ workoutId, dto: dtoEx })
        exId = newEx.workoutExerciseId
      }

      const origSets =
        (initialValues.exercises.find(e => e.id === ex.id)?.sets || [])
          .map(s => s.id)
          .filter(Boolean) as string[]
      const curSets = (ex.sets || [])
        .map(s => s.id)
        .filter(Boolean) as string[]
      await Promise.all(
        origSets
          .filter(id => !curSets.includes(id))
          .map(setId => deleteSet({ workoutId, exerciseId: exId!, setId }))
      )

      for (const s of ex.sets || []) {
        const dtoSet = { reps: s.reps, weight: s.weight, position: s.position }
        if (s.id) {
          await updateSet({ workoutId, exerciseId: exId!, setId: s.id, dto: dtoSet })
        } else {
          await createSet({ workoutId, exerciseId: exId!, dto: dtoSet })
        }
      }
    }
    navigate('/dashboard')
  }

  async function handleDelete() {
    await deleteWorkout({ id: workoutId })
    navigate('/dashboard')
  }

  return (
    <DefaultLayout>
      <Grid container direction="column" spacing={2} p={2}>
        <Grid>
          <Link to="/dashboard">back to dashboard</Link>
        </Grid>
        <Grid>
          <Typography variant="h4" component="h1">Workout Details</Typography>
        </Grid>
        <Grid>
          <Button onClick={handleDelete} color="error" variant="outlined">
            Delete Workout
          </Button>
        </Grid>
        <Grid>
          <WorkoutContainer initialValues={initialValues} onSubmit={handleSubmit} />
        </Grid>
      </Grid>
    </DefaultLayout>
  )
}