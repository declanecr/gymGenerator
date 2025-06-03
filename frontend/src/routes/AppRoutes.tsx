import { Routes, Route } from 'react-router-dom'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />   
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}
