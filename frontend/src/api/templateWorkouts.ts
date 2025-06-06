import api from './axios'

export interface TemplateSet {
  id: string
  reps: number | null
  weight: number | null
  position: number
}

export interface TemplateExercise {
  id: string
  exerciseId: number
  position: number
  sets: TemplateSet[]
  exercise?: { id: number; name: string }
}

export interface TemplateWorkout {
  id: string
  name: string
  notes?: string | null
  createdAt: string
  updatedAt: string
  templateExercises?: TemplateExercise[]
}

export async function fetchTemplateWorkout(id: string): Promise<TemplateWorkout> {
  const res = await api.get<TemplateWorkout>(`/template-workouts/${id}`)
  return res.data
}

export async function listTemplateWorkouts(): Promise<TemplateWorkout[]> {
  const res = await api.get<TemplateWorkout[]>('/template-workouts')
  return res.data
}