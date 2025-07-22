import { render } from '@testing-library/react';
import StartGlobalTemplateModal from './StartGlobalTemplateModal';
import { StartNamedModal } from '../shared-workouts/StartNamedModal';

jest.mock('../shared-workouts/StartNamedModal', () => ({
  StartNamedModal: jest.fn(() => <div>mock</div>),
}));

jest.mock('../../hooks/templateWorkouts/useCreateGlobalTemplateWorkout', () => ({
  useCreateGlobalTemplateWorkout: () => ({ mutateAsync: jest.fn() }),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('StartGlobalTemplateModal', () => {
  it('renders StartNamedModal', () => {
    render(<StartGlobalTemplateModal open onClose={() => {}} />);
    expect(StartNamedModal).toHaveBeenCalledWith(
    expect.objectContaining({title:'Create New Template'}),
    {}
  );
  
  });
});