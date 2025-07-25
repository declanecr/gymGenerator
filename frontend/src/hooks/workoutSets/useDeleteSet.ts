import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkoutSet } from "../../api/sets";

export function useDeleteSet() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({setId, exerciseId, workoutId}:{setId: string; exerciseId: string; workoutId:string;}) => 
            deleteWorkoutSet(setId, exerciseId, workoutId),
        onSuccess: (_deleted, {setId, exerciseId, workoutId} )=>{
            qc.invalidateQueries({ queryKey: ['sets', workoutId, exerciseId]});
            qc.invalidateQueries({ queryKey: ['sets', setId, workoutId, exerciseId]})
        }
    })
}