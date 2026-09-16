import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import ErrorBanner from '../components/ErrorBanner'
import { SelectField } from '../components/FormField'

const ROLE_OPTIONS = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Owner', label: 'Equipment Owner' },
  { value: 'Farmer', label: 'Farmer' },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', role: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Could not create the account. Please check the details and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      description="Choose the role that matches you — it decides what you can manage once you're in."
      footer={
        <>Already have an account?{' '}
          <Link to="/login" className="text-moss-800 font-semibold hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <ErrorBanner message={error} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="field-label" htmlFor="username">Username</label>
          <input
            id="username" name="username" value={form.username} onChange={handleChange}
            required autoFocus placeholder="e.g. ramesh_owner" className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email" name="email" type="email" value={form.email} onChange={handleChange}
            required placeholder="you@example.com" className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password" name="password" type="password" value={form.password} onChange={handleChange}
            required minLength={6} placeholder="At least 6 characters" className="field-input"
          />
        </div>
        <SelectField
          label="I am a…" name="role" value={form.role} onChange={handleChange}
          options={ROLE_OPTIONS} required
        />
        <button type="submit" disabled={loading} className="btn-accent w-full mt-2">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}
