import React from 'react';
import { Card, CardActionArea, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { TemplateWorkout } from '../../api/templateWorkouts';
import WorkoutCardContent from '../shared-workouts/WorkoutCardContent';
import { useTemplateExercises } from '../../hooks/templateExercises/useTemplateExercises';

export default function TemplateWorkoutCard({ templateWorkout }: { templateWorkout: TemplateWorkout }) {
  const {data: exercises, isLoading } =useTemplateExercises(String(templateWorkout.id));

  if (isLoading) {
    return <CircularProgress />;
  }
    


  return (
    <Card>
      <CardActionArea component={Link} to={`/template-workouts/${templateWorkout.id}`}>
        <WorkoutCardContent
          title={templateWorkout.name}
          date={null}
          exercises={
            Array.isArray(exercises)
            ? exercises.map(ex => ({
                  name: ex.name ?? `Exercise ${ex.exerciseId}`,
                  //setCount: ex.sets.length ?? 0,
                }))
              : []
          }
        />
      </CardActionArea>
    </Card>
  );
}