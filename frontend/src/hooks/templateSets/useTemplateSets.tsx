import { useQuery } from '@tanstack/react-query';
import { fetchTemplateSets } from '../../api/templateWorkouts';

export function useTemplateSets(workoutId: string, exerciseId: string) {
  return useQuery({
    queryKey: ['template-sets', workoutId, exerciseId],
    queryFn: () => fetchTemplateSets(workoutId, exerciseId),
  });
}