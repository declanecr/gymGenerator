import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkoutSet, CreateWorkoutSetDto } from "../../api/sets";

export function useCreateSet() {
    const qc=useQueryClient();

    return useMutation({
        mutationFn:({workoutId, exerciseId, dto}: {workoutId: string; exerciseId: string; dto: CreateWorkoutSetDto} )=>
            createWorkoutSet(dto, workoutId, exerciseId),
        onSuccess: (newSet, {exerciseId, workoutId})=>{
            qc.invalidateQueries({queryKey: ['sets', workoutId, exerciseId]});
        }

    });
}