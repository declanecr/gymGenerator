// src/hooks/useFilteredExercises.ts
import { useMemo } from "react"
import { useExercisesCatalog } from "./useExercisesCatalog";
import type { ExerciseCatalogItem } from "../../api/exerciseCatalog";

// reusable hook for filter exercises

export function useFilteredExercises(
  query: string,
  showCustom = true
) {
  // 1) grab the full list
  const {
    data: exercises = [],
    isLoading,
    error,
  } = useExercisesCatalog(showCustom);

  // 2) memoize your filter so it only re-runs when inputs change
  const filtered = useMemo<ExerciseCatalogItem[]>(() => {   // `useMemo` avoids unnecessary recomputing of `.filter`
    const q = query.trim().toLowerCase();
    if (!q) return exercises;
    return exercises.filter((ex) =>
      ex.name.toLowerCase().includes(q)
    );
  }, [exercises, query]);

  return { filtered, isLoading, error };
}
