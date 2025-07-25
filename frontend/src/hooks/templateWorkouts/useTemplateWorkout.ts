import { useQuery } from "@tanstack/react-query";
import { fetchTemplateWorkouts } from "../../api/templateWorkouts";

export function useTemplateWorkouts() {
    return useQuery({
        queryKey: ['template-workouts'],
        queryFn: ()=>fetchTemplateWorkouts(),
    })
}