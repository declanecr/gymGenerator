import { useQuery } from '@tanstack/react-query';
import { getWorkout } from '../../api/workouts';

export function useGetWorkout(id: string) {
  return useQuery({
    queryKey: ['workouts', id],
    queryFn: () => getWorkout(id),
    // optional: staleTime, onSuccess, etc.
  });
}