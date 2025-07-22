import { render } from '@testing-library/react';
import StartTemplateModal from './StartTemplateModal';
import { StartNamedModal } from '../shared-workouts/StartNamedModal';

jest.mock('../shared-workouts/StartNamedModal', () => ({
  StartNamedModal: jest.fn(() => null),
}));

jest.mock('../../hooks/templateWorkouts/useCreateTemplateWorkout', () => ({
  useCreateTemplateWorkout: () => ({ mutateAsync: jest.fn() }),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('StartTemplateModal', () => {
  it('renders StartNamedModal', () => {
    render(<StartTemplateModal open={true} onClose={() => {}} />);
    expect(StartNamedModal).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Create New Template'}),
      {}
    );
  });
});