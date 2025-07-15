import api from './axios'

export interface TemplateSet {
  id: string
  reps: number | null
  weight: number | null
  position: number
}

export interface TemplateExercise {
  templateExerciseId: string
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

/*********** DTOs ***************/
/** Matches CreateWorkoutDto on the server */
export interface CreateTemplateWorkoutDto {
  name: string
  notes?: string | null
}

export type UpdateTemplateWorkoutDto = Partial<CreateTemplateWorkoutDto>


export interface CreateTemplateExerciseDto {
  exerciseId: number
  position: number
}
export type UpdateTemplateExerciseDto =Partial<CreateTemplateExerciseDto>


export interface CreateTemplateSetDto {
  reps: number
  weight: number
  position: number
}
export type UpdateTemplateSetDto = Partial<CreateTemplateSetDto>

export async function getTemplateWorkout(id: string): Promise<TemplateWorkout> {
  const res = await api.get<TemplateWorkout>(`/template-workouts/${id}`)
  return res.data
}

export async function fetchTemplateWorkouts(): Promise<TemplateWorkout[]> {
  const res = await api.get<TemplateWorkout[]>(`/template-workouts`)
  return res.data
}

export async function createTemplateWorkout(dto: CreateTemplateWorkoutDto): Promise<TemplateWorkout> {
  const res =await api.post<TemplateWorkout>(`/template-workouts`, dto)
  return res.data
}

export async function updateTemplateWorkout(id: string, dto: UpdateTemplateWorkoutDto): Promise<TemplateWorkout> {
  const res = await api.patch<TemplateWorkout>(`/template-workouts/${id}`, dto);
  return res.data
}

export async function deleteTemplateWorkout(id: string): Promise<void> {
  await api.delete<TemplateWorkout>(`/template-workouts/${id}`)
}

/************  EXERCISE API CALLS **************/

export async function createTemplateExercise(dto: CreateTemplateExerciseDto, workoutId: string): Promise<TemplateExercise> {
    const raw = (await api.post<TemplateExercise>(`/template-workouts/${workoutId}/exercises`, dto)).data

    return {
      templateExerciseId: raw.id,
      exerciseId: raw.exerciseId,
      position: raw.position,
      sets: raw.sets || [],
      exercise: raw.exercise,
    };
}

export async function fetchTemplateExercises(workoutId: string): Promise<TemplateExercise[]> {
    const res =await api.get<TemplateExercise[]>(`/template-workouts/${workoutId}/exercises`)
    return res.data
}

// use workoutId property as the "id" in the API endpoint url
export async function updateTemplateExercise(dto: UpdateTemplateExerciseDto, id: string, workoutId: string): Promise<TemplateExercise> {
    const res = await api.patch<TemplateExercise>(`/template-workouts/${workoutId}/exercises/${id}`, dto)
    return res.data
}

export async function deleteTemplateExercise(workoutId: string, id: string): Promise<void> {
    await api.delete (`/template-workouts/${workoutId}/exercises/${id}`)
}

/******************* SETS API CALLS ******************/

/**
 * POST /workouts/:workoutId/exercises/:exerciseId/sets
 */
export async function createTemplateSet(
    dto: CreateTemplateSetDto,
    workoutId: string,
    exerciseId: string
):Promise<TemplateSet> {
    const res = await api.post<TemplateSet>(
        `/template-workouts/${workoutId}/exercises/${exerciseId}/sets`,
        dto
    );
    return res.data;
}


export async function fetchTemplateSets(
  workoutId: string,
  exerciseId: string
): Promise< TemplateSet[]> {
  console.log('templateWorkoutId: ', workoutId, '\ntemplateExerciseId: ', exerciseId)

  const res = await api.get<TemplateSet[]>(
    `/template-workouts/${workoutId}/exercises/${exerciseId}/sets`
  );
  console.log('fetchTemplateSets: ', res.data)
  return res.data;
}

/**
 * PATCH /workouts/:workoutId/exercises/:exerciseId/sets/:id
 */
export async function updateTemplateSet(
  id: string,
  dto: UpdateTemplateSetDto,
  workoutId: string,
  exerciseId: string
): Promise<TemplateSet> {
  const res = await api.patch<TemplateSet>(
    `/template-workouts/${workoutId}/exercises/${exerciseId}/sets/${id}`,
    dto
  );
  return res.data;
}

/**
 * DELETE /workouts/:workoutId/exercises/:exerciseId/sets/:id
 */
export async function deleteTemplateSet(
  setId: string,
  workoutId: string,
  exerciseId: string
): Promise<void> {
  await api.delete(
    `/template-workouts/${workoutId}/exercises/${exerciseId}/sets/${setId}`
  );
}