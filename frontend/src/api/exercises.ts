// frontend\src\api\exercises.ts
import api from "./axios";
import { WorkoutSet } from "./sets";

export interface WorkoutExercise {
    workoutExerciseId: string
    exerciseId: number // the id of the exercise from the exercise catalog used for this
    createdAt: string
    updatedAt: string
    templateExerciseId?: string | null // the id of the exercise within a template that is optionally used to create this exercise instance
    workoutId: string
    position: number
    workoutSets: WorkoutSet[]
}

interface RawWorkoutExercise {
    id: string
    exerciseId: number
    createdAt: string
    updatedAt: string
    templateExerciseId?: string | null
    workoutId: string
    position: number
    workoutSets: WorkoutSet[]
}

export function mapTemplateExercise(raw: RawWorkoutExercise): WorkoutExercise {
    return{
        workoutExerciseId: raw.id,
        exerciseId: raw.exerciseId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        templateExerciseId: raw.templateExerciseId || null,
        workoutId: raw.workoutId,
        position: raw.position,
        workoutSets: raw.workoutSets,
    }
}

/*********** DTOs ***************/
export interface CreateWorkoutExerciseDto {
    exerciseId: number
    templateExerciseId?: string
    position: number
} 

export type UpdateWorkoutExerciseDto = Partial<CreateWorkoutExerciseDto>

/************ API CALLS **************/

export async function createWorkoutExercise(dto: CreateWorkoutExerciseDto, workoutId: string): Promise<WorkoutExercise> {
    const raw = (await api.post<RawWorkoutExercise>(`/workouts/${workoutId}/exercises`, dto)).data
    return mapTemplateExercise(raw);
}

export async function fetchWorkoutExercises(workoutId: string): Promise<WorkoutExercise[]> {
    const res =await api.get<WorkoutExercise[]>(`/workouts/${workoutId}/exercises`)
    return res.data
}

// use workoutId property as the "id" in the API endpoint url
export async function updateWorkoutExercise(dto: UpdateWorkoutExerciseDto, id: string, workoutId: string): Promise<WorkoutExercise> {
    const res = await api.patch<WorkoutExercise>(`/workouts/${workoutId}/exercises/${id}`, dto)
    return res.data
}

export async function deleteWorkoutExercise(workoutId: string, id: string): Promise<void> {
    await api.delete (`/workouts/${workoutId}/exercises/${id}`)
}