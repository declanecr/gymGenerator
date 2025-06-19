import { useQuery } from "@tanstack/react-query";
import { fetchWorkoutSets } from "../api/sets";

export function useWorkoutSets(workoutId: string, exerciseId: string) {
    return useQuery({
        queryKey: ['sets', workoutId, exerciseId],
        queryFn: () => fetchWorkoutSets(workoutId, exerciseId),
    });
}