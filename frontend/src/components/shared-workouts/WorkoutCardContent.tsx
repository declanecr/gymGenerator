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

  return (
    <CardContent sx={{ py: 1.5 }}>

      {/* Header: smaller title left, date/time right */}
      <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={0.5}>
        <Typography variant="subtitle1" fontWeight={600} noWrap>
          {title}
        </Typography>
        {formatted && (
          <Typography variant="caption" color="text.secondary" ml={2}>
            {formatted}
          </Typography>
        )}
      </Box>
      {/* Exercises list: name left, set count right */}
      {exercises.length > 0 && (
        <Box display="flex" flexDirection="column" gap={0.5}>
          {exercises.map((ex, i) => (
            <Box key={`${ex.name}-${i}`} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.primary" noWrap>
                {ex.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                x{typeof ex.setCount === 'number' ? ex.setCount : 0}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </CardContent>
  );
}