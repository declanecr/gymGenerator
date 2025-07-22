import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseInfoModal } from './ExerciseInfoModal';

const exercise = {
  exerciseId: 1,
  name: 'Bench',
  description: 'Press',
  primaryMuscle: 'Chest',
  default: false,
  templateExercises: [],
  workoutExercises: [],
};

describe('ExerciseInfoModal', () => {
  it('shows exercise details and calls onClose', () => {
    const onClose = jest.fn();
    render(<ExerciseInfoModal open exercise={exercise} onClose={onClose} />);
    expect(screen.getByText('Bench')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});