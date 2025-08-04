import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCustomExercise } from '../../hooks/catalog/useCreateCustomExercise';
import { useGetMe } from '../../hooks/users/useGetMe';
import { useCreateDefaultExercise } from '../../hooks/catalog/useCreateDefaultExercise';
import { useDevice } from '../../context/DeviceContext';
import CreateExercisePageMobile from './CreateExercisePageDesktop';
import CreateExercisePageTablet from './CreateExercisePageTablet';
import CreateExercisePageDesktop from './CreateExercisePageDesktop';

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  primaryMuscle: z.string().min(1, { message: 'Muscle is required' }),
  equipment: z.string().optional(),
});

export type FormInputs = z.infer<typeof schema>;

export default function CreateExercisePage() {
  const navigate = useNavigate();
  const { data: me } = useGetMe();
  const createCustom = useCreateCustomExercise();
  const createDefault = useCreateDefaultExercise();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (data: FormInputs)=>{
    try {
      if (me?.role === 'ADMIN') {
        await createDefault.mutateAsync(data);
        navigate('/admin');
      } else {
        await createCustom.mutateAsync(data);
        navigate('/dashboard');
      }
    } catch {
      // error handled via isError
    }
  });

  const { isMobile, isTablet } = useDevice()
  const View = isMobile ? CreateExercisePageMobile : isTablet ? CreateExercisePageTablet : CreateExercisePageDesktop;
  return (
    <View
      me={me}
      register={register}
      errors={errors}
      onSubmit={onSubmit}
      isPending={createCustom.isPending || createDefault.isPending}
      isError={createCustom.isError || createDefault.isError}
    />
  )
}