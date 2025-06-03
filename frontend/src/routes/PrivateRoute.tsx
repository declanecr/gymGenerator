// This file defines a wrapper around other route's element, not around the route itself
// i.e.: 
// <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { JSX } from 'react'

interface Props {
  children: JSX.Element
}

export default function PrivateRoute({ children }: Props) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace /> //Redirects via `replace` so users can't hit nack and re-enter
  }

  return children
}
