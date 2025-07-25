import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGlobalTemplateWorkout, CreateTemplateWorkoutDto } from "../../api/templateWorkouts";

export function useCreateGlobalTemplateWorkout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dto }: { dto: CreateTemplateWorkoutDto }) =>
      createGlobalTemplateWorkout(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['template-workouts'] });
    },
  });
}