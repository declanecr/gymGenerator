import { StartNamedModal } from '../shared-workouts/StartNamedModal';
import { useCreateWorkout } from '../../hooks/workouts/useCreateWorkout';
import { useNavigate } from 'react-router-dom';

export default function StartWorkoutModal(props: { open: boolean; onClose(): void }) {
  const createWorkout = useCreateWorkout();
  const navigate = useNavigate();

  return (
    <StartNamedModal
      {...props}
      title="Start New Workout"
      createFn={({ name, notes }) => createWorkout.mutateAsync({ dto: { name, notes } })}
      getSuccessPath={w => `/workouts/${w.id}`}
      onNavigate={navigate}
    />
  );
}
