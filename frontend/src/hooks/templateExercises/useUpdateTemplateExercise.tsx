import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTemplateExercise, UpdateTemplateExerciseDto } from '../../api/templateWorkouts';

export function useUpdateTemplateExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, id, dto }: { workoutId: string; id: string; dto: UpdateTemplateExerciseDto }) =>
      updateTemplateExercise(dto, id, workoutId),
    onSuccess: (_, { workoutId }) => {
      qc.invalidateQueries({ queryKey: ['template-exercises', workoutId] });
    },
  });
}