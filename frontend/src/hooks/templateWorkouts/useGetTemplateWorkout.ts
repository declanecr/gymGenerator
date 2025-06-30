import { useQuery } from '@tanstack/react-query';
import { getTemplateWorkout } from '../../api/templateWorkouts';

export function useGetTemplateWorkout(id: string) {
  return useQuery({
    queryKey: ['template-workouts', id],
    queryFn: () => getTemplateWorkout(id),
    // optional: staleTime, onSuccess, etc.
  });
}