import api from './axios'

// Generic REST resource helper -- every controller in the backend
// (Farmers, Owners, Machinery, Bookings, Payments, Maintenances, Invoices)
// exposes the same GET / GET:id / POST / PUT:id / DELETE:id shape.
const makeResource = (basePath) => ({
  getAll: () => api.get(basePath),
  getById: (id) => api.get(`${basePath}/${id}`),
  create: (data) => api.post(basePath, data),
  update: (id, data) => api.put(`${basePath}/${id}`, data),
  remove: (id) => api.delete(`${basePath}/${id}`),
})

export default makeResource
