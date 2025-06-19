import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetWorkout } from '../hooks/workouts/useGetWorkout';
import { WorkoutContainer } from '../components/forms/workouts/WorkoutContainer';
import { WorkoutFormValues } from '../components/forms/types';
import { useCreateExercise } from '../hooks/workoutExercises/useCreateExercise';
import { useCreateSet } from '../hooks/sets/useCreateSet';
import { WorkoutExercise } from '../api/exercises';
import { ExerciseFormValues } from '../components/forms/types';
import { SetFormValues } from '../components/forms/types';
import { WorkoutSet } from '../api/sets';

// Transform API workout.exercise to form values
function toExerciseFormValues(apiExercise: WorkoutExercise): ExerciseFormValues {
  return {
    exerciseId: Number(apiExercise.exerciseId),  // convert string to number
    position: apiExercise.position,
    sets: (apiExercise.workoutSets ?? []).map(toSetFormValues),
  };
}

function toSetFormValues(apiSet: WorkoutSet): SetFormValues {
  return {
    setId: Number(apiSet.id), // convert string to number
    reps: apiSet.reps,
    weight: apiSet.weight,
    position: apiSet.position,
    // Ignore completed for now unless you want it in your form
  };
}


export default function WorkoutPage() {
  const { id } = useParams();
  const workoutId = id as string;
  const { data: workout, isLoading, error } = useGetWorkout(workoutId);
  const createExercise = useCreateExercise();
  const createSet = useCreateSet();

  if (isLoading) return <div>Loading…</div>;
  if (error || !workout) return <div>Error loading workout</div>;

 

  function handleSubmit(data: WorkoutFormValues){
    console.log('SUBMIT EXERCISES/SETS', data);
    // For each exercise in the form
    data.exercises.forEach(async (exercise) => {
      if (!exercise.exerciseId) {
        // This is a new exercise
        const { exerciseId, position, sets } = exercise;
        if(sets && sets.length > 0){
          // Create the exercise on backend
          const { id: newExerciseId } = await createExercise.mutateAsync({
            workoutId,
            dto: { exerciseId, position },
          });
          // For each set in this exercise
          sets.forEach(async (set) => {
            if (!set.setId) {
              // Create the set, now with real exerciseId
              await createSet.mutateAsync({
                workoutId,
                exerciseId: newExerciseId,
                dto: {
                  reps: set.reps,
                  weight: set.weight,
                  position: set.position,
                  // add more as needed
                },
              });
            }
          });
        } else {
          // added error or warning about empty exercise
          return;
        }
      } else {
        // Optionally handle updating existing exercise/sets
      }
    });
  }

  return (
    <div>
      <Link to="/dashboard">
        back to dashboard
      </Link>
      <h1>Workout Details</h1>    

      {/* Exercises/sets are always editable */}
      <WorkoutContainer
        initialValues={{
          name: workout.name, 
          notes: workout.notes ?? '',
          exercises: (workout.workoutExercises ?? []).map(toExerciseFormValues)
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
