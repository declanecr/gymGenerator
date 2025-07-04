import React, { useEffect } from 'react';
import { useFormContext, FieldArrayWithId, UseFieldArrayMove, UseFieldArrayRemove } from 'react-hook-form';
import { WorkoutFormValues } from '../forms/types';
import { ExerciseFields } from '../exercises/ExerciseFields';
import { TemplateWorkoutInfoEditable } from './TemplateWorkoutInfoEditable';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormHelperText } from '@mui/material';

export interface TemplateWorkoutFormProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isLoading?: boolean;
  openSelector: () => void;
  fields: FieldArrayWithId<WorkoutFormValues, 'exercises', 'id'>[];
  removeExercise: UseFieldArrayRemove;
  moveExercise: UseFieldArrayMove;
}

export function TemplateWorkoutForm({ onSubmit, isLoading, fields, removeExercise, moveExercise, openSelector }: TemplateWorkoutFormProps) {
  const { register, watch, setValue, formState: { errors, submitCount, }, } = useFormContext<WorkoutFormValues>();
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    register('name');
    register('notes');
  }, [register]);

  const nameValue = watch('name');
  const notesValue = watch('notes');

  const exercises = watch('exercises') ?? [];
  const noExercises = exercises.length === 0;

  function handleInfoPatch(update: Partial<{ name: string; notes: string | null | undefined }>) {
    if (update.name !== undefined) setValue('name', update.name);
    if (update.notes !== undefined) setValue('notes', update.notes);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = fields.findIndex(f => f.id === active.id);
    const newIndex = fields.findIndex(f => f.id === over.id);
    moveExercise(oldIndex, newIndex);
    fields.forEach((_, idx) => {
      setValue(`exercises.${idx}.position`, idx + 1);
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <TemplateWorkoutInfoEditable name={nameValue} notes={notesValue} onPatch={handleInfoPatch} />
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
          {fields.map((field, idx) => (
            <ExerciseFields 
              key={field.id} 
              id={field.id} 
              index={idx} 
              onRemove={() => removeExercise(idx)} 
              requireSets={false}
            />
          ))}
        </SortableContext>
      </DndContext>
      {submitCount > 0 && noExercises && (
        <FormHelperText error sx={{ mt: 1, mb: 2 }}>
          {errors.exercises?.message ?? 'Add at least one exercise'}
        </FormHelperText>
      )}
      <button type="button" onClick={openSelector}>
        Add Exercise
      </button>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving…' : 'Finish'}
      </button>
    </form>
  );
}