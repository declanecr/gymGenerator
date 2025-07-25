import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTemplateExercise } from '../../api/templateWorkouts';

export function useDeleteTemplateExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, id }: { workoutId: string; id: string }) =>
      deleteTemplateExercise(workoutId, id),
    onSuccess: (_, { workoutId }) => {
      qc.invalidateQueries({ queryKey: ['template-exercises', workoutId] });
    },
  });
}