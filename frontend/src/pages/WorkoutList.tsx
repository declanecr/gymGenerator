// src/pages/WorkoutList.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { Workout } from '../api/workouts';
import { fetchWorkouts } from '../api/workouts';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';

const WorkoutList: React.FC = () => {
  // Fetch workouts with proper typing for data and error
  const { data: workouts, isLoading, error } = useQuery<Workout[], Error>({
    queryKey: ['workouts'],
    queryFn: fetchWorkouts,
  });

  // Loading state
  if (isLoading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading workouts...
        </Typography>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load workouts.</Alert>
      </Container>
    );
  }

  // Success state: render list or fallback message
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Workouts
      </Typography>
      {workouts && workouts.length > 0 ? (
        <List>
          {workouts.map((workout) => (
            <ListItem key={workout.id} disablePadding>
              <ListItemButton component={Link} to={`/workouts/${workout.id}`}>
                <ListItemText
                  primary={`Workout ${workout.id}`}
                  secondary={new Date(workout.createdAt).toLocaleDateString()}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No workouts found.</Typography>
      )}
    </Container>
  );
};

export default WorkoutList;
