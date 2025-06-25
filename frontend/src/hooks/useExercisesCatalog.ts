import { useQuery } from "@tanstack/react-query";
import { fetchExerciseCatalog, ExerciseCatalogItem } from "../api/exerciseCatalog";

export function useExercisesCatalog(showCustom = true) {
    return useQuery<ExerciseCatalogItem[]>({
        queryKey: ['exercises-catalog', showCustom],
        queryFn: ()=>fetchExerciseCatalog(showCustom),
        staleTime: Infinity,
    });
}