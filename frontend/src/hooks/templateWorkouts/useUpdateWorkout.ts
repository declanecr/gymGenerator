import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateTemplateWorkoutDto, updateTemplateWorkout } from '../../api/templateWorkouts';

export function useUpdateTemplateWorkout() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTemplateWorkoutDto }) =>
      updateTemplateWorkout(id, dto),

    onSuccess: ( newWorkout, { id }) => {
      qc.invalidateQueries({queryKey: ['template-workouts']});
      qc.invalidateQueries({queryKey:['template-workouts', id ]}) //
    },
  });
}