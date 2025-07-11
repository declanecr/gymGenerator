import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createWorkoutFromTemplate } from "../../api/workouts";

export function useCreateWorkoutFromTemplate() {
     const qc=useQueryClient();
    
        return useMutation({
            mutationFn:({tid}: {tid: string})=>
                createWorkoutFromTemplate(tid),
            onSuccess: ()=>{
                qc.invalidateQueries({queryKey: ['workouts']});
            }
        });
}