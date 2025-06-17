import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkoutExercise } from "../../api/exercises";

export function useDeleteExercise() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({id, workoutId}:{id:string; workoutId: string;})=> deleteWorkoutExercise(workoutId, id),
        onSuccess: (_deleted, {workoutId})=> {
            qc.invalidateQueries({ queryKey: ['workouts', workoutId] });
        }
    })
}