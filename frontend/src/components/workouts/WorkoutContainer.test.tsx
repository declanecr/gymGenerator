// src/components/workout/WorkoutContainer.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WorkoutContainer } from './WorkoutContainer'
import { WorkoutFormValues } from '../forms/types'

jest.mock('../../hooks/catalog/useExercisesCatalog', () => ({
  useExercisesCatalog: () => ({
    data: [{ exerciseId: 1, name: 'Mock', primaryMuscle: 'Chest' }],
    isLoading: false,
    error: null,
  }),
}))

function renderWithClient(initial: WorkoutFormValues, onSubmit = jest.fn()) {
  const client = new QueryClient()
  render(
    <QueryClientProvider client={client}>
      <WorkoutContainer initialValues={initial} onSubmit={onSubmit} />
    </QueryClientProvider>
  )
  return onSubmit
}

describe('WorkoutContainer validation', () => {
  it('no exercises → shows "Add at least one exercise"', async () => {
    const onSubmit = renderWithClient({ name: 't', notes: '', exercises: [] })
    fireEvent.click(screen.getByText(/finish/i))
    expect(
      await screen.findByText(/add at least one exercise/i)
    ).toBeInTheDocument()                                     // :contentReference[oaicite:8]{index=8}
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('exercise with empty sets → shows "Add at least one set"', async () => {
    const initial = {
      name: 't',
      notes: '',
      exercises: [{ exerciseId: 1, position: 1, sets: [] }],
    }
    const onSubmit = renderWithClient(initial)
    fireEvent.click(screen.getByText(/finish/i))
    expect(
      await screen.findByText(/at least one set/i)
    ).toBeInTheDocument()                                     // :contentReference[oaicite:9]{index=9}
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('blank reps or weight → shows "Expected number, received nan"', async () => {
    const initial = {
      name: 't',
      notes: '',
      exercises: [
        { exerciseId: 1, position: 1, sets: [{ reps: 1, weight: 1, position: 1 }] },
      ],
    }
    const onSubmit = renderWithClient(initial)

    // blank out the reps input
    const repsInput = screen.getByPlaceholderText('Reps')     // :contentReference[oaicite:10]{index=10}
    fireEvent.change(repsInput, { target: { value: '' } })

    // blank out the weight input
    const weightInput = screen.getByPlaceholderText('Weight') // :contentReference[oaicite:11]{index=11}
    fireEvent.change(weightInput, { target: { value: '' } })

    fireEvent.click(screen.getByText(/finish/i))

    // we should see two NaN-type errors
    expect(
      await screen.findAllByText(/expected number, received nan/i)
    ).toHaveLength(2)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('negative weight or reps < 1 → shows range errors', async () => {
    const initial = {
      name: 't',
      notes: '',
      exercises: [
        { exerciseId: 1, position: 1, sets: [{ reps: 1, weight: 1, position: 1 }] },
      ],
    }
    const onSubmit = renderWithClient(initial)

    // set reps → 0
    const repsInput = screen.getByPlaceholderText('Reps')
    fireEvent.change(repsInput, { target: { value: '0' } })

    // set weight → -5
    const weightInput = screen.getByPlaceholderText('Weight')
    fireEvent.change(weightInput, { target: { value: '-5' } })

    fireEvent.click(screen.getByText(/finish/i))

    // adjust these matchers to your Zod messages
    expect(
      await screen.findByText(/reps must be at least 1/i)
    ).toBeInTheDocument()
    expect(
      await screen.findByText(/weight cannot be negative/i)
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('valid data → onSubmit is called', async () => {
    const initial = {
      name: 't',
      notes: '',
      exercises: [
        { exerciseId: 1, position: 1, sets: [{ reps: 1, weight: 1, position: 1 }] },
      ],
    }
    const onSubmit = renderWithClient(initial)
    fireEvent.click(screen.getByText(/finish/i))
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
  })

  it('prevents submit when name is blank', async () => {
    const initial = {
      name: 't',
      notes: '',
      exercises: [
        { exerciseId: 1, position: 1, sets: [{ reps: 1, weight: 1, position: 1 }] },
      ],
    }
    const onSubmit = renderWithClient(initial)
    fireEvent.click(screen.getAllByRole('button', { name: /edit/i })[0])
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    fireEvent.click(screen.getByText(/finish/i))
    await waitFor(() => expect(onSubmit).not.toHaveBeenCalled())
  })
})
