import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateWorkout, UpdateWorkoutDto } from '../../api/workouts';

export function useUpdateWorkout() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateWorkoutDto }) =>
      updateWorkout(id, dto),

    // 'newWorkout' is the updated workout object from the API
    // I THINK -> this means it is an instance of 'WorkoutResponseDto' as defined in workout.controller.ts
    onSuccess: ( newWorkout, { id }) => {
      // marks the "all workouts" List query as stale -> React Query will automatically re-fetch in the background
      // updating the WorkoutList page
      qc.invalidateQueries({queryKey: ['workouts']});
      // marks current workout item as 'stale', forcing it to update the page with the fresh data
      qc.invalidateQueries({queryKey:['workouts', id ]}) //
    },
  });

}