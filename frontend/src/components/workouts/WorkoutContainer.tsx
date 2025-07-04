
// --- src/components/workout/WorkoutContainer.tsx ---
import React, {useState} from 'react';
import { useForm, FormProvider, useFieldArray,  } from 'react-hook-form'
import { WorkoutForm } from './WorkoutForm';
import { WorkoutFormValues } from '../forms/types';
import { Dialog } from '@mui/material';
import { ExerciseCatalogList } from '../catalog/ExerciseCatalogList';
import { ExerciseCatalogItem } from '../../api/exerciseCatalog';
import { ExerciseInfoModal } from '../exercises/ExerciseInfoModal';
import { zodResolver } from '@hookform/resolvers/zod';
import { workoutSchema } from '../../schemas/workout';

interface WorkoutContainerProps {
  initialValues: WorkoutFormValues
  onSubmit: (data: WorkoutFormValues) => void | Promise<void>
  isLoading?: boolean
  //error?: unknown
}

export function WorkoutContainer({ initialValues, onSubmit, isLoading }: WorkoutContainerProps) {
  const methods = useForm<WorkoutFormValues>({ 
    resolver: zodResolver(workoutSchema),
    defaultValues: initialValues,
    mode: 'onSubmit',            // only validate on submit
    reValidateMode: 'onSubmit',  // only re-validate on submit, not onChange
    shouldUnregister: false      // prevents RHF unregistering the field
   })

  const { control, handleSubmit } = methods;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'exercises',
    shouldUnregister: false,
  });

  


  const [detailEx, setDetailEx] = useState<ExerciseCatalogItem | null>(null);

  // selector state
  const [showSelector, setShowSelector] = useState(false);

  return (
    <FormProvider {...methods}>
      {/* handleSubmit returns an event handler */}
      <WorkoutForm 
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isLoading}

        // field-array props:
        fields={fields}       // FieldArrayWithId<...>[]
        removeExercise={remove}
        moveExercise={move}
    
        // selector props:
        openSelector={() => setShowSelector(true)}
      />
        <Dialog open={showSelector} onClose={() => setShowSelector(false)}>
          <ExerciseCatalogList
            showCustom
            onSelect={(exercise)=>setDetailEx(exercise)}  //opens details
            onAdd={(exercise)=> {
              append({
                exerciseId: exercise.id,
                position: fields.length + 1,
                sets: [{reps: 0, weight: 0, position: 1}],
              });
              setShowSelector(false);
            }}
          />
        </Dialog>
        <ExerciseInfoModal
          open={!!detailEx}
          exercise={detailEx}
          onClose={() => setDetailEx(null)}
        />
        
      
    </FormProvider>
  )
}