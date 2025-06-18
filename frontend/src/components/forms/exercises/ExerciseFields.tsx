// src/components/forms/exercises/ExerciseFields.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { WorkoutFormValues } from '../types';

interface ExerciseFieldsProps {
  index: number;
  onRemove: () => void;
}

export function ExerciseFields({ index, onRemove }: ExerciseFieldsProps) {
  const { register } = useFormContext<WorkoutFormValues>();
  // (we'll wire nested sets here later)
  return (
    <div>
      <label htmlFor={`exercises.${index}.exerciseId`}>Exercise</label>
      <select
        id={`exercises.${index}.exerciseId`}
        {...register(`exercises.${index}.exerciseId` as const)}
      >
        <option value="">Select…</option>
        <option value="squat">Squat</option>
      </select>

      <label htmlFor={`exercises.${index}.position`}>Position</label>
      <input
        id={`exercises.${index}.position`}
        type="number"
        {...register(`exercises.${index}.position`, { valueAsNumber: true })}
      />

      <button type="button" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}
