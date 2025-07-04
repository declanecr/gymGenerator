import api from "./axios";
import { WorkoutExercise } from "./exercises";
import { TemplateExercise } from "./templateWorkouts";

export interface ExerciseCatalogItem {
    id: number
    name: string
    description?: string | null
    primaryMuscle: string
    equipment?: string | null
    default: boolean //should default to false
    //userId?: number | null //obtained in backend i believe
    templateExercises: TemplateExercise[]
    workoutExercises: WorkoutExercise[]
}

//Fetch the full list of visible (global + user-specific) exercises
export async function fetchExerciseCatalog(showCustom = true): Promise<ExerciseCatalogItem[]> {
    const res = await api.get<ExerciseCatalogItem[]>(`/exercises-catalog?custom=${showCustom}`);
    return res.data;
}
