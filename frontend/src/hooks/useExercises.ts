import { useQuery } from "@tanstack/react-query";
import {fetchWorkoutExercises} from '../api/exercises'

export function useWorkoutExercises(workoutId: string) {
    return useQuery({
        queryKey: ['exercises', workoutId],
        queryFn: () => fetchWorkoutExercises(workoutId),
    });
}