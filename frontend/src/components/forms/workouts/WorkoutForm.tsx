// --- src/components/workout/WorkoutForm.tsx ---
import React, {useEffect} from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { WorkoutFormValues } from '../types';
import { ExerciseFields } from '../exercises/ExerciseFields';
import { WorkoutInfoEditable } from './WorkoutInfoEditable';

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export interface WorkoutFormProps {
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    children?: React.ReactNode;
    isLoading?: boolean;
    //error?: unknown;
}

export function WorkoutForm({ onSubmit, children}: WorkoutFormProps) {
  const { control, register, watch, setValue } = useFormContext<WorkoutFormValues>();  
  const { fields, append, remove, move } =useFieldArray({
    control,
    name: "exercises",  // field in your WorkoutFormValues
  })

  const sensors =useSensors(useSensor(PointerSensor)); //just says to use mouse as the tracked sensor for moving exercises

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

  function handleDragEnd(event: DragEndEvent){
    const {active, over } = event;
    if (!over || active.id === over.id) return;    //dropped outside a list, or dropped on itself

    const oldIndex = fields.findIndex(f => f.id === active.id);
    const newIndex = fields.findIndex(f => f.id === over.id);
    move(oldIndex, newIndex);

    // now overwrite all positions
    fields.forEach((_, idx) => {
      setValue(`exercises.${idx}.position`, idx + 1);
    });
  }

  return (

    <form onSubmit={onSubmit}>
      <WorkoutInfoEditable
      name={nameValue}
      notes={notesValue}
      onPatch={handleInfoPatch}
      />

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={fields.map(f => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {/* exercises */}
          {fields.map((field, idx) => (
            <ExerciseFields
              key={field.id}
              id={field.id}   // for useSortable
              index={idx}   // for RHF
              onRemove={() => remove(idx)}
          />
      ))}
      </SortableContext>
      </DndContext>

      <button type="button" onClick={() => append({ exerciseId: -1,position: fields.length +1, sets: [] })}>
        Add Exercise
      </button>

      {children}
      <button type="submit">Finish</button>
    </form>

  )
}