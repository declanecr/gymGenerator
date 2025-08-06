import React, {useRef} from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { TemplateWorkoutContainer, TemplateWorkoutContainerHandle } from '../../components/template-workouts/TemplateWorkoutContainer'
import { WorkoutFormValues, ExerciseFormValues, SetFormValues } from '../../components/forms/types'
import { createTemplateExercise, createTemplateSet, fetchTemplateSets } from '../../api/templateWorkouts'
import { useQueries } from '@tanstack/react-query'
import { TemplateExercise, TemplateSet } from '../../api/templateWorkouts'
import { useTemplateExercises } from '../../hooks/templateExercises/useTemplateExercises'
import { useCreateTemplateExercise } from '../../hooks/templateExercises/useCreateTemplateExercise'
import { useUpdateTemplateExercise } from '../../hooks/templateExercises/useUpdateTemplateExercise'
import { useDeleteTemplateExercise } from '../../hooks/templateExercises/useDeleteTemplateExercise'
import { useCreateTemplateSet } from '../../hooks/templateSets/useCreateTemplateSet'
import { useUpdateTemplateSet } from '../../hooks/templateSets/useUpdateTemplateSet'
import { useDeleteTemplateSet } from '../../hooks/templateSets/useDeleteTemplateSet'
import { useCreateTemplateWorkout } from '../../hooks/templateWorkouts/useCreateTemplateWorkout'
import { useGetTemplateWorkout } from '../../hooks/templateWorkouts/useGetTemplateWorkout'
import { useCreateWorkoutFromTemplate } from '../../hooks/workouts/useCreateFromTemplate'
import { useDeleteTemplateWorkout } from '../../hooks/templateWorkouts/useDeleteTemplateWorkout'
import { useGetMe } from '../../hooks/users/useGetMe'
import { Grid, Typography, Button } from '@mui/material'
import { createWorkout } from '../../api/workouts'
import { createWorkoutExercise } from '../../api/exercises'
import { createWorkoutSet } from '../../api/sets'
import DefaultLayout from '../../layouts/DefaultLayout'

function toSetFormValues(apiSet: TemplateSet): SetFormValues {
  return { id: apiSet.id, reps: apiSet.reps ?? 0, weight: apiSet.weight ?? 0, position: apiSet.position }
}

