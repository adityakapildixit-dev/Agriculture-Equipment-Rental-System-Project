import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import { ROLES } from './utils/permissions'

import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Farmers from './pages/Farmers'
import Owners from './pages/Owners'
import Machinery from './pages/Machinery'
import Bookings from './pages/Bookings'
import BookAndPay from './pages/BookAndPay'
import Payments from './pages/Payments'
import Maintenances from './pages/Maintenances'
import Invoices from './pages/Invoices'
import Unauthorized from './pages/Unauthorized'
import NotFound from './pages/NotFound'

function PublicOnly({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
      <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />

        <Route path="/machinery" element={<Machinery />} />
        <Route
          path="/book-machinery"
          element={
            <ProtectedRoute allow={[ROLES.ADMIN, ROLES.FARMER]}>
              <BookAndPay />
            </ProtectedRoute>
          }
        />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/invoices" element={<Invoices />} />

        <Route
          path="/maintenances"
          element={
            <ProtectedRoute allow={[ROLES.ADMIN, ROLES.OWNER]}>
              <Maintenances />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmers"
          element={
            <ProtectedRoute allow={[ROLES.ADMIN, ROLES.OWNER]}>
              <Farmers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owners"
          element={
            <ProtectedRoute allow={[ROLES.ADMIN, ROLES.OWNER]}>
              <Owners />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
