import api from './axios'

// Mirrors AuthController: POST /api/auth/register and /api/auth/login
export const registerUser = (payload) => api.post('/auth/register', payload)
export const loginUser = (payload) => api.post('/auth/login', payload)

// NOTE: AuthController does not yet have a "forgot password" endpoint --
// this calls /api/auth/forgot-password so the UI is ready to go the moment
// that endpoint is added on the backend. See ForgotPassword.jsx for how the
// missing-endpoint case is handled in the meantime.
export const requestPasswordReset = (payload) => api.post('/auth/forgot-password', payload)
