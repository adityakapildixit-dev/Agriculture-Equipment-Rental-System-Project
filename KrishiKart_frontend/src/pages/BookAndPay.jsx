import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import machineryApi from '../api/machinery'
import farmersApi from '../api/farmers'
import bookingsApi from '../api/bookings'
import { createRazorpayOrder, verifyRazorpayPayment } from '../api/razorpay'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import ErrorBanner from '../components/ErrorBanner'
import EmptyState from '../components/EmptyState'
import { SelectField, TextField } from '../components/FormField'
import { IconBooking, IconInvoice, IconPayment } from '../components/icons'

function daysBetween(start, end) {
  if (!start || !end) return 0
  const ms = new Date(end) - new Date(start)
  const days = Math.round(ms / (1000 * 60 * 60 * 24)) + 1 // inclusive of both ends
  return days > 0 ? days : 0
}

const STEP = { FORM: 'form', BOOKED: 'booked', PAID: 'paid' }

export default function BookAndPay() {
  const [machines, setMachines] = useState([])
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [form, setForm] = useState({ farmerId: '', machineryId: '', rentalStartDate: '', rentalEndDate: '' })
  const [formError, setFormError] = useState('')
  const [creatingBooking, setCreatingBooking] = useState(false)

  const [step, setStep] = useState(STEP.FORM)
  const [booking, setBooking] = useState(null)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const [invoice, setInvoice] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setLoadError('')
      try {
        const [machineRes, farmerRes] = await Promise.all([machineryApi.getAll(), farmersApi.getAll()])
        setMachines(machineRes.data.filter((m) => m.availabilityStatus === 'Available'))
        setFarmers(farmerRes.data)
      } catch (err) {
        setLoadError('Could not load machinery. ' + (err.response?.data || err.message))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const selectedMachine = machines.find((m) => m.machineryId === Number(form.machineryId))
  const days = useMemo(() => daysBetween(form.rentalStartDate, form.rentalEndDate), [form.rentalStartDate, form.rentalEndDate])
  const totalAmount = selectedMachine ? selectedMachine.dailyRate * days : 0

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCreateBooking = async (e) => {
    e.preventDefault()
    setFormError('')
    if (days <= 0) {
      setFormError('Rental end date must be on or after the start date.')
      return
    }
    setCreatingBooking(true)
    try {
      const { data } = await bookingsApi.create({
        farmerId: Number(form.farmerId),
        machineryId: Number(form.machineryId),
        bookingDate: new Date().toISOString().slice(0, 10),
        rentalStartDate: form.rentalStartDate,
        rentalEndDate: form.rentalEndDate,
        totalAmount,
        bookingStatus: 'Pending',
      })
      setBooking(data)
      setStep(STEP.BOOKED)
    } catch (err) {
      setFormError(err.response?.data?.title || err.response?.data || 'Could not create the booking.')
    } finally {
      setCreatingBooking(false)
    }
  }

  const handlePay = async () => {
    setPayError('')
    setPaying(true)
    try {
      const { data: order } = await createRazorpayOrder(booking.bookingId)

      if (typeof window.Razorpay === 'undefined') {
        setPayError('Payment widget failed to load. Check your internet connection and try again.')
        setPaying(false)
        return
      }

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amountInPaise,
        currency: order.currency,
        name: 'KrishiKart',
        description: `${booking.machineryName} · ${booking.rentalStartDate} to ${booking.rentalEndDate}`,
        order_id: order.orderId,
        theme: { color: '#5f8a41' },
        handler: async (response) => {
          try {
            const { data: result } = await verifyRazorpayPayment({
              bookingId: booking.bookingId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            setInvoice(result)
            setStep(STEP.PAID)
          } catch (err) {
            setPayError(err.response?.data || 'Payment succeeded but verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id)
          } finally {
            setPaying(false)
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      })
      razorpay.on('payment.failed', (resp) => {
        setPayError(resp.error?.description || 'Payment failed. Please try again.')
        setPaying(false)
      })
      razorpay.open()
    } catch (err) {
      setPayError(err.response?.data || 'Could not start the payment. Please try again.')
      setPaying(false)
    }
  }

  const startOver = () => {
    setForm({ farmerId: '', machineryId: '', rentalStartDate: '', rentalEndDate: '' })
    setBooking(null)
    setInvoice(null)
    setPayError('')
    setStep(STEP.FORM)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Rent & pay"
        title="Book machinery"
        description="Pick a machine, choose your rental dates, and pay securely with Razorpay. Your invoice is generated automatically once payment succeeds."
      />
      <ErrorBanner message={loadError} />

      {loading ? (
        <Spinner />
      ) : step === STEP.FORM ? (
        machines.length === 0 ? (
          <EmptyState title="No machinery available right now" description="Check back once an owner lists an available machine." />
        ) : (
          <div className="card p-5 max-w-xl">
            <ErrorBanner message={formError} />
            <form onSubmit={handleCreateBooking} className="space-y-4">
              <SelectField
                label="Farmer" name="farmerId" value={form.farmerId} onChange={handleChange} required
                options={farmers.map((f) => ({ value: f.farmerId, label: f.fullName }))}
              />
              <SelectField
                label="Machine" name="machineryId" value={form.machineryId} onChange={handleChange} required
                options={machines.map((m) => ({ value: m.machineryId, label: `${m.machineName} · ₹${m.dailyRate}/day` }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <TextField label="Rental start" name="rentalStartDate" type="date" value={form.rentalStartDate} onChange={handleChange} required />
                <TextField label="Rental end" name="rentalEndDate" type="date" value={form.rentalEndDate} onChange={handleChange} required />
              </div>

              {selectedMachine && days > 0 && (
                <div className="rounded-lg bg-moss-50 border border-moss-100 px-4 py-3 text-sm text-moss-700 flex items-center justify-between">
                  <span>{days} day{days > 1 ? 's' : ''} × ₹{selectedMachine.dailyRate}</span>
                  <span className="font-display text-lg font-semibold text-moss-950">₹{totalAmount}</span>
                </div>
              )}

              <button type="submit" disabled={creatingBooking} className="btn-primary w-full">
                {creatingBooking ? 'Creating booking…' : 'Continue to payment'}
              </button>
            </form>
          </div>
        )
      ) : step === STEP.BOOKED ? (
        <div className="card p-6 max-w-xl">
          <div className="flex items-center gap-2 text-moss-600 mb-4">
            <IconBooking />
            <span className="text-sm font-semibold uppercase tracking-wide">Booking created</span>
          </div>
          <h3 className="font-display text-xl font-semibold text-moss-950 mb-1">{booking.machineryName}</h3>
          <p className="text-sm text-moss-500 mb-4">{booking.rentalStartDate} to {booking.rentalEndDate}</p>
          <div className="rounded-lg bg-moss-50 border border-moss-100 px-4 py-3 flex items-center justify-between mb-5">
            <span className="text-sm text-moss-600">Amount to pay</span>
            <span className="font-display text-xl font-semibold text-moss-950">₹{booking.totalAmount}</span>
          </div>
          <ErrorBanner message={payError} />
          <button onClick={handlePay} disabled={paying} className="btn-accent w-full">
            <IconPayment /> {paying ? 'Opening payment window…' : 'Pay with Razorpay'}
          </button>
          <button onClick={startOver} className="btn-ghost w-full mt-2">Start over</button>
        </div>
      ) : (
        <div className="card p-6 max-w-xl">
          <div className="flex items-center gap-2 text-moss-600 mb-4">
            <IconInvoice />
            <span className="text-sm font-semibold uppercase tracking-wide">Payment successful — invoice generated</span>
          </div>
          <h3 className="font-display text-xl font-semibold text-moss-950 mb-4">{booking.machineryName}</h3>

          <div className="divide-y divide-moss-100 text-sm mb-5">
            <div className="flex justify-between py-2"><span className="text-moss-500">Rental amount</span><span className="text-moss-800">₹{invoice.totalAmount}</span></div>
            <div className="flex justify-between py-2"><span className="text-moss-500">GST</span><span className="text-moss-800">₹{invoice.gst}</span></div>
            <div className="flex justify-between py-2"><span className="text-moss-500">Discount</span><span className="text-moss-800">−₹{invoice.discount}</span></div>
            <div className="flex justify-between py-2.5"><span className="font-semibold text-moss-900">Final amount paid</span><span className="font-display text-lg font-semibold text-moss-950">₹{invoice.finalAmount}</span></div>
          </div>

          <div className="flex gap-2">
            <Link to="/invoices" className="btn-primary flex-1 justify-center">View invoices</Link>
            <button onClick={startOver} className="btn-ghost flex-1">Book another</button>
          </div>
        </div>
      )}
    </div>
  )
}
