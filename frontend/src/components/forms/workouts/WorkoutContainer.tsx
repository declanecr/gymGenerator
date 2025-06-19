
// --- src/components/workout/WorkoutContainer.tsx ---
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form'
import { WorkoutForm } from './WorkoutForm';
import { WorkoutFormValues } from '../types';

interface WorkoutContainerProps {
  initialValues: WorkoutFormValues
  onSubmit: (data: WorkoutFormValues) => void | Promise<void>
  isLoading?: boolean
  //error?: unknown
}

export function WorkoutContainer({ initialValues, onSubmit, isLoading }: WorkoutContainerProps) {
  const methods = useForm<WorkoutFormValues>({ defaultValues: initialValues })


  return (
    <FormProvider {...methods}>
      {/* handleSubmit returns an event handler */}
      <WorkoutForm onSubmit={methods.handleSubmit(onSubmit)}
        isLoading={isLoading}
        //error={error}
      >
        {/* …render your exercises list here… */}
      </WorkoutForm>
    </FormProvider>
  )
}