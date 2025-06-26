import { createWorkoutSet, CreateWorkoutSetDto } from "../../api/sets";
import { useInvalidateMutation } from "../useInvalidateMutation";

export function useCreateSet() {
    return useInvalidateMutation(
    ({ workoutId, exerciseId, dto }: { workoutId: string; exerciseId: string; dto: CreateWorkoutSetDto }) =>
      createWorkoutSet(dto, workoutId, exerciseId),
    ({ workoutId, exerciseId }) => ['sets', workoutId, exerciseId]
  );
}