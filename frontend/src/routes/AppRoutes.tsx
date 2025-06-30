// frontend\src\routes\AppRoutes.tsx
import { Routes, Route } from 'react-router-dom'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import PrivateRoute from './PrivateRoute'
import TemplateWorkoutPage from '../pages/TemplateWorkoutPage'
import WorkoutPage from '../pages/WorkoutPage'

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

      
      

    </Routes>

  )
}
