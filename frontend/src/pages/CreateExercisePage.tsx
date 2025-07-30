import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import CreateExercisePageLayout from '../layouts/CreateExercisePageLayout';

export default function CreateExercisePage() {
  return (
    <CreateExercisePageLayout>
      <Box p={4}>
        <Typography variant="h4" gutterBottom>Create Exercise</Typography>
        <Typography paragraph>Feature coming soon.</Typography>
        <Link to="/dashboard">Back to Dashboard</Link>
      </Box>
    </CreateExercisePageLayout>
  );
}