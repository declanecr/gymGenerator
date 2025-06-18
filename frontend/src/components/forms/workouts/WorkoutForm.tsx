// --- src/components/workout/WorkoutForm.tsx ---
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { WorkoutFormValues } from '../types';
import { ExerciseFields } from '../exercises/ExerciseFields';



export interface WorkoutFormProps {
    onSubmit: React.FormEventHandler<HTMLFormElement>
    children?: React.ReactNode
}

export function WorkoutForm({ onSubmit, children }: WorkoutFormProps) {
  const { register, control, watch } = useFormContext<WorkoutFormValues>();
  const { fields, append, remove } =useFieldArray({
    control,
    name: "exercises",  // field in your WorkoutFormValues
  })

  //watch the exercises array
  const exercises = watch('exercises');

  return (

    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" type="string" {...register('name')} />
      </div>

      <div>
        <label htmlFor="notes">Notes</label>
        <input id="notes" type="string" {...register('notes')} />
      </div>

      
      {/* exercises */}
      {fields.map((field, idx) => (
        <ExerciseFields
          key={field.id}
          index={idx}
          onRemove={() => remove(idx)}
       />
      ))}

      <button type="button" onClick={() => append({ exerciseId: "",position: fields.length +1, sets: [] })}>
        Add Exercise
      </button>

      {children}
      <button type="submit">Finish</button>
      <button type="button">Cancel</button>
      {/* DEBUG: live‐update JSON */}
      <pre style={{ background: '#fafafa', padding: '1em' }}>
        {JSON.stringify(exercises, null, 2)}
      </pre>
    </form>

  )
}