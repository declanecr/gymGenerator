import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from './AdminPage';
import { useAllWorkouts } from '../../hooks/workouts/useAllWorkouts';
import { useGetMe } from '../../hooks/users/useGetMe';
import { DeviceProvider } from '../../context/DeviceProvider';

jest.mock('../../hooks/workouts/useAllWorkouts', () => ({
  useAllWorkouts: jest.fn(),
}));

jest.mock('../../hooks/users/useGetMe', () => ({
  useGetMe: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
  (useGetMe as jest.Mock).mockReturnValue({ data: { role: 'ADMIN' }, isLoading: false });
  (useAllWorkouts as jest.Mock).mockReturnValue({
    data: [
      { id: '1', name: 'One' },
      { id: '2', name: 'Two' },
    ],
    isLoading: false,
    error: null,
  });
});
function renderPage() {
  const qc = new QueryClient();
  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <DeviceProvider>
          <AdminPage />
        </DeviceProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

test('lists workouts returned from hook', () => {
  renderPage();
  expect(screen.getByText('One')).toBeInTheDocument();
  expect(screen.getByText('Two')).toBeInTheDocument();
});

test('shows loading indicator', () => {
  (useAllWorkouts as jest.Mock).mockReturnValue({ data: null, isLoading: true, error: null });
  renderPage();
  expect(screen.getByTestId('loading')).toBeInTheDocument();
});

test('shows error message', () => {
  (useAllWorkouts as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: new Error('err') });
  renderPage();
  expect(screen.getByText(/failed to load workouts/i)).toBeInTheDocument();
});

test('redirects non-admin users', () => {
  (useGetMe as jest.Mock).mockReturnValue({ data: { role: 'USER' }, isLoading: false });
  renderPage();
  expect(screen.queryByText('One')).not.toBeInTheDocument();
});