``` mermaid
flowchart TD
    Main["main.tsx"]
    Main --> AuthProvider
    AuthProvider --> QueryClientProvider
    QueryClientProvider --> App["App.tsx"]
    App --> Routes["AppRoutes"]

    Routes -->|public| LoginPage["Login.tsx"]
    Routes -->|public| RegisterPage["Register.tsx"]
    Routes -->|private| Dashboard
    Routes -->|private| WorkoutPage
    Routes -->|private| TemplateWorkoutPage
    Routes -->|private| AdminPage

    Dashboard --> StartWorkoutModal
    Dashboard --> StartTemplateModal
    AdminPage --> StartGlobalTemplateModal

    WorkoutPage --> WorkoutContainer --> WorkoutForm --> ExerciseFields
    TemplateWorkoutPage --> TemplateWorkoutContainer --> TemplateWorkoutForm --> ExerciseFields

```
---
``` mermaid
flowchart TD
  A[App.tsx]
  B[AuthProvider]
  C[BrowserRouter]
  D[AppRoutes]

  A --> B --> C --> D

  subgraph Routes
    D -->|Private| Dashboard
    D --> Login
    D --> Register
    D -->|Private| WorkoutPage
    D -->|Private| TemplateWorkoutPage
    D -->|Private| AdminPage
  end

  subgraph Dashboard
    Dashboard --> StartWorkoutModal --> StartNamedModal
    Dashboard --> StartTemplateModal --> StartNamedModal
    Dashboard --> WorkoutPage
    Dashboard --> TemplateWorkoutPage
    Dashboard --> AdminPage
  end

  subgraph WorkoutPage
    WorkoutPage --> WorkoutContainer --> WorkoutForm --> ExerciseFields
    ExerciseFields --> ExerciseInfoModal
    WorkoutForm --> WorkoutInfoEditable
  end

  subgraph TemplateWorkoutPage
    TemplateWorkoutPage --> TemplateWorkoutContainer --> TemplateWorkoutForm --> ExerciseFields
    TemplateWorkoutForm --> TemplateWorkoutInfoEditable
  end

  AdminPage --> StartGlobalTemplateModal --> StartNamedModal

  Login --> LoginForm
  Register --> RegisterForm

```
---
``` mermaid
flowchart TD
  %% Application bootstrap
  main["main.tsx"] -->|wraps| authProvider["AuthProvider"]
  authProvider -->|wraps| queryClient["QueryClientProvider"]
  queryClient -->|renders| app["App.tsx"]

  %% Routing
  app --> router["BrowserRouter"]
  router --> routes["AppRoutes.tsx"]

  %% Routes guarded by PrivateRoute
  routes -->|/login| loginPage["Login.tsx"]
  loginPage --> loginForm["LoginForm.tsx"]
  routes -->|/register| registerPage["Register.tsx"]
  registerPage --> registerForm["RegisterForm.tsx"]

  routes -->|/dashboard| privDash["PrivateRoute"]
  privDash --> dashboard["Dashboard.tsx"]
  dashboard --> startWorkoutModal["StartWorkoutModal.tsx"]
  dashboard --> startTemplateModal["StartTemplateModal.tsx"]

  routes -->|/workouts/:id| privWorkout["PrivateRoute"]
  privWorkout --> workoutPage["WorkoutPage.tsx"]
  workoutPage --> workoutContainer["WorkoutContainer.tsx"]

  routes -->|/template-workouts/:id| privTemplate["PrivateRoute"]
  privTemplate --> templatePage["TemplateWorkoutPage.tsx"]
  templatePage --> templateContainer["TemplateWorkoutContainer.tsx"]

  routes -->|/admin| privAdmin["PrivateRoute"]
  privAdmin --> adminPage["AdminPage.tsx"]
  adminPage --> startGlobalModal["StartGlobalTemplateModal.tsx"]

  %% Component hierarchy within workout editing
  workoutContainer --> workoutForm["WorkoutForm.tsx"]
  workoutForm --> exerciseFields["ExerciseFields.tsx"]
  templateContainer --> templateForm["TemplateWorkoutForm.tsx"]
  templateForm --> templateInfo["TemplateWorkoutInfoEditable.tsx"]

  %% Shared modal component
  startWorkoutModal --> namedModal["StartNamedModal.tsx"]
  startTemplateModal --> namedModal
  startGlobalModal --> namedModal

```
---
``` mermaid
flowchart TD
  subgraph Boot
    Main["main.tsx"] --> AuthProvider --> QueryClientProvider --> App
  end
  App --> BrowserRouter --> Routes[AppRoutes]

  Routes -->|"/login"| LoginPage
  Routes -->|"/register"| RegisterPage
  Routes -->|"/"| PrivateRoute1
  PrivateRoute1 --> Dashboard
  Routes -->|"/dashboard"| PrivateRoute2
  PrivateRoute2 --> Dashboard
  Routes -->|"/workouts/:id"| PrivateRoute3
  PrivateRoute3 --> WorkoutPage
  Routes -->|"/template-workouts/:id"| PrivateRoute4
  PrivateRoute4 --> TemplateWorkoutPage
  Routes -->|"/admin"| PrivateRoute5
  PrivateRoute5 --> AdminPage

  Dashboard --> StartWorkoutModal
  Dashboard --> StartTemplateModal

  WorkoutPage --> WorkoutContainer --> WorkoutForm --> ExerciseFields
  TemplateWorkoutPage --> TemplateWorkoutContainer --> TemplateWorkoutForm --> ExerciseFields

```
---
