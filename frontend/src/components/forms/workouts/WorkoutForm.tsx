// --- src/components/workout/WorkoutForm.tsx ---
import React, {useEffect} from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { WorkoutFormValues } from '../types';
import { ExerciseFields } from '../exercises/ExerciseFields';
import { WorkoutInfoEditable } from './WorkoutInfoEditable';



export interface WorkoutFormProps {
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    children?: React.ReactNode;
    isLoading?: boolean;
    //error?: unknown;
}

export function WorkoutForm({ onSubmit, children}: WorkoutFormProps) {
  const { control, register, watch, setValue } = useFormContext<WorkoutFormValues>();  const { fields, append, remove } =useFieldArray({
    control,
    name: "exercises",  // field in your WorkoutFormValues
  })

  // Make sure name & notes are registered in RHF
  useEffect(() => {
    register('name');
    register('notes');
  }, [register]);

  // Read current values from form
  const nameValue = watch('name');
  const notesValue = watch('notes');

  // When WorkoutInfoEditable calls onPatch, push changes back into RHF
  function handleInfoPatch(update: Partial<{ name: string; notes: string | null | undefined }>) {
    if (update.name !== undefined)  setValue('name', update.name);
    if (update.notes !== undefined) setValue('notes', update.notes);
  }

  return (

    <form onSubmit={onSubmit}>
      <WorkoutInfoEditable
      name={nameValue}
      notes={notesValue}
      onPatch={handleInfoPatch}
      />

      
      {/* exercises */}
      {fields.map((field, idx) => (
        <ExerciseFields
          key={field.id}
          index={idx}
          onRemove={() => remove(idx)}
       />
      ))}

      <button type="button" onClick={() => append({ exerciseId: -1,position: fields.length +1, sets: [] })}>
        Add Exercise
      </button>

      {children}
      <button type="submit">Finish</button>
    </form>

  )
}