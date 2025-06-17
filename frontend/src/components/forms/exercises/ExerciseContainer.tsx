// src/components/forms/exercises/ExerciseContainer.tsx
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { ExerciseForm } from './ExerciseForm';
import { ExerciseFormValues } from '../types';
import { SetContainer } from '../sets/SetContainer';
import { useUpdateSet } from '../../../hooks/sets/useUpdateSet';
import { useCreateSet } from '../../../hooks/sets/useCreateSet';
import { useWorkoutSets } from '../../../hooks/useSets';
import { useParams } from 'react-router-dom';

export interface ExerciseContainerProps {
  initialValues: ExerciseFormValues;
  onSubmit: (data: ExerciseFormValues) => void | Promise<void>;
}

export function ExerciseContainer({
  initialValues,
  onSubmit,
}: ExerciseContainerProps) {
  const methods = useForm<ExerciseFormValues>({
    defaultValues: initialValues,
  });
  const { id: workoutId, eid: exerciseId } =
  useParams<{ id: string; eid: string }>() as { id: string; eid: string };

  //const {id: workoutId, eid: exerciseId}=useParams<{id: string; eid: string}> ();
  const {data: exerciseSets = []}=useWorkoutSets(workoutId as string, exerciseId as string);
  const { mutate: createSet } = useCreateSet();
  const { mutate: updateSet } = useUpdateSet();

  return (
    <FormProvider {...methods}>
      <ExerciseForm onSubmit={methods.handleSubmit(onSubmit)}>
        {exerciseSets.map(set =>
        <SetContainer
          key={set.id ?? set.position}
          initialValues={{
            id: set.id,
            reps: set.reps,
            weight: set.weight,
            position: set.position,
            //completed: set.completed,
          }}
          onSubmit={data => {
           if (data.id) {
            updateSet({
              setId: data.id,
              workoutId: workoutId,
              exerciseId: exerciseId,
              dto: {
                reps: data.reps,
                weight: data.weight,
                position: data.position,
              },
            });
            } else {
              // call your useCreateSet mutation
              createSet({
                workoutId,
                exerciseId,
                dto: {
                  reps: data.reps,
                  weight: data.weight,
                  position: data.position,
                },
              });
            }
          }}
        />
      )}
      </ExerciseForm>
    </FormProvider>
  );
}
