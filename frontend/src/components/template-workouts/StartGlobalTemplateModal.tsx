import { StartNamedModal } from '../shared-workouts/StartNamedModal';
import { useCreateGlobalTemplateWorkout } from '../../hooks/templateWorkouts/useCreateGlobalTemplateWorkout';
import { useNavigate } from 'react-router-dom';

export default function StartGlobalTemplateModal(props: { open: boolean; onClose(): void }) {
  const createTpl = useCreateGlobalTemplateWorkout();
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