import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreateExercisePage from './CreateExercisePage';
import { useCreateCustomExercise } from '../hooks/catalog/useCreateCustomExercise';

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

jest.mock('../hooks/users/useGetMe', () => ({
  useGetMe: () => ({ data: { name: 'test' } }),
}));

jest.mock('../hooks/catalog/useCreateCustomExercise');
const mockMutate = jest.fn();

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  (useCreateCustomExercise as jest.Mock).mockReturnValue({ mutateAsync: mockMutate, isLoading: false, isError: false });
  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <CreateExercisePage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

test('submits form data', async () => {
  renderPage();
  const user = userEvent.setup();
  await act(async () => {
    await user.type(screen.getByLabelText(/name/i), 'Curl');
    await user.type(screen.getByLabelText(/description/i), 'Bicep curl');
    await user.type(screen.getByLabelText(/muscle/i), 'Biceps');
    await user.type(screen.getByLabelText(/equipment/i), 'Dumbbell');
    await user.click(screen.getByRole('button', { name: /create/i }));
  });
  expect(mockMutate).toHaveBeenCalledWith({ name: 'Curl', description: 'Bicep curl', primaryMuscle: 'Biceps', equipment: 'Dumbbell' });
});