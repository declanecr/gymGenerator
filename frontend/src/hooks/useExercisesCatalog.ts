import { useQuery } from "@tanstack/react-query";
import { fetchExerciseCatalog, ExerciseCatalogItem } from "../api/exerciseCatalog";

export function useExercisesCatalog(showCustom = true) {
    return useQuery<ExerciseCatalogItem[], Error >({    //adding error here tells TypeScript: "if this query fails, error will be an Error (not unknown)"
        queryKey: ['exercises-catalog', showCustom],
        queryFn: ()=>fetchExerciseCatalog(showCustom),
        placeholderData: [],          // ← ensures `data` is never undefined (prevents need for guard against undefined)
    });
}