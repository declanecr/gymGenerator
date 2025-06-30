import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTemplateSet, UpdateTemplateSetDto } from '../../api/templateWorkouts';

export function useUpdateTemplateSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, exerciseId, setId, dto }: { workoutId: string; exerciseId: string; setId: string; dto: UpdateTemplateSetDto }) =>
      updateTemplateSet(setId, dto, workoutId, exerciseId),
    onSuccess: (_, { workoutId, exerciseId }) => {
      qc.invalidateQueries({ queryKey: ['template-sets', workoutId, exerciseId] });
    },
  });
}