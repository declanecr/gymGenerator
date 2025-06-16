import api from "./axios";
import { WorkoutSet } from "./sets";

export interface WorkoutExercise {
    id: string
    createdAt: string
    updatedAt: string
    exerciseId: string // the id of the exercise from the exercise catalog used for this
    templateExerciseId?: string | null // the id of the exercise within a template that is optionally used to create this exercise instance
    workoutId: string
    position: number
    workoutSets: WorkoutSet[]
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
    const res = await api.post<WorkoutExercise>(`/workouts/${workoutId}/exercises`, dto)
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