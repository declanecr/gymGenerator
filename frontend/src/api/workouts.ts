import api from './axios'

export interface Workout {
  id: string
  createdAt: string
  updatedAt: string
  workoutTemplateId?: string | null
  name: string
  notes?: string | null
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


export interface WorkoutExercise {
  id: string                       // the PK
  exerciseId: string               // FK to an Exercise
  // optional: if you include the related Exercise payload
  exercise?: {
    id: string
    name: string
    // any other fields you’ll render (e.g. muscle group, defaultReps)
  }
  // This can be used for progress comparison
  // any template-level targets you copied over:
  targetReps?: number
  targetWeight?: number
  targetRpe?: number

  // the performed sets for this exercise:
  workoutSets: WorkoutSet[]        // see below
}

// nested sets:
export interface WorkoutSet {
  id: string
  reps: number
  weight: number
  rpe?: number
  // createdAt/updatedAt only if you need timestamps in the UI
}


export async function fetchWorkout(id: string): Promise<Workout> {
  const res = await api.get<Workout>(`/workouts/${id}`)
  return res.data
}

export async function listWorkouts(): Promise<Workout[]> {
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