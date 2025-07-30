import api from "./axios";
import { WorkoutExercise } from "./exercises";
import { TemplateExercise } from "./templateWorkouts";

export interface ExerciseCatalogItem {
    exerciseId: number
    name: string
    description?: string | null
    primaryMuscle: string
    equipment?: string | null
    default: boolean //should default to false
    //userId?: number | null //obtained in backend i believe
    templateExercises: TemplateExercise[]
    workoutExercises: WorkoutExercise[]
}

export interface CreateCustomExerciseDto {
    name: string
    primaryMuscle: string
    description?: string | null
    equipment?: string | null
}

//Fetch the full list of visible (global + user-specific) exercises
export async function fetchExerciseCatalog(showCustom = true): Promise<ExerciseCatalogItem[]> {
    const res = await api.get<ExerciseCatalogItem[]>(`/exercises-catalog?custom=${showCustom}`);
    return res.data;
}

export type UpdateCustomExerciseDto = Partial<CreateCustomExerciseDto>

export async function createCustomExercise(dto: CreateCustomExerciseDto): Promise<ExerciseCatalogItem> {
    const res = await api.post<ExerciseCatalogItem>(`/exercises-catalog/custom`, dto)
    return res.data
}

export async function updateCustomExercise(id: number, dto: UpdateCustomExerciseDto): Promise<ExerciseCatalogItem> {
    const res = await api.patch<ExerciseCatalogItem>(`/exercises-catalog/custom/${id}`, dto)
    return res.data
}

export async function deleteCustomExercise(id: number): Promise<void> {
    await api.delete(`/exercises-catalog/custom/${id}`)
}
