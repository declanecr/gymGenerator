import { useQuery } from '@tanstack/react-query';
import { fetchTemplateExercises } from '../../api/templateWorkouts';

export function useTemplateExercises(workoutId: string) {
  return useQuery({
    queryKey: ['template-exercises', workoutId],
    queryFn: () => fetchTemplateExercises(workoutId),
  });
}