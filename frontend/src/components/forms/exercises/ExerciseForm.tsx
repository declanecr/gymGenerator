// src/components/forms/exercises/ExerciseForm.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ExerciseFormValues } from '../types';

export interface ExerciseFormProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children?: React.ReactNode;  // where your SetList will go
}

export function ExerciseForm({ onSubmit, children }: ExerciseFormProps) {
  const { register } = useFormContext<ExerciseFormValues>();

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="exerciseId">Exercise</label>
        <select id="exerciseId" {...register('exerciseId')}>
          {/* TODO: map over your exercise‐catalog here */}
          <option value="">Select…</option>
          <option value="squat">Squat</option>
          {/* … */}
        </select>
      </div>

      <div>
        <label htmlFor="position">Position</label>
        <input
          id="position"
          type="number"
          {...register('position', { valueAsNumber: true })}
        />
      </div>

      {/* nested sets can render here */}
      {children}

      <button type="submit">Save Exercise</button>
      <button type="button">Remove</button>
    </form>
  );
}
