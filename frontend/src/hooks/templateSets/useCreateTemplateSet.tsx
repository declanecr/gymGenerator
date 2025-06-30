import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTemplateSet, CreateTemplateSetDto } from '../../api/templateWorkouts';

export function useCreateTemplateSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, exerciseId, dto }: { workoutId: string; exerciseId: string; dto: CreateTemplateSetDto }) =>
      createTemplateSet(dto, workoutId, exerciseId),
    onSuccess: (_, { workoutId, exerciseId }) => {
      qc.invalidateQueries({ queryKey: ['template-sets', workoutId, exerciseId] });
    },
  });
}