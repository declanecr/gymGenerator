
// --- src/components/workout/WorkoutContainer.tsx ---
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form'
import { WorkoutForm } from './WorkoutForm';
import { WorkoutFormValues } from '../types';

interface WorkoutContainerProps {
  initialValues: WorkoutFormValues
  onSubmit: (data: WorkoutFormValues) => void | Promise<void>
}

export function WorkoutContainer({
  initialValues,
  onSubmit,
}: WorkoutContainerProps) {
  const methods = useForm<WorkoutFormValues>({
    defaultValues: initialValues,
  })

  return (
    <FormProvider {...methods}>
      {/* handleSubmit returns an event handler */}
      <WorkoutForm onSubmit={methods.handleSubmit(onSubmit)}>
        {/* …render your exercises list here… */}
      </WorkoutForm>
    </FormProvider>
  )
}