import React from 'react';
import { useParams, Link,  useNavigate } from 'react-router-dom';
import { useGetWorkout } from '../hooks/workouts/useGetWorkout';
import { WorkoutContainer } from '../components/workouts/WorkoutContainer';
import { WorkoutFormValues } from '../components/forms/types';
import { useCreateExercise } from '../hooks/workoutExercises/useCreateExercise';
import { useCreateSet } from '../hooks/workoutSets/useCreateSet';
import { WorkoutExercise } from '../api/exercises';
import { ExerciseFormValues } from '../components/forms/types';
import { SetFormValues } from '../components/forms/types';
import { WorkoutSet } from '../api/sets';
import { fetchWorkoutSets } from '../api/sets';
import { useWorkoutExercises } from '../hooks/workoutExercises/useExercises';
import { useQueries } from '@tanstack/react-query';

import { useUpdateExercise } from '../hooks/workoutExercises/useUpdateExercise';
import { useUpdateSet } from '../hooks/workoutSets/useUpdateSet';
import { useDeleteExercise } from '../hooks/workoutExercises/useDeleteExercise';
import { useDeleteSet } from '../hooks/workoutSets/useDeleteSet';


function toSetFormValues(apiSet: WorkoutSet): SetFormValues {
  return {
    id: apiSet.id,
    reps: apiSet.reps,
    weight: apiSet.weight,
    position: apiSet.position,
    // Ignore completed for now unless you want it in your form
  };
}


export default function WorkoutPage() {
  const { id } = useParams();
  const workoutId = id as string;
  const navigate= useNavigate();
   // react-query hooks for create/update/delete
  const { mutateAsync: createExercise } = useCreateExercise();
  const { mutateAsync: updateExercise } = useUpdateExercise();
  const { mutateAsync: deleteExercise } = useDeleteExercise();
  const { mutateAsync: createSet } = useCreateSet();
  const { mutateAsync: updateSet } = useUpdateSet();
  const { mutateAsync: deleteSet } = useDeleteSet();


  // fetch workout
  const { 
    data: workout, 
    isLoading: isWorkoutLoading, 
    error: workoutError
  } = useGetWorkout(workoutId);

  // fetch exercises for this workout
  const {
    data: workoutExercises,
    isLoading: isExercisesLoading,
    error: exercisesError,
  } = useWorkoutExercises(workoutId);

  console.log('fetch exercises: ', workoutExercises);

  // fetch sets for each exercise
  const setsQueries = useQueries({
    queries:
      workoutExercises?.map((ex: WorkoutExercise) => ({
        queryKey: ['sets', workoutId, ex.workoutExerciseId],
        queryFn: () => fetchWorkoutSets(workoutId, ex.workoutExerciseId),
      })) || [],
  });



  const isSetsLoading = setsQueries.some(q => q.isLoading);
  const hasSetsError = setsQueries.some(q => q.error);

  // loading & error states
  if (isWorkoutLoading || isExercisesLoading || isSetsLoading) {
    return <div>Loading…</div>;
  }
  if (workoutError || exercisesError || hasSetsError || !workout) {
    return <div>Error loading workout</div>;
  }

 // build initial form data
  const initialExercises: ExerciseFormValues[] =
    (workoutExercises || []).map((ex:WorkoutExercise, idx: number) => ({
      id: ex.workoutExerciseId,
      exerciseId: ex.exerciseId,
      position: ex.position,
      sets:
        ((setsQueries[idx].data as WorkoutSet[]) || [])
          .map(toSetFormValues),
    }));

  const initialValues: WorkoutFormValues = {
    id: workout.id,
    name: workout.name,
    notes: workout.notes ?? '',
    exercises: initialExercises,
  };

   // handle create vs update calls
  async function handleSubmit(data: WorkoutFormValues) {
    console.log('WP submit payload: ', data)
    // DELETE removed exercises
    const originalIds = initialValues.exercises.map(e => e.id).filter(Boolean) as string[];
    const currentIds = data.exercises.map(e => e.id).filter(Boolean) as string[];
    await Promise.all(
      originalIds
        .filter(id => !currentIds.includes(id))
        .map(id => deleteExercise({ id, workoutId }))
    );

    // UPSERT exercises and their sets
    for (const ex of data.exercises) {
      const dtoEx = { exerciseId: ex.exerciseId, position: ex.position };
      let exId = ex.id;
      if (exId) {
        await updateExercise({ workoutId, id: exId, dto: dtoEx });
      } else {
        const newEx = await createExercise({ workoutId, dto: dtoEx });
        exId = newEx.workoutExerciseId;
      }

      // DELETE removed sets
      const origSets =
        (initialValues.exercises.find(e => e.id === ex.id)?.sets || [])
          .map(s => s.id)
          .filter(Boolean) as string[];
      const curSets = (ex.sets || [])
        .map(s => s.id)
        .filter(Boolean) as string[];
      await Promise.all(
        origSets
          .filter(id => !curSets.includes(id))
          .map(setId => deleteSet({ workoutId, exerciseId: exId!, setId }))
      );

      // UPSERT sets
      for (const s of ex.sets || []) {
        const dtoSet = { reps: s.reps, weight: s.weight, position: s.position };
        if (s.id) {
          await updateSet({ workoutId, exerciseId: exId!, setId: s.id, dto: dtoSet });
        } else {
          await createSet({ workoutId, exerciseId: exId!, dto: dtoSet });
        }
      }
    }
    navigate('/dashboard');
  }

  return (
    <div>
      <Link to="/dashboard">
        back to dashboard
      </Link>
      <h1>Workout Details</h1>    

      {/* Exercises/sets are always editable */}
      <WorkoutContainer
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
