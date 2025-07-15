#testing #frontend 

- **LoginForm** – `frontend/src/components/auth/__tests__/LoginForm.test.tsx`
    
    - `shows validation error on invalid input then submits successfully`

- **RegisterForm** – `frontend/src/components/auth/__tests__/RegisterForm.test.tsx`
    
    - `shows validation errors then submits successfully`

- **TemplateWorkoutContainer** – `frontend/src/components/template-workouts/TemplateWorkoutContainer.test.tsx`
    
    - `shows error when submitting without exercises`
        
    - `blank reps or weight → shows "Expected number, received nan"`
        
    - `negative weight or reps < 1 → shows range errors`
        
    - `calls onSubmit with valid data`

- **WorkoutContainer** – `frontend/src/components/workouts/WorkoutContainer.test.tsx`
    
    - `no exercises → shows "Add at least one exercise"`
        
    - `exercise with empty sets → shows "Add at least one set"`
        
    - `blank reps or weight → shows "Expected number, received nan"`
        
    - `negative weight or reps < 1 → shows range errors`
        
    - `valid data → onSubmit is called`
        
- **sets API** – `frontend/src/api/__tests__/sets.test.ts`
    
    - `createWorkoutSet calls POST /workouts/:workoutId/exercises/:exerciseId/sets and returns data`
        
    - `updateWorkoutSet calls PATCH /workouts/:workoutId/exercises/:exerciseId/sets/:id and returns data`
        
    - `deleteWorkoutSet calls DELETE /workouts/:workoutId/exercises/:exerciseId/sets/:id`
        
- **templateWorkouts API** – `frontend/src/api/__tests__/templateWorkouts.test.ts`
    
    - `fetchWorkout calls GET /template-workouts/:id and returns data`
        
    - `listTemplateWorkouts calls GET /template-workouts and returns array`
        
- **WorkoutsList component** – `frontend/src/api/__tests__/WorkoutsList.test.tsx`
    
    - `WorkoutsList fetches and displays workouts`
        
- **exercises API** – `frontend/src/api/__tests__/exercises.test.ts`
    
    - `createWorkoutExercise calls POST /workouts/:workoutId/exercises and returns data`
        
    - `updateWorkoutExercise calls PATCH /workouts/:workoutId/exercises/:id and returns data`
        
    - `deleteWorkoutExercise calls DELETE /workouts/:workoutId/exercises/:id`
        
- **workouts API** – `frontend/src/api/__tests__/workouts.test.ts`
    
    - `getWorkout calls GET /workouts/:id and returns data`
        
    - `fetchWorkouts calls GET /workouts and returns array`
        
    - `POSTs to /workout with correct body and returns Workout`
        
    - `PATCHs to /workout/:id and returns updated workout`
        
    - `deleteWorkout calls DELETE /workouts/:id`
        
- **workoutSchema** – `frontend/src/schemas/__tests__/workoutSchema.test.ts`
    
    - `allows valid workout data`
        
    - `rejects workout with no exercises`
        
- **templateWorkoutSchema** – `frontend/src/schemas/__tests__/templateWorkoutSchema.test.ts`
    
    - `valid template passes`
        
    - `fails when name is empty`