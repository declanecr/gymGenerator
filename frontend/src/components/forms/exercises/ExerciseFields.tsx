// src/components/forms/exercises/ExerciseFields.tsx
import React from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { WorkoutFormValues } from '../types';
import { useExercisesCatalog } from '../../../hooks/useExercisesCatalog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, Select, MenuItem, Button } from '@mui/material';

interface ExerciseFieldsProps {
  id: string;
  index: number;
  onRemove: () => void;
}

export function ExerciseFields({ id, index, onRemove }: ExerciseFieldsProps) {
  const { register, control } = useFormContext<WorkoutFormValues>();
  const { data: catalog = [], isLoading, error } = useExercisesCatalog();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { fields: setFields, append: appendSet, remove: removeSet } =
    useFieldArray({ control, name: `exercises.${index}.sets` });

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
            <input
              type="number"
              placeholder="Weight"
              {...register(`exercises.${index}.sets.${sIdx}.weight`, { valueAsNumber: true })}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={e => {
                e.stopPropagation();
                removeSet(sIdx);
              }}
            >
              Remove Set
            </Button>
          </Box>
        ))}
        <Button
          variant="contained"
          size="small"
          onClick={e => {
            e.stopPropagation();
            appendSet({ reps: 0, weight: 0, position: setFields.length + 1 });
          }}
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