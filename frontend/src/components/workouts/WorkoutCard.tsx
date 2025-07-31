import React from 'react';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Workout } from '../../api/workouts';

export default function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Card>
      <CardActionArea component={Link} to={`/workouts/${workout.id}`}>
        <CardContent>
          <Typography variant="h6">{workout.name}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
