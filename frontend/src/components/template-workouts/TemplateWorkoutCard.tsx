import React from 'react';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { TemplateWorkout } from '../../api/templateWorkouts';

export default function TemplateWorkoutCard({ templateWorkout }: { templateWorkout: TemplateWorkout }) {
  return (
    <Card>
      <CardActionArea component={Link} to={`/template-workouts/${templateWorkout.id}`}>
        <CardContent>
          <Typography variant="h6">{templateWorkout.name}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}