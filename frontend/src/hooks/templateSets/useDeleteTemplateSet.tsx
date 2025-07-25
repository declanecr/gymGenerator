import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTemplateSet } from '../../api/templateWorkouts';

export function useDeleteTemplateSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, exerciseId, setId }: { workoutId: string; exerciseId: string; setId: string }) =>
      deleteTemplateSet(setId, workoutId, exerciseId),
    onSuccess: (_, { workoutId, exerciseId }) => {
      qc.invalidateQueries({ queryKey: ['template-sets', workoutId, exerciseId] });
    },
  });
}