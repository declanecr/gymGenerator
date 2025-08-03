// TemplateWorkoutPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TemplateWorkoutPage from '../pages/TemplateWorkoutPage';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DeviceProvider } from '../context/DeviceProvider';

/* ------------------------------------------------------------------ */
/* 🔧 core-query mocks (workout + exercises + sets)                    */
/* ------------------------------------------------------------------ */
jest.mock('../hooks/templateWorkouts/useGetTemplateWorkout', () => ({
  useGetTemplateWorkout: () => ({
    data: { id: 'tpl1', name: 'T', notes: '', userId: null }, // ⬅️ global template
    isLoading: false,
    error: null,
  }),
}));
jest.mock('../hooks/templateExercises/useTemplateExercises', () => ({
  useTemplateExercises: () => ({
    data: [{ templateExerciseId: 'ex1', exerciseId: 123, position: 1 }],
    isLoading: false,
    error: null,
  }),
}));
jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    ...actual,
    useQueries: (arg: { queries: unknown[] } | unknown[]) =>
      (Array.isArray(arg) ? arg : arg.queries).map(() => ({
        data: [],
        isLoading: false,
        error: null,
      })),
  };
});
jest.mock('../hooks/users/useGetMe', () => ({
  useGetMe: () => ({ data: { role: 'USER' }, isLoading: false, error: null }),
}));
jest.mock('../hooks/catalog/useExercisesCatalog', () => ({
  useExercisesCatalog: () => ({
    data: [{ exerciseId: 123, name: 'Bench Press', primaryMuscle: 'Chest' }],
    isLoading: false,
    error: null,
  }),
}));

/* ------------------------------------------------------------------ */
/* 🔧 mutation spies used in <TemplateWorkoutPage/>                    */
/* ------------------------------------------------------------------ */
export const createTplSpy = jest.fn().mockResolvedValue({ id: 'newTpl' });
jest.mock('../hooks/templateWorkouts/useCreateTemplateWorkout', () => ({
  useCreateTemplateWorkout: () => ({ mutateAsync: createTplSpy }),
}));
export const createWkFromTplSpy = jest.fn().mockResolvedValue({ id: 'newWorkout' });
jest.mock('../hooks/workouts/useCreateFromTemplate', () => ({
  useCreateWorkoutFromTemplate: () => ({ mutateAsync: createWkFromTplSpy }),
}));

/* helpers called when we clone templates */
jest.mock('../api/templateWorkouts', () => ({
  fetchTemplateSets: jest.fn().mockResolvedValue([]),
  createTemplateExercise: jest.fn().mockResolvedValue({
    templateExerciseId: 'ex-new',
    exerciseId: 123,
    position: 1,
  }),
  createTemplateSet: jest.fn().mockResolvedValue({
    id: 'set-new',
    reps: 12,
    weight: 0,
    position: 1,
  }),
}));

/* --------------------------------------------------------------------- */
/* 🔧 DTOs and spies for “createWorkoutFromData” path (confirm NO)       */
/* --------------------------------------------------------------------- */


export const createWorkoutSpy = jest.fn().mockResolvedValue({ id: 'newWorkout' });
jest.mock('../api/workouts', () => ({
  createWorkout: (...args: []) => createWorkoutSpy(...args),
}));
export const createWorkoutExerciseSpy = jest
  .fn()
  .mockResolvedValue({ workoutExerciseId: 'we1' });
jest.mock('../api/exercises', () => ({
  createWorkoutExercise: (...args: unknown[]) => createWorkoutExerciseSpy(...args),
}));
export const createWorkoutSetSpy = jest.fn().mockResolvedValue({ id: 'ws1' });
jest.mock('../api/sets', () => ({
  createWorkoutSet: (...args: unknown[]) => createWorkoutSetSpy(...args),
}));

/* ------------------------------------------------------------------ */
/* 🔧 navigation helper                                                */
/* ------------------------------------------------------------------ */
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

/* ------------------------------------------------------------------ */
/* 🧪 render util                                                      */
/* ------------------------------------------------------------------ */
function renderWithProviders() {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/template-workouts/tpl1']}>
        <DeviceProvider>
          <Routes>
            <Route path="/template-workouts/:id" element={<TemplateWorkoutPage />} />
          </Routes>
        </DeviceProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

/* ------------------------------------------------------------------ */
/* 🧪 test cases                                                       */
/* ------------------------------------------------------------------ */
describe('TemplateWorkoutPage – saving a global template', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ① edit + Start + YES → template & workout cloned ---------------- */
  it('edits global template + Start → YES confirms → clones tpl + wk & navigates', async () => {
    renderWithProviders();

    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());
    await screen.findByText(/bench press/i);

    fireEvent.click(screen.getByRole('button', { name: /add set/i }));
    fireEvent.change(await screen.findByPlaceholderText(/reps/i), {
      target: { value: '12' },
    });

    jest.spyOn(window, 'confirm').mockReturnValueOnce(true);
    fireEvent.click(screen.getByText(/start this workout/i));

    await waitFor(() => {
      expect(createTplSpy).toHaveBeenCalled();
      expect(createWkFromTplSpy).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/workouts/newWorkout');
    });
  });

  /* ② plain Start (no edits) → ONLY workout cloned ------------------ */
  it('plain “Start this workout” (no edits) → only a workout is created', async () => {
    renderWithProviders();
    await screen.findByText(/bench press/i);

    const confirmSpy = jest.spyOn(window, 'confirm');

    fireEvent.click(screen.getByText(/start this workout/i));

    await waitFor(() => {
      expect(createTplSpy).not.toHaveBeenCalled();
      expect(createWkFromTplSpy).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/workouts/newWorkout');
      expect(confirmSpy).not.toHaveBeenCalled();
    });
  });

  /* ③ edit + Finish → NEW user template only ----------------------- */
  it('edit template, press “Finish” → clones to NEW user template only', async () => {
    renderWithProviders();
    await screen.findByText(/bench press/i);

    fireEvent.click(screen.getByRole('button', { name: /edit name/i }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Name' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    fireEvent.click(screen.getByRole('button', { name: /finish/i }));

    await waitFor(() => {
      expect(createTplSpy).toHaveBeenCalled(); // new tpl
      expect(createWkFromTplSpy).not.toHaveBeenCalled();
    });
  });

  /* ④ NEW – edit + Start + NO → ONLY workout cloned ---------------- */
  it('edit template, press “Start”, confirm NO → clones workout only', async () => {
    renderWithProviders();
    await screen.findByText(/bench press/i);

    fireEvent.click(screen.getByRole('button', { name: /add set/i }));
    fireEvent.change(await screen.findByPlaceholderText(/reps/i), {
      target: { value: '12' },
    });

    jest.spyOn(window, 'confirm').mockReturnValueOnce(false); // user chooses “No”
    fireEvent.click(screen.getByText(/start this workout/i));

    await waitFor(() => {
      expect(createTplSpy).not.toHaveBeenCalled();           // ⛔ no template clone
      expect(createWkFromTplSpy).not.toHaveBeenCalled();     // ⛔ no clone-from-tpl
      expect(createWorkoutSpy).toHaveBeenCalled();           // ✅ direct workout creation
      expect(mockNavigate).toHaveBeenCalledWith('/workouts/newWorkout');
    });
  });




});
