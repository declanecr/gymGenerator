import { useQuery } from "@tanstack/react-query";
import { fetchWorkouts } from "../api/workouts";

export function useWorkoutSets() {
    return useQuery({
        queryKey: ['workouts'],
        queryFn: ()=>fetchWorkouts(),
    })
}