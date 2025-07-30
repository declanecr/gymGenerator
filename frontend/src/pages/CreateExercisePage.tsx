import React from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCustomExercise } from '../hooks/catalog/useCreateCustomExercise';
import CreateExercisePageLayout from '../layouts/CreateExercisePageLayout';

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  primaryMuscle: z.string().min(1, { message: 'Muscle is required' }),
  equipment: z.string().optional(),
});

type FormInputs = z.infer<typeof schema>;

export default function CreateExercisePage() {
  const navigate = useNavigate();
  const createExercise = useCreateCustomExercise();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormInputs) {
    try {
      await createExercise.mutateAsync(data);
      navigate('/dashboard');
    } catch {
      // error handled via isError
    }
  }

  return (
    <CreateExercisePageLayout>
      <Box p={4} maxWidth={400}>
        <Typography variant="h4" gutterBottom>Create Exercise</Typography>
        {createExercise.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to create exercise
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          flexDirection="column"
          gap={2}
        >
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
          <Button type="submit" variant="contained" disabled={createExercise.isPending}>
            {createExercise.isPending ? 'Saving…' : 'Create'}
          </Button>
        </Box>
        <Box mt={2}>
          <Link to="/dashboard">Back to Dashboard</Link>
        </Box>
      </Box>
    </CreateExercisePageLayout>
  );
}