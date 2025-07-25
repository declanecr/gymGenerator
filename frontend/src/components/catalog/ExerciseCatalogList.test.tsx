import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseCatalogList } from './ExerciseCatalogList';

jest.mock('../../hooks/catalog/useFilteredExercise', () => ({
  useFilteredExercises: () => ({
    filtered: [
      { id: 1, name: 'Bench', primaryMuscle: 'Chest' }
    ],
    isLoading: false,
    error: null
  })
}));

describe('ExerciseCatalogList', () => {
  it('handles select and add', () => {
    const onSelect = jest.fn();
    const onAdd = jest.fn();
    render(<ExerciseCatalogList onSelect={onSelect} onAdd={onAdd} />);
    const item = screen.getByText('Bench').closest('li') as HTMLElement;
    fireEvent.mouseEnter(item);
    const addBtn = item.querySelector('button') as HTMLButtonElement;
    fireEvent.click(addBtn);
    expect(onAdd).toHaveBeenCalledWith({ id: 1, name: 'Bench', primaryMuscle: 'Chest' });
    fireEvent.click(item);
    expect(onSelect).toHaveBeenCalledWith({ id: 1, name: 'Bench', primaryMuscle: 'Chest' });
  });
});