import { StartNamedModal } from '../shared-workouts/StartNamedModal';
import { useCreateTemplateWorkout } from '../../hooks/templateWorkouts/useCreateTemplateWorkout';
import { useNavigate } from 'react-router-dom';

export default function StartTemplateModal(props: { open: boolean; onClose(): void }) {
  const createTpl = useCreateTemplateWorkout();
  const navigate = useNavigate();

  return (
    <StartNamedModal
      {...props}
      title="Create New Template"
      createFn={({ name, notes }) => createTpl.mutateAsync({ dto: { name, notes } })}
      getSuccessPath={tpl => `/template-workouts/${tpl.id}`}
      onNavigate={navigate}
    />
  );
}
