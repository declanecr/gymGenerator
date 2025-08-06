import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreateExercisePage from './CreateExercisePage';
import { useCreateCustomExercise } from '../../hooks/catalog/useCreateCustomExercise';
import { useCreateDefaultExercise } from '../../hooks/catalog/useCreateDefaultExercise';
import { useGetMe } from '../../hooks/users/useGetMe';
import { DeviceProvider } from '../../context/DeviceProvider';

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

jest.mock('../../hooks/users/useGetMe', () => ({
  useGetMe: jest.fn(),
}));

jest.mock('../../hooks/catalog/useCreateCustomExercise');
jest.mock('../../hooks/catalog/useCreateDefaultExercise');
const mockCustom = jest.fn();
const mockDefault = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  mockCustom.mockReset();
  mockDefault.mockReset();
});

function renderPage(role: string = 'USER') {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  (useGetMe as jest.Mock).mockReturnValue({ data: { role }, isLoading: false });
  (useCreateCustomExercise as jest.Mock).mockReturnValue({ mutateAsync: mockCustom, isLoading: false, isError: false, isPending: false });
  (useCreateDefaultExercise as jest.Mock).mockReturnValue({ mutateAsync: mockDefault, isLoading: false, isError: false, isPending: false });  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <DeviceProvider>
          <CreateExercisePage />
        </DeviceProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}
describe('Create both types of exercises',()=>{
  test('submits form data for normal user', async () => {
    renderPage('USER');
    const user = userEvent.setup();
    await act(async () => {
      await user.type(screen.getByLabelText(/name/i), 'Curl');
      await user.type(screen.getByLabelText(/description/i), 'Bicep curl');
      await user.type(screen.getByLabelText(/muscle/i), 'Biceps');
      await user.type(screen.getByLabelText(/equipment/i), 'Dumbbell');
      await user.click(screen.getByRole('button', { name: /create/i }));
    });
    expect(mockCustom).toHaveBeenCalledWith({ name: 'Curl', description: 'Bicep curl', primaryMuscle: 'Biceps', equipment: 'Dumbbell' });
    expect(mockDefault).not.toHaveBeenCalled();
  });

  test('submits default exercise for admin', async () => {
    renderPage('ADMIN');
    const user = userEvent.setup();
    await act(async () => {
      await user.type(screen.getByLabelText(/name/i), 'Curl');
      await user.type(screen.getByLabelText(/description/i), 'Bicep curl');
      await user.type(screen.getByLabelText(/muscle/i), 'Biceps');
      await user.type(screen.getByLabelText(/equipment/i), 'Dumbbell');
      await user.click(screen.getByRole('button', { name: /create/i }));
    });
    expect(mockDefault).toHaveBeenCalledWith({ name: 'Curl', description: 'Bicep curl', primaryMuscle: 'Biceps', equipment: 'Dumbbell' });
    expect(mockCustom).not.toHaveBeenCalled();
  });
});