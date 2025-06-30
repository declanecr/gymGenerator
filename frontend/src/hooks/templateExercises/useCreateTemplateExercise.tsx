import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTemplateExercise, CreateTemplateExerciseDto } from '../../api/templateWorkouts';

export function useCreateTemplateExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, dto }: { workoutId: string; dto: CreateTemplateExerciseDto }) =>
      createTemplateExercise(dto, workoutId),
    onSuccess: (_, { workoutId }) => {
      qc.invalidateQueries({ queryKey: ['template-exercises', workoutId] });
    },
  });
}