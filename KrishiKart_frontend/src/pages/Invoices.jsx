import React, { useEffect, useState } from 'react'
import invoicesApi from '../api/invoices'
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
import { TextField, SelectField } from '../components/FormField'
import { IconPlus } from '../components/icons'

const EMPTY_FORM = { bookingId: '', invoiceDate: '', totalAmount: '', gst: '', discount: '', finalAmount: '' }

export default function Invoices() {
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
      const [invRes, bookingsRes] = await Promise.all([invoicesApi.getAll(), bookingsApi.getAll()])
      setBookings(bookingsRes.data)
      setRows(invRes.data.map((i) => ({ ...i, id: i.invoiceId })))
    } catch (err) {
      setError('Could not load invoices. ' + (err.response?.data || err.message))
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
      bookingId: row.bookingId, invoiceDate: row.invoiceDate, totalAmount: row.totalAmount,
      gst: row.gst, discount: row.discount, finalAmount: row.finalAmount,
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleChange = (e) => {
    const next = { ...form, [e.target.name]: e.target.value }
    // Keep finalAmount in sync as a convenience -- still editable by hand.
    const total = Number(next.totalAmount) || 0
    const gst = Number(next.gst) || 0
    const discount = Number(next.discount) || 0
    if (['totalAmount', 'gst', 'discount'].includes(e.target.name)) {
      next.finalAmount = (total + gst - discount).toFixed(2)
    }
    setForm(next)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    const payload = {
      ...form,
      bookingId: Number(form.bookingId),
      totalAmount: Number(form.totalAmount),
      gst: Number(form.gst),
      discount: Number(form.discount),
      finalAmount: Number(form.finalAmount),
    }
    try {
      if (editing) {
        await invoicesApi.update(editing.invoiceId, payload)
      } else {
        await invoicesApi.create(payload)
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      setFormError(err.response?.data?.title || err.response?.data || 'Could not save this invoice.')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await invoicesApi.remove(deleteTarget.invoiceId)
      setDeleteTarget(null)
      await load()
    } catch (err) {
      setError('Could not delete this invoice. ' + (err.response?.data || err.message))
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'bookingId', label: 'Booking', render: (r) => bookingLabel(r.bookingId) },
    { key: 'invoiceDate', label: 'Date' },
    { key: 'totalAmount', label: 'Total', render: (r) => `₹${r.totalAmount}` },
    { key: 'gst', label: 'GST', render: (r) => `₹${r.gst}` },
    { key: 'discount', label: 'Discount', render: (r) => `₹${r.discount}` },
    { key: 'finalAmount', label: 'Final amount', render: (r) => `₹${r.finalAmount}` },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Billing"
        title="Invoices"
        description="Generated bills for completed and ongoing bookings."
        action={can(role, 'invoices', 'create') && (
          <button onClick={openCreate} className="btn-accent"><IconPlus /> New invoice</button>
        )}
      />
      <ErrorBanner message={error} />
      {loading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <EmptyState title="No invoices yet" description="Invoices generated for bookings will show up here." />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Search…"
          onEdit={can(role, 'invoices', 'edit') ? openEdit : undefined}
          onDelete={can(role, 'invoices', 'delete') ? (row) => setDeleteTarget(row) : undefined}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit invoice' : 'New invoice'} wide>
        <ErrorBanner message={formError} />
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <SelectField
              label="Booking" name="bookingId" value={form.bookingId} onChange={handleChange} required
              options={bookings.map((b) => ({ value: b.bookingId, label: `#${b.bookingId} · ${b.farmerName} · ${b.machineryName}` }))}
            />
          </div>
          <TextField label="Invoice date" name="invoiceDate" type="date" value={form.invoiceDate} onChange={handleChange} required />
          <TextField label="Total amount (₹)" name="totalAmount" type="number" step="0.01" value={form.totalAmount} onChange={handleChange} required />
          <TextField label="GST (₹)" name="gst" type="number" step="0.01" value={form.gst} onChange={handleChange} required />
          <TextField label="Discount (₹)" name="discount" type="number" step="0.01" value={form.discount} onChange={handleChange} required />
          <TextField label="Final amount (₹)" name="finalAmount" type="number" step="0.01" value={form.finalAmount} onChange={handleChange} required />
          <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save invoice'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        message="Delete this invoice? This can't be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </div>
  )
}
