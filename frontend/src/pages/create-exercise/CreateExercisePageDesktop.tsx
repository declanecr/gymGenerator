import React from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import CreateExercisePageLayout from '../../layouts/CreateExercisePageLayout';
import type { FormInputs } from './CreateExercisePage';

interface Props {
  me: { role: string } | undefined;
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  isError: boolean;
}

export default function CreateExercisePageDesktop({
  me,
  register,
  errors,
  onSubmit,
  isPending,
  isError,
}: Props) {
  return (
    <CreateExercisePageLayout>
      <Box p={4} maxWidth={400}>
        <Typography variant="h4" gutterBottom>
          Create Exercise
        </Typography>
        {isError && (
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
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? 'Saving…' : 'Create'}
          </Button>
        </Box>
        <Box mt={2}>
          <Link to={me?.role === 'ADMIN' ? '/admin' : '/dashboard'}>
            Back to {me?.role === 'ADMIN' ? 'Admin Page' : 'Dashboard'}
          </Link>
        </Box>
      </Box>
    </CreateExercisePageLayout>
  );
}