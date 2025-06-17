// src/components/forms/sets/SetForm.tsx

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { SetFormValues } from '../types';

export interface SetFormProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function SetForm({ onSubmit }: SetFormProps) {
  const { register } = useFormContext<SetFormValues>();

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="reps">Reps</label>
        <input id="reps" type="number" {...register('reps', { valueAsNumber: true })} />
      </div>

      <div>
        <label htmlFor="weight">Weight</label>
        <input id="weight" type="number" {...register('weight', { valueAsNumber: true })} />
      </div>

      <div>
        <label htmlFor="position">Position</label>
        <input id="position" type="number" {...register('position', { valueAsNumber: true })} />
      </div>

      {/*
      <div>
        <label htmlFor="completed">
          <input id="completed" type="checkbox" {...register('completed')} />
          Completed
        </label>
      </div>
      */}
      
      <button type="submit">Save Set</button>
      <button type="button">Remove Set</button>
    </form>
  );
}
