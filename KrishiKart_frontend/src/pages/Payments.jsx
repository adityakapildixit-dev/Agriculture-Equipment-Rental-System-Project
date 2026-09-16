import React, { useEffect, useState } from 'react'
import paymentsApi from '../api/payments'
import bookingsApi from '../api/bookings'
import { useAuth } from '../context/AuthContext'
import { can } from '../utils/permissions'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import ErrorBanner from '../components/ErrorBanner'
import StatusBadge from '../components/StatusBadge'
import { TextField, SelectField } from '../components/FormField'
import { IconPlus } from '../components/icons'

const EMPTY_FORM = { bookingId: '', paymentDate: '', amount: '', paymentMethod: '', paymentStatus: '', transactionId: '' }
const METHOD_OPTIONS = ['Cash', 'UPI', 'Bank Transfer', 'Debit Card', 'Credit Card'].map((m) => ({ value: m, label: m }))
const STATUS_OPTIONS = ['Pending', 'Paid', 'Failed', 'Refunded'].map((s) => ({ value: s, label: s }))

export default function Payments() {
  const { role } = useAuth()
  const [rows, setRows] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const bookingLabel = (id) => {
    const b = bookings.find((x) => x.bookingId === id)
    return b ? `#${b.bookingId} · ${b.farmerName} · ${b.machineryName}` : `#${id}`
  }

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [paymentsRes, bookingsRes] = await Promise.all([paymentsApi.getAll(), bookingsApi.getAll()])
      setBookings(bookingsRes.data)
      setRows(paymentsRes.data.map((p) => ({ ...p, id: p.paymentId })))
    } catch (err) {
      setError('Could not load payments. ' + (err.response?.data || err.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({
      bookingId: row.bookingId, paymentDate: row.paymentDate, amount: row.amount,
      paymentMethod: row.paymentMethod, paymentStatus: row.paymentStatus, transactionId: row.transactionId,
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    const payload = { ...form, bookingId: Number(form.bookingId), amount: Number(form.amount) }
    if (editing) payload.paymentId = editing.paymentId
    try {
      if (editing) {
        await paymentsApi.update(editing.paymentId, payload)
      } else {
        await paymentsApi.create(payload)
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      setFormError(err.response?.data?.title || err.response?.data || 'Could not save this payment.')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await paymentsApi.remove(deleteTarget.paymentId)
      setDeleteTarget(null)
      await load()
    } catch (err) {
      setError('Could not delete this payment. ' + (err.response?.data || err.message))
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'bookingId', label: 'Booking', render: (r) => bookingLabel(r.bookingId) },
    { key: 'paymentDate', label: 'Date' },
    { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount}` },
    { key: 'paymentMethod', label: 'Method' },
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'paymentStatus', label: 'Status', render: (r) => <StatusBadge value={r.paymentStatus} /> },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Money"
        title="Payments"
        description="Payments made against each rental booking."
        action={can(role, 'payments', 'create') && (
          <button onClick={openCreate} className="btn-accent"><IconPlus /> Record payment</button>
        )}
      />
      <ErrorBanner message={error} />
      {loading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <EmptyState title="No payments recorded" description="Payments made against bookings will show up here." />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Search by transaction ID, method…"
          searchKeys={['transactionId', 'paymentMethod', 'paymentStatus']}
          onEdit={can(role, 'payments', 'edit') ? openEdit : undefined}
          onDelete={can(role, 'payments', 'delete') ? (row) => setDeleteTarget(row) : undefined}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit payment' : 'Record payment'} wide>
        <ErrorBanner message={formError} />
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <SelectField
              label="Booking" name="bookingId" value={form.bookingId} onChange={handleChange} required
              options={bookings.map((b) => ({ value: b.bookingId, label: `#${b.bookingId} · ${b.farmerName} · ${b.machineryName}` }))}
            />
          </div>
          <TextField label="Payment date" name="paymentDate" type="date" value={form.paymentDate} onChange={handleChange} required />
          <TextField label="Amount (₹)" name="amount" type="number" value={form.amount} onChange={handleChange} required />
          <SelectField label="Method" name="paymentMethod" value={form.paymentMethod} onChange={handleChange} required options={METHOD_OPTIONS} />
          <SelectField label="Status" name="paymentStatus" value={form.paymentStatus} onChange={handleChange} required options={STATUS_OPTIONS} />
          <div className="sm:col-span-2">
            <TextField label="Transaction ID" name="transactionId" value={form.transactionId} onChange={handleChange} required />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save payment'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        message="Delete this payment record? This can't be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </div>
  )
}
