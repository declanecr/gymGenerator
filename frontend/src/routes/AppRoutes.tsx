import { Routes, Route } from 'react-router-dom'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import PrivateRoute from './PrivateRoute'
import TemplateWorkoutPage from '../pages/TemplateWorkout'
import WorkoutPage from '../pages/Workout'
import CreateWorkoutContainer from '../components/forms/CreateWorkoutContainer'

export default function AppRoutes() {
  return (
    <Routes>
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

      <Route path="/workouts/new" element={<PrivateRoute><CreateWorkoutContainer /></PrivateRoute>} />

    </Routes>

  )
}
