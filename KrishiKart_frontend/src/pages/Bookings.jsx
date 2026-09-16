import React, { useEffect, useState } from 'react'
import bookingsApi from '../api/bookings'
import farmersApi from '../api/farmers'
import machineryApi from '../api/machinery'
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

const EMPTY_FORM = {
  farmerId: '', machineryId: '', bookingDate: '', rentalStartDate: '',
  rentalEndDate: '', totalAmount: '', bookingStatus: '',
}
const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Ongoing', 'Completed', 'Cancelled']
  .map((s) => ({ value: s, label: s }))

export default function Bookings() {
  const { role } = useAuth()
  const [rows, setRows] = useState([])
  const [farmers, setFarmers] = useState([])
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [bookingsRes, farmersRes, machineryRes] = await Promise.all([
        bookingsApi.getAll(), farmersApi.getAll(), machineryApi.getAll(),
      ])
      setFarmers(farmersRes.data)
      setMachines(machineryRes.data)
      setRows(bookingsRes.data.map((b) => ({ ...b, id: b.bookingId })))
    } catch (err) {
      setError('Could not load bookings. ' + (err.response?.data || err.message))
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
      farmerId: row.farmerId, machineryId: row.machineryId, bookingDate: row.bookingDate,
      rentalStartDate: row.rentalStartDate, rentalEndDate: row.rentalEndDate,
      totalAmount: row.totalAmount, bookingStatus: row.bookingStatus,
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    const payload = {
      ...form,
      farmerId: Number(form.farmerId),
      machineryId: Number(form.machineryId),
      totalAmount: Number(form.totalAmount),
    }
    try {
      if (editing) {
        await bookingsApi.update(editing.bookingId, payload)
      } else {
        await bookingsApi.create(payload)
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      setFormError(err.response?.data?.title || err.response?.data || 'Could not save this booking.')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await bookingsApi.remove(deleteTarget.bookingId)
      setDeleteTarget(null)
      await load()
    } catch (err) {
      setError('Could not delete this booking. ' + (err.response?.data || err.message))
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'farmerName', label: 'Farmer' },
    { key: 'machineryName', label: 'Machine' },
    { key: 'rentalStartDate', label: 'Start' },
    { key: 'rentalEndDate', label: 'End' },
    { key: 'totalAmount', label: 'Amount', render: (r) => `₹${r.totalAmount}` },
    { key: 'bookingStatus', label: 'Status', render: (r) => <StatusBadge value={r.bookingStatus} /> },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Rentals"
        title="Bookings"
        description="Every rental request, from first request through to return."
        action={can(role, 'bookings', 'create') && (
          <button onClick={openCreate} className="btn-accent"><IconPlus /> New booking</button>
        )}
      />
      <ErrorBanner message={error} />
      {loading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <EmptyState title="No bookings yet" description="Bookings made by farmers will show up here." />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Search by farmer, machine…"
          searchKeys={['farmerName', 'machineryName', 'bookingStatus']}
          onEdit={can(role, 'bookings', 'edit') ? openEdit : undefined}
          onDelete={can(role, 'bookings', 'delete') ? (row) => setDeleteTarget(row) : undefined}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit booking' : 'New booking'} wide>
        <ErrorBanner message={formError} />
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <SelectField
            label="Farmer" name="farmerId" value={form.farmerId} onChange={handleChange} required
            options={farmers.map((f) => ({ value: f.farmerId, label: f.fullName }))}
          />
          <SelectField
            label="Machine" name="machineryId" value={form.machineryId} onChange={handleChange} required
            options={machines.map((m) => ({ value: m.machineryId, label: m.machineName }))}
          />
          <TextField label="Booking date" name="bookingDate" type="date" value={form.bookingDate} onChange={handleChange} required />
          <TextField label="Total amount (₹)" name="totalAmount" type="number" value={form.totalAmount} onChange={handleChange} required />
          <TextField label="Rental start" name="rentalStartDate" type="date" value={form.rentalStartDate} onChange={handleChange} required />
          <TextField label="Rental end" name="rentalEndDate" type="date" value={form.rentalEndDate} onChange={handleChange} required />
          <SelectField
            label="Status" name="bookingStatus" value={form.bookingStatus} onChange={handleChange} required
            options={STATUS_OPTIONS}
          />
          <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save booking'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Delete this booking for ${deleteTarget?.farmerName}? This can't be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </div>
  )
}
