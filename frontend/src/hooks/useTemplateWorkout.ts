import { useQuery } from "@tanstack/react-query";
import { fetchTemplateWorkouts } from "../api/templateWorkouts";

export function useWorkout() {
    return useQuery({
        queryKey: ['template-workouts'],
        queryFn: ()=>fetchTemplateWorkouts(),
    })
}