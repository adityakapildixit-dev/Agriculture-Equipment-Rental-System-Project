import React, { useEffect, useState } from 'react'
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
import { TextField } from '../components/FormField'
import { IconPlus } from '../components/icons'

const EMPTY_FORM = { ownerName: '', phone: '', email: '', address: '', bankAccountNo: '' }

export default function Owners() {
  const { role } = useAuth()
  const [rows, setRows] = useState([])
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
      const { data } = await ownersApi.getAll()
      setRows(data.map((o) => ({ ...o, id: o.ownerId, machineryCount: o.machineries?.length ?? 0 })))
    } catch (err) {
      setError('Could not load owners. ' + (err.response?.data || err.message))
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
      ownerName: row.ownerName, phone: row.phone, email: row.email,
      address: row.address, bankAccountNo: row.bankAccountNo,
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      if (editing) {
        await ownersApi.update(editing.ownerId, form)
      } else {
        await ownersApi.create(form)
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      setFormError(err.response?.data?.title || err.response?.data || 'Could not save this owner.')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await ownersApi.remove(deleteTarget.ownerId)
      setDeleteTarget(null)
      await load()
    } catch (err) {
      setError('Could not delete this owner. ' + (err.response?.data || err.message))
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'ownerName', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'bankAccountNo', label: 'Bank account' },
    { key: 'machineryCount', label: 'Machines listed' },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Directory"
        title="Equipment owners"
        description="People who list agricultural machinery for rent."
        action={can(role, 'owners', 'create') && (
          <button onClick={openCreate} className="btn-accent"><IconPlus /> Add owner</button>
        )}
      />
      <ErrorBanner message={error} />
      {loading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <EmptyState title="No owners yet" description="Registered equipment owners will show up here." />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Search by name, email…"
          onEdit={can(role, 'owners', 'edit') ? openEdit : undefined}
          onDelete={can(role, 'owners', 'delete') ? (row) => setDeleteTarget(row) : undefined}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit owner' : 'Add owner'}>
        <ErrorBanner message={formError} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField label="Owner name" name="ownerName" value={form.ownerName} onChange={handleChange} required />
          <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
          <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <TextField label="Address" name="address" value={form.address} onChange={handleChange} required />
          <TextField label="Bank account number" name="bankAccountNo" value={form.bankAccountNo} onChange={handleChange} required />
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save owner'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Delete ${deleteTarget?.ownerName}? This can't be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </div>
  )
}
