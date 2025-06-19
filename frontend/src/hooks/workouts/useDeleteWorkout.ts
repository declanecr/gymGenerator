import {useMutation, useQueryClient} from '@tanstack/react-query';
import { deleteWorkout } from '../../api/workouts';

export function useDeleteWorkout() {
    const qc= useQueryClient();

    return useMutation({
        mutationFn: ({id}:{id:string}) => deleteWorkout(id),
        onSuccess: (_deleted, { id })=>{
            // 1) Refresh the workouts list
            qc.invalidateQueries({ queryKey: ['workouts'] });
            // 2) Optionally remove any detail page for that workout
            qc.removeQueries({ queryKey: ['workouts', id] });
        }

    })
}