import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateCustomExercise } from '../../hooks/catalog/useCreateCustomExercise'
import { useGetMe } from '../../hooks/users/useGetMe'
import { useCreateDefaultExercise } from '../../hooks/catalog/useCreateDefaultExercise'
import { Box, Typography, TextField, Button, Alert } from '@mui/material'
import { Link } from 'react-router-dom'
import DefaultLayout from '../../layouts/DefaultLayout'

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  primaryMuscle: z.string().min(1, { message: 'Muscle is required' }),
  equipment: z.string().optional(),
})

export type FormInputs = z.infer<typeof schema>

export default function CreateExercisePage() {
  const navigate = useNavigate()
  const { data: me } = useGetMe()
  const createCustom = useCreateCustomExercise()
  const createDefault = useCreateDefaultExercise()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (data: FormInputs) => {
    try {
      if (me?.role === 'ADMIN') {
        await createDefault.mutateAsync(data)
        navigate('/admin')
      } else {
        await createCustom.mutateAsync(data)
        navigate('/dashboard')
      }
    } catch {
      // error handled via isError
    }
  })

  return (
    <DefaultLayout>
      <Box p={4} maxWidth={400}>
        <Typography variant="h4" gutterBottom>
          Create Exercise
        </Typography>
        {(createCustom.isError || createDefault.isError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to create exercise
          </Alert>
        )}
        <Box component="form" onSubmit={onSubmit} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <TextField
            label="Muscle"
            {...register('primaryMuscle')}
            error={!!errors.primaryMuscle}
            helperText={errors.primaryMuscle?.message}
          />
          <TextField
            label="Equipment"
            {...register('equipment')}
            error={!!errors.equipment}
            helperText={errors.equipment?.message}
          />
          <Button type="submit" variant="contained" disabled={createCustom.isPending || createDefault.isPending}>
            {createCustom.isPending || createDefault.isPending ? 'Saving…' : 'Create'}
          </Button>
        </Box>
        <Box mt={2}>
          <Link to={me?.role === 'ADMIN' ? '/admin' : '/dashboard'}>
            Back to {me?.role === 'ADMIN' ? 'Admin Page' : 'Dashboard'}
          </Link>
        </Box>
      </Box>
    </DefaultLayout>
  )
}