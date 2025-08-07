// src/components/forms/exercises/ExerciseFields.tsx
import React, { useState } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { WorkoutFormValues } from '../forms/types';
import { useExercisesCatalog } from '../../hooks/catalog/useExercisesCatalog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Button, FormHelperText, Grid, Typography, Card, CardContent, IconButton, TextField } from '@mui/material';

interface ExerciseFieldsProps {
  id: string;
  index: number;
  onRemove: () => void;
  requireSets?: boolean;
}

export function ExerciseFields({ id, index, onRemove, requireSets = true }: ExerciseFieldsProps) {
  const { register, control, clearErrors, formState: { submitCount }, watch } = useFormContext<WorkoutFormValues>();
  const { data: catalog = [], isLoading, error } = useExercisesCatalog();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sets = watch(`exercises.${index}.sets`) as unknown[] | undefined
  const noSets = (sets?.length ?? 0) === 0

  const exerciseId = watch(`exercises.${index}.exerciseId`)
  const exerciseName = catalog.find(ex => ex.exerciseId === exerciseId)?.name ?? 'Exercise'

  const [pendingSetRemoval, setPendingSetRemoval] = useState<number | null>(null)
  const [confirmRemove, setConfirmRemove] = useState(false)

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

  function handleMinusClick(sIdx: number) {
    if (pendingSetRemoval === sIdx) {
      handleRemoveSet(sIdx)
      setPendingSetRemoval(null)
    } else {
      setPendingSetRemoval(sIdx)
    }
  }

  function handleRemoveExercise(e: React.MouseEvent) {
    e.stopPropagation()
    if (confirmRemove) {
      onRemove()
    } else {
      setConfirmRemove(true)
    }
  }

  if (isLoading) return <div>Loading exercises…</div>;
  if (error) return <div>Error loading exercises</div>;

  return (
    <Box ref={setNodeRef} sx={{ p: 1, ...style }}>
      <Grid container spacing={1} alignItems="stretch">
        <Grid size={{ xs: 1 }} {...attributes} {...listeners} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab' }}>
          <DragIndicatorIcon />
        </Grid>
        <Grid size={{ xs: 11 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {exerciseName}
              </Typography>
              <input type="hidden" {...register(`exercises.${index}.exerciseId`, { valueAsNumber: true })} />
              <input type="hidden" {...register(`exercises.${index}.position`, { valueAsNumber: true })} />
              {setFields.map((set, sIdx) => (
                <Grid container spacing={1} alignItems="center" key={set.id} sx={{ mb: 1 }}>
                  <Grid size={{ xs: 2 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton color={pendingSetRemoval === sIdx ? 'error' : 'default'} onClick={() => handleMinusClick(sIdx)}>
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                  <Grid size={{ xs: 5 }}>
                    <Controller
                      name={`exercises.${index}.sets.${sIdx}.weight`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <TextField
                            type="number"
                            label="Weight"
                            placeholder="Weight"
                            size="small"
                            fullWidth
                            error={!!fieldState.error}
                            {...field}
                            value={
                              Number.isNaN(field.value) || field.value === undefined
                                ? ''
                                : field.value
                            }
                            onChange={(e) =>
                              field.onChange(e.target.value === '' ? NaN : Number(e.target.value))
                            }
                          />
                          {fieldState.error && (
                            <FormHelperText error>{fieldState.error.message}</FormHelperText>
                          )}
                        </>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 5 }}>
                    <Controller
                      name={`exercises.${index}.sets.${sIdx}.reps`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <TextField
                            type="number"
                            label="Reps"
                            placeholder="Reps"
                            size="small"
                            fullWidth
                            error={!!fieldState.error}
                            {...field}
                            value={
                              Number.isNaN(field.value) || field.value === undefined
                                ? ''
                                : field.value
                            }
                            onChange={(e) =>
                              field.onChange(e.target.value === '' ? NaN : Number(e.target.value))
                            }
                          />
                          {fieldState.error && (
                            <FormHelperText error>{fieldState.error.message}</FormHelperText>
                          )}
                        </>
                      )}
                    />
                  </Grid>
                </Grid>
              ))}
              {submitCount > 0 && noSets && requireSets && (
                <FormHelperText error>Each exercise needs at least one set</FormHelperText>
              )}
              <Button variant="contained" fullWidth onClick={handleAddSet} sx={{ mt: 1 }}>
                Add Set
              </Button>
              <Button
                variant="outlined"
                color={confirmRemove ? 'error' : 'inherit'}
                fullWidth
                sx={{ mt: 1 }}
                onClick={handleRemoveExercise}
              >
                Remove
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}