// frontend\src\routes\AppRoutes.tsx
import { Routes, Route } from 'react-router-dom'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import PrivateRoute from './PrivateRoute'
import TemplateWorkoutPage from '../pages/TemplateWorkout'
import WorkoutPage from '../pages/Workout'
import { WorkoutContainer } from '../components/forms/workouts/WorkoutContainer'

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"  // overrides default url launched by frontend to open dashboard. which typically will take you straight to /Login
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/workouts/:id"
        element={
          <PrivateRoute>
            <WorkoutPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/template-workouts/:id"
        element={
          <PrivateRoute>
            <TemplateWorkoutPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/workouts/start"
        element={
          <PrivateRoute>
            <WorkoutContainer
              initialValues={{ name: '', notes: '', exercises: [] }}
              onSubmit={data => console.log(data)}
            />
          </PrivateRoute>
        }
      />

    </Routes>

  )
}
