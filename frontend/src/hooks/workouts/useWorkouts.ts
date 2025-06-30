import { useQuery } from "@tanstack/react-query";
import { fetchWorkouts } from "../api/workouts";

export function useWorkout() {
    return useQuery({
        queryKey: ['workouts'],
        queryFn: ()=>fetchWorkouts(),
    })
}