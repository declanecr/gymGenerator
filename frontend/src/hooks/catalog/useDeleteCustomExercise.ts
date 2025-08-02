import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCustomExercise } from '../../api/exerciseCatalog';

export function useDeleteCustomExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteCustomExercise(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['exercises-catalog'] });
    },
  });
}