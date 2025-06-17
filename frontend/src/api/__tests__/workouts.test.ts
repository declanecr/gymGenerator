
import api from '../axios';
import { fetchWorkouts, getWorkout, createWorkout, updateWorkout, deleteWorkout } from '../workouts';

// provide a manual mock so api.get actually exists
jest.mock('../axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),      // <-- our spy
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    // you can add post, put, etc. here as needed
  },
}))
const mockedApi = api as jest.Mocked<typeof api>


describe('workouts API', () => {
  test('getWorkout calls GET /workouts/:id and returns data', async () => {
    // Arrange: prepare a fake workout object to return -- shape it like your Workout interface
    const workout = {
      id: 'XYZ',
      createdAt: '2025-06-09T00:00:00.000Z',
      updatedAt: '2025-06-09T00:00:00.000Z',
      workoutTemplateId: null,
      name: 'testWorkout',
      notes: ' ',
      workoutExercises: [],
    }

    // Stub the api.get to resolve with { data: workout }
    mockedApi.get.mockResolvedValueOnce({ data: workout })

    // Act -- call getworkout with a specific ID
    const result = await getWorkout('XYZ')

    // Assert: that api.get was called with the correct URL... (i.e. to the correct endpoint)
    expect(mockedApi.get).toHaveBeenCalledWith('/workouts/XYZ')
    // …and that you return exactly the .data payload
    expect(result).toEqual(workout)
  })

  test('fetchWorkouts calls GET /workouts and returns array', async () => {
    // Create a fake array of workouts
    const workouts = [
      { id: 'A', createdAt: '…', updatedAt: '…', workoutTemplateId: null, name: 'testNameA', notes: ' ', workoutExercises: [] },
      { id: 'B', createdAt: '…', updatedAt: '…', workoutTemplateId: null, name: 'testNameB', notes: ' ', workoutExercises: [] },
    ];
    //stub the GET method to resolve with {data: workouts }
    mockedApi.get.mockResolvedValueOnce({ data: workouts })

    //called fetchWorkouts
    const result = await fetchWorkouts()

    //Assert: ensure GET was called on the correct endpoint
    expect(mockedApi.get).toHaveBeenCalledWith('/workouts')
    //Assert: ensure the helped returns the workouts array
    expect(result).toEqual(workouts)
  })

  it ('POSTs to /workout with correct body and returns Workout', async () =>{
    // Arrange: build a payload matching CreateWorkoutDto
    const dto={
      workoutTemplateId: 'TEMPLATE123',
      name: 'testWorkout',
      notes: ' ',
    };
    // Define the fake workout that the server should respond with
    const newWorkout = {
      data: { id: 'NEW1', 
        createdAt: '…', 
        updatedAt: '…', 
        workoutTemplateId: 'TEMPLATE123', 
        name: 'testWorkout',
        notes: ' ',
        workoutExercises: [] }
    };

    //Stub the POST method to resolve with {data: newWorkout}
    mockedApi.post.mockResolvedValueOnce(newWorkout);

    // Act: call createWorkout with the DTO
    const result = await createWorkout(dto);
    
    // Assert: ensure POST was called with the correct endpoint and payload
    expect(mockedApi.post).toHaveBeenCalledWith('/workouts', dto);
    // Assert: ensure the helper returns the created workout
    expect(result).toEqual(newWorkout.data);
  })

  it ('PATCHs to /workout/:id and returns updated workout', async () =>{
    // Arrange: define the DTO to send when updating a workout, by building a payload matching UpdateWorkoutDto
    const dto={
      workoutTemplateId: 'UPDATED_TEMPLATE',
      name: 'testName',
      notes: 'notes',
    };

    // Define the fake updated workout that the server would respond with
    const updatedWorkout = {
      data: { id: 'XYZ', 
        createdAt: '…', 
        updatedAt: '…', 
        workoutTemplateId: 'UPDATED_TEMPLATE', 
        name: 'testName',
        notes: 'notes',
        workoutExercises: [] }
    };
    mockedApi.patch.mockResolvedValueOnce({ data: updatedWorkout.data});

    // Act: call updateWorkout with the ID and DTO
    const result = await updateWorkout('XYZ', dto)

    // Assert: ensure PATCH was called with the correct endpoint and payload
    expect(mockedApi.patch).toHaveBeenCalledWith('/workouts/XYZ', dto);
    // Assert: ensure the helper returns the updated workout
    expect(result).toEqual(updatedWorkout.data)

  })
  
  // Test for the deleteWorkout helper
  it('deleteWorkout calls DELETE /workouts/:id', async () => {
    // Arrange: stub the DELETE method to resolve successfully
    mockedApi.delete.mockResolvedValueOnce({});

    // Act: call deleteWorkout with the ID
    await deleteWorkout('XYZ');

    // Assert: ensure DELETE was called with the correct endpoint
    expect(mockedApi.delete).toHaveBeenCalledWith('/workouts/XYZ');
  });
})

