import React from 'react';
import { CardContent, Typography, Box } from '@mui/material';

export interface WorkoutCardContentProps {
  title: string;
  date: string | null;
  exercises: { name: string; setCount?: number }[];
}

export default function WorkoutCardContent({ title, date, exercises }: WorkoutCardContentProps) {
  const formatted = date
  ? new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  : null;



  const exText = exercises
    .map(ex => `${ex.name}${ex.setCount ? ` x${ex.setCount}` : ''}`)
    .join(', ');
  
  
  //console.log("WorkoutCardContent exercises:", exercises);

  return (
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">{title}</Typography>
        {formatted && (<Typography variant="body2" color="text.secondary">
          {formatted}
        </Typography>)}
      </Box>
      {exercises.length > 0 && (
        <Typography variant="body2" color="text.secondary">
          {exText}
        </Typography>
      )}
    </CardContent>
  );
}