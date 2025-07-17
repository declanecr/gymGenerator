import { useQuery } from "@tanstack/react-query";
import { fetchAllWorkouts } from "../../api/workouts";

export function useAllWorkouts() {
  return useQuery({
    queryKey: ['all-workouts'],
    queryFn: fetchAllWorkouts,
  });
}