import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCustomExercise, UpdateCustomExerciseDto } from '../../api/exerciseCatalog';

export function useUpdateCustomExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateCustomExerciseDto }) => updateCustomExercise(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['exercises-catalog'] });
    },
  });
}