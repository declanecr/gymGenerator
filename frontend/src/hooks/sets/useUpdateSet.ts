//import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  UpdateWorkoutSetDto, updateWorkoutSet } from "../../api/sets";
import { useInvalidateMutation } from "../useInvalidateMutation";

export function useUpdateSet() {
  return useInvalidateMutation(
    ({ setId, workoutId, exerciseId, dto }: { setId: string; workoutId: string; exerciseId: string; dto: UpdateWorkoutSetDto }) =>
      updateWorkoutSet(setId, dto, workoutId, exerciseId),
    ({ workoutId, exerciseId }) => ['sets', workoutId, exerciseId]
  );
}