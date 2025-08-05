import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, Button } from '@mui/material';
import { TemplateWorkoutContainer, TemplateWorkoutContainerHandle } from '../../components/template-workouts/TemplateWorkoutContainer';
import TemplateWorkoutPageLayout from '../../layouts/TemplateWorkoutPageLayout';
import type { WorkoutFormValues } from '../../components/forms/types';

interface Props {
  formRef: React.RefObject<TemplateWorkoutContainerHandle | null>;
  initialValues: WorkoutFormValues;
  onSubmit: (data: WorkoutFormValues) => Promise<void>;
  onStart: () => Promise<void>;
  onDelete: () => Promise<void>;
  canDelete: boolean;
}

export default function TemplateWorkoutPageTablet({
  formRef,
  initialValues,
  onSubmit,
  onStart,
  onDelete,
  canDelete,
}: Props) {
  return (
    <TemplateWorkoutPageLayout>
      <Grid container direction="column" spacing={2} p={2}>
        <Grid>
          <Link to="/dashboard">back to dashboard</Link>
        </Grid>
        <Grid>
          <Button onClick={onStart}>Start this workout</Button>
        </Grid>
        <Grid>
          <Typography variant="h4" component="h1">
            Template Workout Details
          </Typography>
        </Grid>
        {canDelete && (
          <Grid>
            <Button onClick={onDelete} color="error" variant="outlined">
              Delete Template
            </Button>
          </Grid>
        )}
        <Grid>
          <TemplateWorkoutContainer
            ref={formRef}
            initialValues={initialValues}
            onSubmit={onSubmit}
          />
        </Grid>
      </Grid>
    </TemplateWorkoutPageLayout>
  );
}