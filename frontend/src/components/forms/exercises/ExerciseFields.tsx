// src/components/forms/exercises/ExerciseFields.tsx
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { WorkoutFormValues } from '../types';

interface ExerciseFieldsProps {
  index: number;
  onRemove: () => void;
}

export function ExerciseFields({ index, onRemove }: ExerciseFieldsProps) {
  const { register, control } = useFormContext<WorkoutFormValues>();

  // New: field array for sets nested under this exercise
  const { fields: setFields, append: appendSet, remove: removeSet } = useFieldArray({
    control,
    name: `exercises.${index}.sets`,
  });

  
  return (
    <div>
      <label htmlFor={`exercises.${index}.exerciseId`}>Exercise</label>
      <select
        id={`exercises.${index}.exerciseId`}
        {...register(`exercises.${index}.exerciseId` as const)}
      >
        <option value="">Select…</option>
        <option value={1}>Squat</option > {/** 1 is the example ID */}
      </select>

      <label htmlFor={`exercises.${index}.position`}>Position</label>
      <input
        id={`exercises.${index}.position`}
        type="number"
        {...register(`exercises.${index}.position`, { valueAsNumber: true })}
      />

      {/* 2. Render each set */}
      {setFields.map((set, sIdx) => (
        <div key={set.id}>
          <input
            type="number"
            placeholder="Reps"
            {...register(`exercises.${index}.sets.${sIdx}.reps`, { valueAsNumber: true })}
          />
          <input
            type="number"
            placeholder="Weight"
            {...register(`exercises.${index}.sets.${sIdx}.weight`, { valueAsNumber: true })}
          />
          <button type="button" onClick={() => removeSet(sIdx)}>
            Remove Set
          </button>
        </div>
      ))}

      {/* 3. “Add Set” button */}
      <button
        type="button"
        onClick={() =>
          appendSet({ reps: 0, weight: 0, position: setFields.length + 1 })
        }
      >
        Add Set
      </button>

      <button type="button" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}
