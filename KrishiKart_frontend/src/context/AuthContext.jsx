import React, { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../api/auth'

const AuthContext = createContext(null)

// AuthController's AuthResponseDto already hands back { userId, username,
// role, token, expiresAt } directly -- no JWT decoding needed on our side.
function loadStoredUser() {
  const raw = localStorage.getItem('agri_user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser)
  const navigate = useNavigate()

  const persistSession = (data) => {
    // data: AuthResponseDto shape { userId, username, role, token, expiresAt }
    localStorage.setItem('agri_token', data.token)
    localStorage.setItem('agri_user', JSON.stringify(data))
    setUser(data)
  }

  const login = useCallback(async (credentials) => {
    const { data } = await loginUser(credentials)
    persistSession(data)
    return data
  }, [])

  const register = useCallback(async (payload) => {
    const { data } = await registerUser(payload)
    persistSession(data)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('agri_token')
    localStorage.removeItem('agri_user')
    setUser(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const value = {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
