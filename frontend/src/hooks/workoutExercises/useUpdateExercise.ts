import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorkoutExercise, UpdateWorkoutExerciseDto } from "../../api/exercises";

export function useUpdateExercise() {
    const qc = useQueryClient();


    return useMutation({
        mutationFn: ({workoutId, id, dto }: {workoutId: string; id: string; dto: UpdateWorkoutExerciseDto}) =>
            updateWorkoutExercise(dto, id, workoutId),
        
        onSuccess: (updatedExercise, {workoutId})=> {
            qc.invalidateQueries({queryKey: ['exercises', workoutId]})
        },
        })
}