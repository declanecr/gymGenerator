import api from './axios'

export interface Workout {
  id: string
  createdAt: string
  updatedAt: string
  workoutTemplateId?: string | null
}

export async function fetchWorkout(id: string): Promise<Workout> {
  const res = await api.get<Workout>(`/workouts/${id}`)
  return res.data
}

export async function listWorkouts(): Promise<Workout[]> {
  const res = await api.get<Workout[]>('/workouts')
  return res.data
}