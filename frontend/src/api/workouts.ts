// frontend\src\api\workouts.ts
import api from './axios'
import { WorkoutExercise } from './exercises'

export interface Workout {
  id: string
  name: string
  notes?: string | null
  createdAt: string
  updatedAt: string
  workoutTemplateId?: string | null
  workoutExercises: WorkoutExercise[]

}


/*********** DTOs ***************/
/** Matches CreateWorkoutDto on the server */
export interface CreateWorkoutDto {
  workoutTemplateId?: string | null;
  name: string
  notes?: string | null
}

export type UpdateWorkoutDto = Partial<CreateWorkoutDto>


export async function getWorkout(id: string): Promise<Workout> {
  const res = await api.get<Workout>(`/workouts/${id}`)
  return res.data
}

export async function fetchWorkouts(): Promise<Workout[]> {
  const res = await api.get<Workout[]>(`/workouts`)
  return res.data
}

export async function createWorkout(dto: CreateWorkoutDto): Promise<Workout> {
  const res = await api.post<Workout>(`/workouts`, dto);
  return res.data;
}

export async function updateWorkout(id: string, dto: UpdateWorkoutDto): Promise<Workout> {
  const res = await api.patch<Workout>(`/workouts/${id}`, dto);
  return res.data
}

export async function deleteWorkout(id:string): Promise<void> {
  await api.delete<Workout>(`/workouts/${id}`);
}