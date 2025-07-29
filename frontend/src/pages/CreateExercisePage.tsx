import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function CreateExercisePage() {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Create Exercise</Typography>
      <Typography paragraph>Feature coming soon.</Typography>
      <Link to="/dashboard">Back to Dashboard</Link>
    </Box>
  );
}