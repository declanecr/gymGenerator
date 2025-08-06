import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, Button } from '@mui/material';
import { WorkoutContainer } from '../../components/workouts/WorkoutContainer';
import type { WorkoutFormValues } from '../../components/forms/types';
import DefaultLayout from '../../layouts/DefaultLayout';

interface Props {
  initialValues: WorkoutFormValues;
  onSubmit: (data: WorkoutFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function WorkoutPageTablet({ initialValues, onSubmit, onDelete }: Props) {
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
          <Button onClick={onDelete} color="error" variant="outlined">
            Delete Workout
          </Button>
        </Grid>
        <Grid>
          <WorkoutContainer initialValues={initialValues} onSubmit={onSubmit} />
        </Grid>
      </Grid>
    </DefaultLayout>
  );
}