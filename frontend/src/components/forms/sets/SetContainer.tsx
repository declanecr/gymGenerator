// src/components/forms/sets/SetContainer.tsx

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { SetForm } from './SetForm';
import { SetFormValues } from '../types';

export interface SetContainerProps {
  initialValues: SetFormValues;
  onSubmit: (data: SetFormValues) => void | Promise<void>;
}

export function SetContainer({ initialValues, onSubmit }: SetContainerProps) {
  const methods = useForm<SetFormValues>({ defaultValues: initialValues });

  return (
    <FormProvider {...methods}>
      <SetForm onSubmit={methods.handleSubmit(onSubmit)} />
    </FormProvider>
  );
}
