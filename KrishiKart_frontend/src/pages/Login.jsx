import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import ErrorBanner from '../components/ErrorBanner'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      const dest = location.state?.from?.pathname || '/'
      navigate(dest, { replace: true })
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Invalid username or password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in to your account"
      description="Admins, equipment owners and farmers all sign in here — your role decides what you'll see next."
      footer={
        <>Don't have an account?{' '}
          <Link to="/register" className="text-moss-800 font-semibold hover:underline">
            Register
          </Link>
        </>
      }
    >
      <ErrorBanner message={error} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="field-label" htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            autoFocus
            placeholder="e.g. ramesh_owner"
            className="field-input"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-moss-700" htmlFor="password">Password</label>
            <Link to="/forgot-password" className="text-xs font-semibold normal-case text-moss-600 hover:text-harvest-600">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="field-input"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-accent w-full mt-2">
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  )
}
