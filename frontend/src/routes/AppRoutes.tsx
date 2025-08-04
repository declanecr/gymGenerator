// frontend\src\routes\AppRoutes.tsx
import { Routes, Route } from 'react-router-dom'

import Login from '../pages/login/Login'
import Register from '../pages/register/Register'
import Dashboard from '../pages/dashboard/Dashboard'
import PrivateRoute from './PrivateRoute'
import TemplateWorkoutPage from '../pages/TemplateWorkoutPage'
import WorkoutPage from '../pages/WorkoutPage'
import AdminPage from '../pages/admin/AdminPage'
import CreateExercisePage from '../pages/create-exercise/CreateExercisePage'
import ProgressPage from '../pages/ProgressPage'
import UserPage from '../pages/user/UserPage'

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
        path="/progress"
        element={
          <PrivateRoute>
            <ProgressPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/user"
        element={
          <PrivateRoute>
            <UserPage />
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
        path='/create-exercise'
        element={
          <PrivateRoute>
            <CreateExercisePage />
          </PrivateRoute>
        }
      />
      
      <Route 
        path='/admin'
        element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        }
      />

    </Routes>

  )
}
