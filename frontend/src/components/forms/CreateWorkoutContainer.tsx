// src/components/forms/CreateWorkoutContainer.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateWorkoutInput, createWorkoutSchema } from '../../schemas/createWorkoutSchema';
import { useQuery, useMutation } from '@tanstack/react-query';
import { listTemplateWorkouts, TemplateWorkout } from '../../api/templateWorkouts';
import { createWorkout, Workout } from '../../api/workouts';
import { useNavigate } from 'react-router-dom';
import CreateWorkoutForm from './CreateWorkoutForm';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  AlertColor,
} from '@mui/material';

const CreateWorkoutContainer: React.FC = () => {
  const navigate = useNavigate();
  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Fetch available template workouts using object syntax
  const {
    data: templates = [] as TemplateWorkout[],
    isLoading: isLoadingTemplates,
    error: templateError,
  } = useQuery<TemplateWorkout[], Error>({
    queryKey: ['templateWorkouts'],
    queryFn: listTemplateWorkouts,
  });

  // React Hook Form setup with Zod resolver
  const form = useForm<CreateWorkoutInput>({
    resolver: zodResolver(createWorkoutSchema),
    defaultValues: { workoutTemplateId: '' },
  });

  // Mutation for creating a workout using object syntax with generics
  const mutation = useMutation<Workout, Error, CreateWorkoutInput>({
    mutationFn: createWorkout,
    onSuccess: (data) => {
      setSnackbarMessage('Workout created!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate(`/workouts/${data.id}`);
    },
    onError: () => {
      setSnackbarMessage('Failed to create workout');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    },
  });

  // Handler for form submission
  const handleCreate = (values: CreateWorkoutInput) => {
    mutation.mutate(values);
  };

  if (isLoadingTemplates) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          Loading templates...
        </Typography>
      </Container>
    );
  }

  if (templateError) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load templates.</Alert>
      </Container>
    );
  }

  return (
    <>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Workout
        </Typography>
        <CreateWorkoutForm
          templates={templates}
          isLoadingTemplates={isLoadingTemplates}
          form={form}
          onSubmit={handleCreate}
        />
      </Container>

      {/* MUI Snackbar for success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateWorkoutContainer;
