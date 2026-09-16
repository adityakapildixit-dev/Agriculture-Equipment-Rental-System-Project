import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wrap any route that needs a logged-in user. Pass `allow` (array of role
// strings) to additionally restrict by role -- otherwise any authenticated
// user is let through.
export default function ProtectedRoute({ children, allow }) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (allow && !allow.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }
  return children
}
