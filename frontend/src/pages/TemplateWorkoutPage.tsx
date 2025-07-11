import React, {useRef} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TemplateWorkoutContainer, TemplateWorkoutContainerHandle } from '../components/template-workouts/TemplateWorkoutContainer';
import { WorkoutFormValues, ExerciseFormValues, SetFormValues } from '../components/forms/types';
import { fetchTemplateSets } from '../api/templateWorkouts';
import { useTemplateExercises } from '../hooks/templateExercises/useTemplateExercises';
import { useQueries } from '@tanstack/react-query';
import { TemplateExercise, TemplateSet } from '../api/templateWorkouts';
import { useCreateTemplateExercise } from '../hooks/templateExercises/useCreateTemplateExercise';
import { useUpdateTemplateExercise } from '../hooks/templateExercises/useUpdateTemplateExercise';
import { useDeleteTemplateExercise } from '../hooks/templateExercises/useDeleteTemplateExercise';
import { useCreateTemplateSet } from '../hooks/templateSets/useCreateTemplateSet';
import { useUpdateTemplateSet } from '../hooks/templateSets/useUpdateTemplateSet';
import { useDeleteTemplateSet } from '../hooks/templateSets/useDeleteTemplateSet';
import { useGetTemplateWorkout } from '../hooks/templateWorkouts/useGetTemplateWorkout';
import { useCreateWorkoutFromTemplate } from '../hooks/workouts/useCreateFromTemplate';
import { Button } from '@mui/material';
//import { useCopyWorkoutFromTemplate } from '../hooks/workouts/useCopyWorkoutFromTemplate';

function toSetFormValues(apiSet: TemplateSet): SetFormValues {
  return { id: apiSet.id, reps: apiSet.reps ?? 0, weight: apiSet.weight ?? 0, position: apiSet.position };
}

export default function TemplateWorkoutPage() {
  const { id } = useParams();
  const workoutId = id as string;
  const navigate = useNavigate();

  const { mutateAsync: createExercise } = useCreateTemplateExercise();
  const { mutateAsync: updateExercise } = useUpdateTemplateExercise();
  const { mutateAsync: deleteExercise } = useDeleteTemplateExercise();
  const { mutateAsync: createSet } = useCreateTemplateSet();
  const { mutateAsync: updateSet } = useUpdateTemplateSet();
  const { mutateAsync: deleteSet } = useDeleteTemplateSet();
  const { mutateAsync: createFromTemplate } =useCreateWorkoutFromTemplate();
  
  

  const {
    data: workout,
    isLoading: isWorkoutLoading,
    error: workoutError,
  } = useGetTemplateWorkout(workoutId);

  const {
    data: workoutExercises,
    isLoading: isExercisesLoading,
    error: exercisesError,
  } = useTemplateExercises(workoutId);

  const setsQueries = useQueries({
    queries:
      workoutExercises?.map((ex: TemplateExercise) => ({
        queryKey: ['template-sets', workoutId, ex.id],
        queryFn: () => fetchTemplateSets(workoutId, ex.id),
      })) || [],
  });

  const formRef = useRef<TemplateWorkoutContainerHandle>(null);

  const isSetsLoading = setsQueries.some(q => q.isLoading);
  const hasSetsError = setsQueries.some(q => q.error);

  if (isWorkoutLoading || isExercisesLoading || isSetsLoading) {
    return <div>Loading…</div>;
  }
  if (workoutError || exercisesError || hasSetsError || !workout) {
    return <div>Error loading template</div>;
  }

  const initialExercises: ExerciseFormValues[] = (workoutExercises || []).map((ex, idx) => ({
    id: ex.id,
    exerciseId: Number(ex.exerciseId),
    position: ex.position,
    sets: ((setsQueries[idx].data as TemplateSet[]) || []).map(toSetFormValues),
  }));

  const initialValues: WorkoutFormValues = {
    id: workout.id,
    name: workout.name,
    notes: workout.notes ?? '',
    exercises: initialExercises,
  };
  
  
  
  async function handleSave(data: WorkoutFormValues) {
    const originalIds = initialValues.exercises.map(e => e.id).filter(Boolean) as string[];
    const currentIds = data.exercises.map(e => e.id).filter(Boolean) as string[];
    await Promise.all(originalIds.filter(id => !currentIds.includes(id)).map(id => deleteExercise({ workoutId, id })));

    for (const ex of data.exercises) {
      const dtoEx = { exerciseId: Number(ex.exerciseId), position: ex.position };
      let exId = ex.id;
      if (exId) {
        await updateExercise({ workoutId, id: exId, dto: dtoEx });
      } else {
        const newEx = await createExercise({ workoutId, dto: dtoEx });
        exId = newEx.id;
      }
      const origSets = (initialValues.exercises.find(e => e.id === ex.id)?.sets || [])
        .map(s => s.id)
        .filter(Boolean) as string[];
      const curSets = (ex.sets || []).map(s => s.id).filter(Boolean) as string[];
      await Promise.all(origSets.filter(id => !curSets.includes(id)).map(setId => deleteSet({ workoutId, exerciseId: exId!, setId })));

      for (const s of ex.sets || []) {
        const dtoSet = { reps: s.reps, weight: s.weight, position: s.position };
        if (s.id) {
          await updateSet({ workoutId, exerciseId: exId!, setId: s.id, dto: dtoSet });
        } else {
          await createSet({ workoutId, exerciseId: exId!, dto: dtoSet });
        }
      }
    }
  }

  async function handleSubmit(data: WorkoutFormValues) {
    await handleSave(data);
    navigate('/dashboard');
  }

  async function handleStart() {
    if (formRef.current?.isDirty) {
      await formRef.current.submit(handleSave);
    }
    const workout = await createFromTemplate({tid: workoutId});
    navigate(`/workouts/${workout.id}`);
  }
  return (
    <div>
      <Link to="/dashboard">back to dashboard</Link>
      <Button onClick={handleStart}
        
      > Start this workout </Button>
      <h1>Template Workout Details</h1>
      
      <TemplateWorkoutContainer ref={formRef} initialValues={initialValues} onSubmit={handleSubmit} />
    </div>
  );
}