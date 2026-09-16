import axios from 'axios'

// vite.config.js proxies "/api" straight to the ASP.NET Core backend in dev.
// VITE_API_BASE_URL is only used as a fallback (e.g. a production build
// served from a different origin than the API).
const baseURL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api'

const api = axios.create({ baseURL })

// Attach the JWT (issued by AuthController) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agri_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the token is missing/expired, the backend's [Authorize] returns 401 --
// bounce back to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('agri_token')
      localStorage.removeItem('agri_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
