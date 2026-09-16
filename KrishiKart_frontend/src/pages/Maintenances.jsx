import React, { useEffect, useState } from 'react'
import maintenancesApi from '../api/maintenances'
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
import { TextField, SelectField, TextAreaField } from '../components/FormField'
import { IconPlus } from '../components/icons'

const EMPTY_FORM = { machineryId: '', maintenanceDate: '', issueDescription: '', cost: '', nextServiceDate: '', status: '' }
const STATUS_OPTIONS = ['Scheduled', 'In Progress', 'Completed'].map((s) => ({ value: s, label: s }))

export default function Maintenances() {
  const { role } = useAuth()
  const [rows, setRows] = useState([])
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
      const [maintRes, machineRes] = await Promise.all([maintenancesApi.getAll(), machineryApi.getAll()])
      setMachines(machineRes.data)
      setRows(maintRes.data.map((m) => ({ ...m, id: m.maintenanceId })))
    } catch (err) {
      setError('Could not load maintenance records. ' + (err.response?.data || err.message))
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
      machineryId: row.machineryId, maintenanceDate: row.maintenanceDate, issueDescription: row.issueDescription,
      cost: row.cost, nextServiceDate: row.nextServiceDate, status: row.status,
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    const payload = { ...form, machineryId: Number(form.machineryId), cost: Number(form.cost) }
    try {
      if (editing) {
        await maintenancesApi.update(editing.maintenanceId, payload)
      } else {
        await maintenancesApi.create(payload)
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      setFormError(err.response?.data?.title || err.response?.data || 'Could not save this record.')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await maintenancesApi.remove(deleteTarget.maintenanceId)
      setDeleteTarget(null)
      await load()
    } catch (err) {
      setError('Could not delete this record. ' + (err.response?.data || err.message))
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'machineryName', label: 'Machine' },
    { key: 'issueDescription', label: 'Issue' },
    { key: 'maintenanceDate', label: 'Serviced' },
    { key: 'nextServiceDate', label: 'Next service' },
    { key: 'cost', label: 'Cost', render: (r) => `₹${r.cost}` },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge value={r.status} /> },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Upkeep"
        title="Maintenance"
        description="Service history and upcoming maintenance for every machine."
        action={can(role, 'maintenances', 'create') && (
          <button onClick={openCreate} className="btn-accent"><IconPlus /> Log maintenance</button>
        )}
      />
      <ErrorBanner message={error} />
      {loading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <EmptyState title="No maintenance records" description="Servicing history for machinery will show up here." />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Search by machine, issue…"
          searchKeys={['machineryName', 'issueDescription', 'status']}
          onEdit={can(role, 'maintenances', 'edit') ? openEdit : undefined}
          onDelete={can(role, 'maintenances', 'delete') ? (row) => setDeleteTarget(row) : undefined}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit record' : 'Log maintenance'} wide>
        <ErrorBanner message={formError} />
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <SelectField
              label="Machine" name="machineryId" value={form.machineryId} onChange={handleChange} required
              options={machines.map((m) => ({ value: m.machineryId, label: m.machineName }))}
            />
          </div>
          <TextField label="Maintenance date" name="maintenanceDate" type="date" value={form.maintenanceDate} onChange={handleChange} required />
          <TextField label="Next service date" name="nextServiceDate" type="date" value={form.nextServiceDate} onChange={handleChange} required />
          <TextField label="Cost (₹)" name="cost" type="number" value={form.cost} onChange={handleChange} required />
          <SelectField label="Status" name="status" value={form.status} onChange={handleChange} required options={STATUS_OPTIONS} />
          <div className="sm:col-span-2">
            <TextAreaField label="Issue description" name="issueDescription" value={form.issueDescription} onChange={handleChange} required />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save record'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        message="Delete this maintenance record? This can't be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </div>
  )
}
