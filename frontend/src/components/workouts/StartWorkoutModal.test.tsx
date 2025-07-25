import { render } from '@testing-library/react';
import StartWorkoutModal from './StartWorkoutModal';
import { StartNamedModal } from '../shared-workouts/StartNamedModal';

jest.mock('../shared-workouts/StartNamedModal', () => ({
  StartNamedModal: jest.fn(() => null),
}));

jest.mock('../../hooks/workouts/useCreateWorkout', () => ({
  useCreateWorkout: () => ({ mutateAsync: jest.fn() }),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('StartWorkoutModal', () => {
  it('renders StartNamedModal', () => {
    render(<StartWorkoutModal open onClose={() => {}} />);
    expect(StartNamedModal).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Start New Workout' }),
      {}
    );
  });
});