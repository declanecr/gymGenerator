// src/components/forms/exercises/ExerciseFields.tsx
import React from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { WorkoutFormValues } from '../forms/types';
import { useExercisesCatalog } from '../../hooks/catalog/useExercisesCatalog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, Select, MenuItem, Button, FormHelperText } from '@mui/material';

interface ExerciseFieldsProps {
  id: string;
  index: number;
  onRemove: () => void;
}

export function ExerciseFields({ id, index, onRemove }: ExerciseFieldsProps) {
  const { register, control, clearErrors, formState: { errors, submitCount }, watch } = useFormContext<WorkoutFormValues>();
  const { data: catalog = [], isLoading, error } = useExercisesCatalog();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sets = watch(`exercises.${index}.sets`) as unknown[] | undefined
  const noSets = (sets?.length ?? 0) === 0

  const { fields: setFields, append, remove } = useFieldArray({ 
      control, 
      name: `exercises.${index}.sets`, 
      shouldUnregister: false,
    }
  );

  /* 🟢 ADD A SET */
  function handleAddSet() {
    append({ reps: 0, weight: 0, position: setFields.length + 1 })
    // error no longer relevant -> clear it immediately
    clearErrors(`exercises.${index}.sets`)
  }

  /* 🔴 REMOVE A SET */
  function handleRemoveSet(sIdx: number) {
    remove(sIdx);
  }

  if (isLoading) return <div>Loading exercises…</div>;
  if (error) return <div>Error loading exercises</div>;

  return (
    <Box
      ref={setNodeRef}
      sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, ...style }}
    >
      {/* drag handle */}
      <Box {...attributes} {...listeners} sx={{ cursor: 'grab', pr: 1 }}>
        <DragIndicatorIcon />
      </Box>

      {/* exercise selector */}
      <Controller
        
        name={`exercises.${index}.exerciseId`}
        control={control}
        render={({ field }) => (
          <Select {...field} displayEmpty sx={{ minWidth: 200, color: 'cyan' }}>
            <MenuItem value={-1} disabled>
              Select exercise…
            </MenuItem>
            {catalog.map(ex => (
              <MenuItem key={ex.id} value={ex.id}>
                {ex.name} ({ex.primaryMuscle})
              </MenuItem>
            ))}
          </Select>
        )}
      />

      {/* hidden position input for sync */}
      <input
        type="hidden"
        {...register(`exercises.${index}.position`, { valueAsNumber: true })}
      />

      {/* sets list */}
      <Box sx={{ flex: 1 }}>
        {setFields.map((set, sIdx) => (
          <Box key={set.id} sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <input
              type="number"
              placeholder="Reps"
              {...register(`exercises.${index}.sets.${sIdx}.reps`, { valueAsNumber: true })}
            />
            {submitCount > 0 && errors.exercises?.[index]?.sets?.[sIdx]?.reps?.message && (
              <Box component="span" sx={{ color: 'red', fontSize: '0.8em' }}>
                {errors.exercises[index].sets![sIdx].reps!.message}
              </Box>
            )}
            <input
              type="number"
              placeholder="Weight"
              {...register(`exercises.${index}.sets.${sIdx}.weight`, { valueAsNumber: true })}
            />
            {submitCount > 0 && errors.exercises?.[index]?.sets?.[sIdx]?.weight?.message && (
              <Box component="span" sx={{ color: 'red', fontSize: '0.8em' }}>
                {errors.exercises[index].sets![sIdx].weight!.message}
              </Box>
            )}
            <Button
              variant="outlined"
              size="small"
              onClick={()=> handleRemoveSet(sIdx)}
            >
              Remove Set
            </Button>
            
          </Box>
        ))}
        {/* only show this once a “Finish” has been clicked and there are no sets */}
        {submitCount > 0 && noSets && (
          <FormHelperText error>
            Each exercise needs at least one set
          </FormHelperText>
        )}
        <Button
          variant="contained"
          size="small"
          onClick={handleAddSet}
        >
          Add Set
        </Button>
      </Box>

      {/* remove exercise */}
      <Button
        variant="outlined"
        color="error"
        onClick={e => {
          e.stopPropagation();
          onRemove();
        }}
      >
        Remove
      </Button>
    </Box>
  );
}