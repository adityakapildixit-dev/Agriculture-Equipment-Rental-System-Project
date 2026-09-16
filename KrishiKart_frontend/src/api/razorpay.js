import api from './axios'

// Mirrors the new RazorpayController: POST /api/Razorpay/create-order and
// POST /api/Razorpay/verify
export const createRazorpayOrder = (bookingId) =>
  api.post('/Razorpay/create-order', { bookingId })

export const verifyRazorpayPayment = (payload) =>
  api.post('/Razorpay/verify', payload)
