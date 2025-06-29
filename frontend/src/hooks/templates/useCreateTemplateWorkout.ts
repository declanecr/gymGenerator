import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTemplateWorkout, CreateTemplateWorkoutDto } from "../../api/templateWorkouts";

export function useCreateTemplateWorkout() {
    const qc=useQueryClient();

    return useMutation({
        mutationFn:({dto}: {dto: CreateTemplateWorkoutDto})=>
            createTemplateWorkout(dto),
        onSuccess: ()=>{
            qc.invalidateQueries({queryKey: ['template-workouts']});
        }
    });
}