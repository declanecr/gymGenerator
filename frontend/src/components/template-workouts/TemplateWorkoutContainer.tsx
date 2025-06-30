import React, { useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { TemplateWorkoutForm } from './TemplateWorkoutForm';
import { WorkoutFormValues } from '../forms/types';
import { Dialog } from '@mui/material';
import { ExerciseCatalogList } from '../catalog/ExerciseCatalogList';
import { ExerciseCatalogItem } from '../../api/exerciseCatalog';
import { ExerciseInfoModal } from '../exercises/ExerciseInfoModal';

interface TemplateWorkoutContainerProps {
  initialValues: WorkoutFormValues;
  onSubmit: (data: WorkoutFormValues) => void | Promise<void>;
  isLoading?: boolean;
}

export function TemplateWorkoutContainer({ initialValues, onSubmit, isLoading }: TemplateWorkoutContainerProps) {
  const methods = useForm<WorkoutFormValues>({ defaultValues: initialValues });
  const { control, handleSubmit } = methods;
  const { fields, append, remove, move } = useFieldArray({ control, name: 'exercises' });

  const [detailEx, setDetailEx] = useState<ExerciseCatalogItem | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  return (
    <FormProvider {...methods}>
      <TemplateWorkoutForm
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isLoading}
        fields={fields}
        removeExercise={remove}
        moveExercise={move}
        openSelector={() => setShowSelector(true)}
      />
      <Dialog open={showSelector} onClose={() => setShowSelector(false)}>
        <ExerciseCatalogList
          showCustom
          onSelect={exercise => setDetailEx(exercise)}
          onAdd={exercise => {
            append({ exerciseId: exercise.id, position: fields.length + 1, sets: [] });
            setShowSelector(false);
          }}
        />
      </Dialog>
      <ExerciseInfoModal open={!!detailEx} exercise={detailEx} onClose={() => setDetailEx(null)} />
    </FormProvider>
  );
}