import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Unauthorized() {
  const { role } = useAuth()
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f3ec] px-6">
      <div className="text-center max-w-sm">
        <p className="font-display text-5xl font-semibold text-moss-900 mb-3">403</p>
        <h1 className="font-display text-xl font-semibold text-moss-950 mb-2">You can't access this page</h1>
        <p className="text-sm text-moss-500 mb-6">
          Your account is signed in as <span className="font-semibold text-moss-700">{role}</span>,
          which doesn't have permission to view this section.
        </p>
        <Link to="/" className="btn-primary">Back to dashboard</Link>
      </div>
    </div>
  )
}
