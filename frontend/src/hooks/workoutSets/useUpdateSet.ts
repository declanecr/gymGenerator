import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  UpdateWorkoutSetDto, updateWorkoutSet } from "../../api/sets";

export function useUpdateSet() {
    const qc=useQueryClient();

    return useMutation({
        mutationFn:({setId, workoutId, exerciseId, dto}: {setId: string; workoutId: string; exerciseId: string; dto: UpdateWorkoutSetDto} )=>
            updateWorkoutSet(setId, dto, workoutId, exerciseId),
        onSuccess: (updatedSet, {exerciseId, workoutId})=>{
            qc.invalidateQueries({queryKey: ['sets', workoutId, exerciseId]});
        }

    });
}