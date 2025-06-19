import api from "./axios";

export interface WorkoutSet {
    id: string
    createdAt: string
    updatedAt: string
    position: number
    reps: number
    weight: number
    completed: boolean  //should default to false, cuz needs to be checked off before it's allowed to be saved
}


/*********** DTOs ***************/
export interface CreateWorkoutSetDto {
    reps: number
    position: number
    weight: number
}

export type UpdateWorkoutSetDto = Partial <CreateWorkoutSetDto>


/*******************API CALLS ******************/

/**
 * POST /workouts/:workoutId/exercises/:exerciseId/sets
 */
export async function createWorkoutSet(
    dto: CreateWorkoutSetDto,
    workoutId: string,
    exerciseId: string
):Promise<WorkoutSet> {
    const res = await api.post<WorkoutSet>(
        `/workouts/${workoutId}/exercises/${exerciseId}/sets`,
        dto
    );
    return res.data;
}


export async function fetchWorkoutSets(
  workoutId: string,
  exerciseId: string
): Promise< WorkoutSet[]> {
  const res = await api.get<WorkoutSet[]>(
    `/workouts/${workoutId}/exercises/${exerciseId}/sets`
  );
  return res.data;
}

/**
 * PATCH /workouts/:workoutId/exercises/:exerciseId/sets/:id
 */
export async function updateWorkoutSet(
  id: string,
  dto: UpdateWorkoutSetDto,
  workoutId: string,
  exerciseId: string
): Promise<WorkoutSet> {
  const res = await api.patch<WorkoutSet>(
    `/workouts/${workoutId}/exercises/${exerciseId}/sets/${id}`,
    dto
  );
  return res.data;
}

/**
 * DELETE /workouts/:workoutId/exercises/:exerciseId/sets/:id
 */
export async function deleteWorkoutSet(
  setId: string,
  workoutId: string,
  exerciseId: string
): Promise<void> {
  await api.delete(
    `/workouts/${workoutId}/exercises/${exerciseId}/sets/${setId}`
  );
}