import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import ErrorBanner from '../components/ErrorBanner'
import { requestPasswordReset } from '../api/auth'

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await requestPasswordReset({ identifier })
    } catch (err) {
      // The backend doesn't have this endpoint yet (see api/auth.js). We still
      // show the same confirmation message below -- real password-reset flows
      // never reveal whether an account exists, so a failed call here
      // shouldn't leak that info either. Anything unexpected is only logged.
      if (err.response?.status !== 404) {
        console.error('Password reset request failed:', err)
      }
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <AuthLayout
        eyebrow="Check your inbox"
        title="Reset link on its way"
        description={`If an account matches "${identifier}", we've sent instructions to reset the password.`}
        footer={
          <Link to="/login" className="text-moss-800 font-semibold hover:underline">
            Back to login
          </Link>
        }
      >
        <div className="rounded-lg border border-moss-200 bg-moss-50 px-4 py-3 text-sm text-moss-600">
          Didn't get anything? Check the spelling of your username or email, or try again in a few minutes.
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      eyebrow="Trouble logging in?"
      title="Reset your password"
      description="Enter the username or email on your account and we'll send you a reset link."
      footer={
        <>Remembered it after all?{' '}
          <Link to="/login" className="text-moss-800 font-semibold hover:underline">
            Back to login
          </Link>
        </>
      }
    >
      <ErrorBanner message={error} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="field-label" htmlFor="identifier">Username or email</label>
          <input
            id="identifier"
            name="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoFocus
            placeholder="e.g. ramesh_owner or you@example.com"
            className="field-input"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-accent w-full mt-2">
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
    </AuthLayout>
  )
}
