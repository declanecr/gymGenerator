//Unit tests for templateWorkouts

import api from '../axios';
import { getTemplateWorkout, fetchTemplateWorkouts } from '../templateWorkouts';

// provide a manual mock so api.get actually exists
jest.mock('../axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),      // <-- our spy
    // you can add post, put, etc. here as needed
  },
}))
const mockedApi = api as jest.Mocked<typeof api>

describe('templateWorkouts API', () => {
  test('fetchWorkout calls GET /template-workouts/:id and returns data', async () => {
    // Arrange: shape it like your Workout interface
    const templateWorkout = {
      id: 'XYZ',
      name: 'ABC',
      createdAt: '2025-06-09T00:00:00.000Z',
      updatedAt: '2025-06-09T00:00:00.000Z',
      templateExercises: [],
    }
    // Stub the api.get to resolve with { data: workout }
    mockedApi.get.mockResolvedValueOnce({ data: templateWorkout })

    // Act
    const result = await getTemplateWorkout('XYZ')

    // Assert: that api.get was called with the correct URL…
    expect(mockedApi.get).toHaveBeenCalledWith('/template-workouts/XYZ')
    // …and that you return exactly the .data payload
    expect(result).toEqual(templateWorkout)
  })

  test('listTemplateWorkouts calls GET /template-workouts and returns array', async () => {
    const templateWorkouts = [
      { id: 'A', name: 'AB', createdAt: '…', updatedAt: '…',  templateWorkoutExercises: [] },
      { id: 'B', name: 'BC', createdAt: '…', updatedAt: '…',  templateWorkoutExercises: [] },
    ]
    mockedApi.get.mockResolvedValueOnce({ data: templateWorkouts })

    const result = await fetchTemplateWorkouts()

    expect(mockedApi.get).toHaveBeenCalledWith('/template-workouts')
    expect(result).toEqual(templateWorkouts)
  })
})

/*
export interface TemplateWorkout {
  id: string
  name: string
  notes?: string | null
  createdAt: string
  updatedAt: string
  templateExercises?: TemplateExercise[]
}
  */