export default function TemplateWorkoutPage() {
  const { id } = useParams()
  const workoutId = id as string
  const navigate = useNavigate()

  const { mutateAsync: createExercise } = useCreateTemplateExercise()
  const { mutateAsync: updateExercise } = useUpdateTemplateExercise()
  const { mutateAsync: deleteExercise } = useDeleteTemplateExercise()
  const { mutateAsync: createSet } = useCreateTemplateSet()
  const { mutateAsync: updateSet } = useUpdateTemplateSet()
  const { mutateAsync: deleteSet } = useDeleteTemplateSet()
  const { mutateAsync: createFromTemplate } = useCreateWorkoutFromTemplate()
  const { mutateAsync: deleteTemplateWorkout } = useDeleteTemplateWorkout()
  const { mutateAsync: createTemplateWorkout } = useCreateTemplateWorkout()
  const { data: me } = useGetMe()

  const {
    data: workout,
    isLoading: isWorkoutLoading,
    error: workoutError,
  } = useGetTemplateWorkout(workoutId)

  const {
    data: workoutExercises,
    isLoading: isExercisesLoading,
    error: exercisesError,
  } = useTemplateExercises(workoutId)

  const setsQueries = useQueries({
    queries:
      workoutExercises?.map((ex: TemplateExercise) => ({
        queryKey: ['template-sets', workoutId, ex.templateExerciseId],
        queryFn: () => fetchTemplateSets(workoutId, ex.templateExerciseId),
      })) || [],
  })

  const formRef = useRef<TemplateWorkoutContainerHandle>(null)

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
        <Typography>Error loading template</Typography>
      </Grid>
    )
  }

  const initialExercises: ExerciseFormValues[] = (workoutExercises || []).map((ex: TemplateExercise, idx: number) => ({
    id: ex.templateExerciseId,
    exerciseId: Number(ex.exerciseId),
    position: ex.position,
    sets: ((setsQueries[idx].data as TemplateSet[]) || []).map(toSetFormValues),
  }))

  const initialValues: WorkoutFormValues = {
    id: workout.id,
    name: workout.name,
    notes: workout.notes ?? '',
    exercises: initialExercises,
  }

  async function createTemplateFromData(data: WorkoutFormValues) {
    const tpl = await createTemplateWorkout({ dto: { name: data.name, notes: data.notes } })
    for (const ex of data.exercises) {
      const newEx = await createTemplateExercise({ exerciseId: Number(ex.exerciseId), position: ex.position }, tpl.id)
      for (const s of ex.sets || []) {
        await createTemplateSet({ reps: s.reps, weight: s.weight, position: s.position }, tpl.id, newEx.templateExerciseId)
      }
    }
    return tpl
  }
  async function createWorkoutFromData(data: WorkoutFormValues) {
    const w = await createWorkout({
      name: data.name,
      notes: data.notes,
      workoutTemplateId: workoutId,
    })
    for (const ex of data.exercises) {
      const newEx = await createWorkoutExercise(
        {
          exerciseId: ex.exerciseId,
          position: ex.position,
        },
        w.id,
      )
      const exId = newEx.workoutExerciseId
      for (const s of ex.sets || []) {
        await createWorkoutSet(
          { reps: s.reps, weight: s.weight, position: s.position },
          w.id,
          exId,
        )
      }
    }
    return w
  }

  async function handleSave(data: WorkoutFormValues) {
    if (workout!.userId === null && me?.role !== 'ADMIN') {
      await createTemplateFromData(data)
    } else {
      const originalIds = initialValues.exercises.map(e => e.id).filter(Boolean) as string[]
      const currentIds = data.exercises.map(e => e.id).filter(Boolean) as string[]
      await Promise.all(
        originalIds
          .filter(id => !currentIds.includes(id))
          .map(id => deleteExercise({ workoutId, id })),
      )

      for (const ex of data.exercises) {
        const dtoEx = { exerciseId: Number(ex.exerciseId), position: ex.position }
        let exId = ex.id
        if (exId) {
          await updateExercise({ workoutId, id: exId, dto: dtoEx })
        } else {
          const newEx = await createExercise({ workoutId, dto: dtoEx })
          exId = newEx.templateExerciseId
        }
        const origSets = (initialValues.exercises.find(e => e.id === ex.id)?.sets || [])
          .map(s => s.id)
          .filter(Boolean) as string[]
        const curSets = (ex.sets || []).map(s => s.id).filter(Boolean) as string[]
        await Promise.all(
          origSets
            .filter(id => !curSets.includes(id))
            .map(setId => deleteSet({ workoutId, exerciseId: exId!, setId })),
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
    }
  }

  async function handleSubmit(data: WorkoutFormValues) {
    await handleSave(data)
    navigate('/dashboard')
  }

  async function handleDelete() {
    await deleteTemplateWorkout({ id: workoutId })
    navigate('/dashboard')
  }

  async function handleStart() {
    let formData: WorkoutFormValues | undefined
    if (formRef.current) {
      await formRef.current.submit(d => { formData = d })
    }
    if (!formData) return

    const isGlobal = workout!.userId === null && me?.role !== 'ADMIN'

    if (isGlobal && formRef.current?.isDirty) {
      const save = window.confirm('Do you want to save this as a template?')
      if (save) {
        const tpl = await createTemplateFromData(formData)
        const w = await createFromTemplate({ tid: tpl.id })
        navigate(`/workouts/${w.id}`)
      } else {
        const w = await createWorkoutFromData(formData)
        navigate(`/workouts/${w.id}`)
      }
      return
    }

    if (isGlobal) {
      const w = await createFromTemplate({ tid: workoutId })
      navigate(`/workouts/${w.id}`)
      return
    }

    if (formRef.current?.isDirty) {
      await handleSave(formData)
    }
    const workoutRes = await createFromTemplate({ tid: workoutId })
    navigate(`/workouts/${workoutRes.id}`)
  }

  const isAdmin = me?.role === 'ADMIN'
  const canDelete = (workout.userId !== null && workout.userId !== undefined) || isAdmin

  return (
    <DefaultLayout>
      <Grid container direction="column" spacing={2} p={2}>
        <Grid>
          <Link to="/dashboard">back to dashboard</Link>
        </Grid>
        <Grid>
          <Button onClick={handleStart}>Start this workout</Button>
        </Grid>
        <Grid>
          <Typography variant="h4" component="h1">
            Template Workout Details
          </Typography>
        </Grid>
        {canDelete && (
          <Grid>
            <Button onClick={handleDelete} color="error" variant="outlined">
              Delete Template
            </Button>
          </Grid>
        )}
        <Grid>
          <TemplateWorkoutContainer
            ref={formRef}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          />
        </Grid>
      </Grid>
    </DefaultLayout>
  )
}