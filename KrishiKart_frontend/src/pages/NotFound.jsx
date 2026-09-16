import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f3ec] px-6">
      <div className="text-center max-w-sm">
        <p className="font-display text-5xl font-semibold text-moss-900 mb-3">404</p>
        <h1 className="font-display text-xl font-semibold text-moss-950 mb-2">Page not found</h1>
        <p className="text-sm text-moss-500 mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Back to dashboard</Link>
      </div>
    </div>
  )
}
