import { useQuery } from "@tanstack/react-query";
import { fetchAllWorkouts } from "../../api/workouts";

//fetches all workouts from '/workouts/admin
export function useAllWorkouts() {
  return useQuery({
    queryKey: ['all-workouts'],
    queryFn: fetchAllWorkouts,
  });
}