// --- src/components/workout/WorkoutForm.tsx ---
import React, {useEffect} from 'react';
import {  useFormContext, FieldArrayWithId, UseFieldArrayMove, UseFieldArrayRemove } from 'react-hook-form';
import { WorkoutFormValues } from '../forms/types';
import { ExerciseFields } from '../exercises/ExerciseFields';
import { WorkoutInfoEditable } from './WorkoutInfoEditable';

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Button, FormHelperText, Grid } from '@mui/material';

export interface WorkoutFormProps {
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    //children?: React.ReactNode;
    isLoading?: boolean;
    openSelector: () => void;
    fields: FieldArrayWithId<WorkoutFormValues, "exercises", "id">[];    
    removeExercise: UseFieldArrayRemove;
    moveExercise: UseFieldArrayMove;
    //error?: unknown;
}

export function WorkoutForm({ onSubmit,
  isLoading,
  fields,
  removeExercise,
  moveExercise,
  openSelector,
}: WorkoutFormProps) {
  
  const { register, watch, setValue, formState: {errors, submitCount}, } = useFormContext<WorkoutFormValues>()
  const sensors =useSensors(useSensor(PointerSensor)); //just says to use mouse as the tracked sensor for moving exercises

  // live array of exercises
  const exercises = watch(`exercises`) ?? []
  const noExercises = exercises.length === 0

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
    moveExercise(oldIndex, newIndex);

    // now overwrite all positions
    fields.forEach((_, idx) => {
      setValue(`exercises.${idx}.position`, idx + 1);
    });
  }

  return (

    <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      
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
            <Box key={field.id} mb={2}>
              <ExerciseFields
                id={field.id}   // for useSortable
                index={idx}   // for RHF
                onRemove={() => removeExercise(idx)}
                />
            </Box>
          ))}
          
        </SortableContext>
      </DndContext>
      {submitCount > 0 && noExercises && (
        <FormHelperText error sx={{ mt: 1, mb: 2 }}>
          {errors.exercises?.message ?? 'Add at least one exercise'} {/** the additional message is crucial, it prevents the error from being lost by Zod*/}
        </FormHelperText>
      )}

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid>
          <Button variant="outlined" type="button" onClick={openSelector}>
            Add Exercise
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" type="submit" disabled={isLoading}>
            {isLoading ? 'Saving…' : 'Finish'}
          </Button>
        </Grid>
      </Grid>
    </Box>

  )
}