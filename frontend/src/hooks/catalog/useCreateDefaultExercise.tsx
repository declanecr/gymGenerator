import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDefaultExercise, CreateCustomExerciseDto } from '../../api/exerciseCatalog';

export function useCreateDefaultExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCustomExerciseDto) => createDefaultExercise(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['exercises-catalog'] });
    },
  });
}