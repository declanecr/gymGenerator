import {useMutation, useQueryClient} from '@tanstack/react-query';
import { deleteTemplateWorkout } from '../../api/templateWorkouts';

export function useDeleteTemplateWorkout() {
    const qc= useQueryClient();

    return useMutation({
        mutationFn: ({id}:{id:string}) => deleteTemplateWorkout(id),
        onSuccess: (_deleted, { id })=>{
            // 1) Refresh the workouts list
            qc.invalidateQueries({ queryKey: ['template-workouts'] });
            // 2) Optionally remove any detail page for that workout
            qc.removeQueries({ queryKey: ['template-workouts', id] });
        }

    })
}