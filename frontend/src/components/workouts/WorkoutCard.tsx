import { Card, CardActionArea, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Workout } from '../../api/workouts';
import WorkoutCardContent from '../shared-workouts/WorkoutCardContent';
import { useWorkoutExercises } from '../../hooks/workoutExercises/useExercises';

export default function WorkoutCard({ workout }: { workout: Workout }) {
  const { data: exercises, isLoading } = useWorkoutExercises(String(workout.id));

  if (isLoading) {
    return <CircularProgress />;
  }
  

  return (
    <Card>
      <CardActionArea component={Link} to={`/workouts/${workout.id}`}>
        <WorkoutCardContent
          title={workout.name}
          date={workout.createdAt}
          exercises={
            Array.isArray(exercises)
              ? exercises.map(ex => ({
                  name: ex.name ?? `Exercise ${ex.exerciseId}`,
                  // setCount: ex.setCount ?? 0,
                }))
              : []
          }
        />
      </CardActionArea>
    </Card>
  );
}