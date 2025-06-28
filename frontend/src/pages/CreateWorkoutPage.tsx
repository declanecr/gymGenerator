// src/pages/CreateWorkoutPage.tsx
import React from 'react';
import { WorkoutContainer } from '../components/workouts/WorkoutContainer';
import { useCreateWorkout } from '../hooks/workouts/useCreateWorkout';
import { WorkoutFormValues } from '../components/forms/types';

export function CreateWorkoutPage() {
  const { mutate: createWorkout } = useCreateWorkout();

  const handleSubmit = (data: WorkoutFormValues) => {
    // if name empty, default to ISO date string
    if (!data.name.trim()) {
      data.name = new Date().toLocaleDateString();
    }
    createWorkout({ dto: data });
  };

  return (
    <WorkoutContainer
      initialValues={{
        name: '',
        notes: '',
        exercises: [],
      }}
      onSubmit={handleSubmit}
    />
  );
}
