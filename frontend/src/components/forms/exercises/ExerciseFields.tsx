// src/components/forms/exercises/ExerciseFields.tsx
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { WorkoutFormValues } from '../types';
import { useExercisesCatalog } from '../../../hooks/useExercisesCatalog';

interface ExerciseFieldsProps {
  index: number;
  onRemove: () => void;
}

export function ExerciseFields({ index, onRemove }: ExerciseFieldsProps) {
  const { register, control } = useFormContext<WorkoutFormValues>();
  const {data: catalog = [], isLoading, error}= useExercisesCatalog();

  
  
  // New: field array for sets nested under this exercise
  const { fields: setFields, append: appendSet, remove: removeSet } = useFieldArray({
    control,
    name: `exercises.${index}.sets`,
  });
  
  if (isLoading) return <div>Loading exercises…</div>;
  if (error)    return <div>Error loading exercises</div>;
  
  return (
    <div>
      <label htmlFor={`exercises.${index}.exerciseId`}>Exercise</label>
      <select
         {...register(`exercises.${index}.exerciseId`, { valueAsNumber: true })}
      >
        <option value="">Select an exercise...</option>
        {catalog.map(ex => (
          <option key={ex.id} value={ex.id}>
            {ex.name} ({ex.primaryMuscle})
          </option>
        ))}
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
