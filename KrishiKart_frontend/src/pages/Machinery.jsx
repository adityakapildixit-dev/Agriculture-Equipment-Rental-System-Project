import React, { useEffect, useState } from 'react'
import machineryApi from '../api/machinery'
import ownersApi from '../api/owners'
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
import { TextField, SelectField, TextAreaField } from '../components/FormField'
import { IconPlus } from '../components/icons'

const EMPTY_FORM = { ownerId: '', machineName: '', brand: '', dailyRate: '', availabilityStatus: '', description: '' }
const STATUS_OPTIONS = [
  { value: 'Available', label: 'Available' },
  { value: 'Rented', label: 'Rented' },
  { value: 'Under Maintenance', label: 'Under Maintenance' },
]

export default function Machinery() {
  const { role } = useAuth()
  const [rows, setRows] = useState([])
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const ownerName = (id) => owners.find((o) => o.ownerId === id)?.ownerName || `#${id}`

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [machineRes, ownerRes] = await Promise.all([machineryApi.getAll(), ownersApi.getAll()])
      setOwners(ownerRes.data)
      setRows(machineRes.data.map((m) => ({ ...m, id: m.machineryId })))
    } catch (err) {
      setError('Could not load machinery. ' + (err.response?.data || err.message))
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
      ownerId: row.ownerId, machineName: row.machineName, brand: row.brand,
      dailyRate: row.dailyRate, availabilityStatus: row.availabilityStatus,
      description: row.description,
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    const payload = { ...form, ownerId: Number(form.ownerId), dailyRate: Number(form.dailyRate) }
    try {
      if (editing) {
        await machineryApi.update(editing.machineryId, payload)
      } else {
        await machineryApi.create(payload)
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      setFormError(err.response?.data?.title || err.response?.data || 'Could not save this machine.')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await machineryApi.remove(deleteTarget.machineryId)
      setDeleteTarget(null)
      await load()
    } catch (err) {
      setError('Could not delete this machine. ' + (err.response?.data || err.message))
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'machineName', label: 'Machine' },
    { key: 'brand', label: 'Brand' },
    { key: 'dailyRate', label: 'Daily rate', render: (r) => `₹${r.dailyRate}` },
    { key: 'ownerId', label: 'Owner', render: (r) => ownerName(r.ownerId) },
    { key: 'availabilityStatus', label: 'Status', render: (r) => <StatusBadge value={r.availabilityStatus} /> },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Fleet"
        title="Machinery"
        description="Tractors, tillers and every other machine listed for rent."
        action={can(role, 'machinery', 'create') && (
          <button onClick={openCreate} className="btn-accent"><IconPlus /> Add machine</button>
        )}
      />
      <ErrorBanner message={error} />
      {loading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <EmptyState title="No machinery listed yet" description="Machines added by owners will appear here." />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Search by machine, brand…"
          searchKeys={['machineName', 'brand', 'availabilityStatus']}
          onEdit={can(role, 'machinery', 'edit') ? openEdit : undefined}
          onDelete={can(role, 'machinery', 'delete') ? (row) => setDeleteTarget(row) : undefined}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit machine' : 'Add machine'} wide>
        <ErrorBanner message={formError} />
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <TextField label="Machine name" name="machineName" value={form.machineName} onChange={handleChange} required />
          <TextField label="Brand" name="brand" value={form.brand} onChange={handleChange} required />
          <TextField label="Daily rate (₹)" name="dailyRate" type="number" value={form.dailyRate} onChange={handleChange} required />
          <SelectField
            label="Owner" name="ownerId" value={form.ownerId} onChange={handleChange} required
            options={owners.map((o) => ({ value: o.ownerId, label: o.ownerName }))}
          />
          <SelectField
            label="Availability" name="availabilityStatus" value={form.availabilityStatus} onChange={handleChange} required
            options={STATUS_OPTIONS}
          />
          <div className="sm:col-span-2">
            <TextAreaField label="Description" name="description" value={form.description} onChange={handleChange} required />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save machine'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Delete ${deleteTarget?.machineName}? This can't be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </div>
  )
}
