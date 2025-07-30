import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCustomExercise, CreateCustomExerciseDto } from '../../api/exerciseCatalog';

export function useCreateCustomExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCustomExerciseDto) => createCustomExercise(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['exercises-catalog'] });
    },
  });
}