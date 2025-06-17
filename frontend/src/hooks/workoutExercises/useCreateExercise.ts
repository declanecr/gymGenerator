import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateWorkoutExerciseDto, createWorkoutExercise } from '../../api/exercises';

export function useCreateExercise() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ workoutId, dto }: { workoutId: string; dto: CreateWorkoutExerciseDto }) =>
      createWorkoutExercise(dto, workoutId),
    onSuccess: (newExercise, { workoutId }) => {
      qc.invalidateQueries({ queryKey: ['workouts', workoutId] });
      // Optionally, invalidate or update ['exercises', workoutId] if you have such a query
    },
  });

}