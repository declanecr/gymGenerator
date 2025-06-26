//import { useQueryClient } from "@tanstack/react-query";
import { deleteWorkoutSet } from "../../api/sets";
import { useInvalidateMutation } from "../useInvalidateMutation";

export function useDeleteSet() {
  // const qc = useQueryClient();
  return useInvalidateMutation(
    ({ setId, exerciseId, workoutId }: { setId: string; exerciseId: string; workoutId: string }) =>
      deleteWorkoutSet(setId, exerciseId, workoutId),
    ({ workoutId, exerciseId, setId }) => [
      ['sets', workoutId, exerciseId],
      ['sets', setId, workoutId, exerciseId],
    ],
    {
      onSuccess: () => {},
    }
  );
}