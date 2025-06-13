// src/api/__tests__/CreateWorkoutContainer.test.tsx
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CreateWorkoutContainer from '../../components/forms/CreateWorkoutContainer';
import { server } from '../../mocks/server';
import { http } from 'msw';
import userEvent from '@testing-library/user-event'

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => jest.fn() };   // mock nav
});
describe('CreateWorkoutContainer (integration)', () => {
  beforeEach(() => {
    server.use(
      // Stub GET for template-workouts with hyphen
      http.get('http://localhost:3000/api/v1/template-workouts', async () => {
        return new Response(
          JSON.stringify([
            { id: 'T1', name: 'Template One' },
            { id: 'T2', name: 'Template Two' },
          ]),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }),
      // Stub POST for creating a workout, casting dto to object
      http.post('http://localhost:3000/api/v1/workouts', async ({ request }) => {
        const dto = (await request.json()) as { workoutTemplateId?: string, name: string, notes?: string | null };
        return new Response(
          JSON.stringify({
            id: 'NEW123',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...dto,
            workoutExercises: [],
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
  });

  it('loads templates, submits form, and shows success Snackbar', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={['/workouts/new']}>
          <Routes>
            <Route path="/workouts/new" element={<CreateWorkoutContainer />} />
            <Route path="/workouts/:id" element={<div>detail</div>}/>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // 1) Wait for the select combobox to be ready
    const select = await screen.findByRole('combobox', { name: /template/i });
    // 2) Open the dropdown and choose "Template One"
    await act(async ()=>{
      await userEvent.click(select);
    });
    await act(async()=>{
      await userEvent.click(await screen.findByRole('option', { name: /template one/i }));
    });
    // 3) Type name into workout name field
    await act(async () => {
      await userEvent.type(await screen.getByLabelText(/workout name/i), "Test Workout");
    });
    // 4) Submit the form
    await act(async()=>{
      await userEvent.click(screen.getByRole('button', { name: /create workout/i }));
    });
    // 5) Assert success snackbar appears
    expect(await screen.findByText(/workout created!/i)).toBeInTheDocument();
  });
});
