import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkout, CreateWorkoutDto } from "../../api/workouts";

export function useCreateWorkout() {
    const qc=useQueryClient();

    return useMutation({
        mutationFn:({dto}: {dto: CreateWorkoutDto})=>
            createWorkout(dto),
        onSuccess: ()=>{
            qc.invalidateQueries({queryKey: ['workouts']});
        }
    });
}