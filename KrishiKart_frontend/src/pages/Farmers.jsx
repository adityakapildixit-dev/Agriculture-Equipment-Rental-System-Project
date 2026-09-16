import React, { useEffect, useState } from 'react'
import farmersApi from '../api/farmers'
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

const EMPTY_FORM = {
  fullName: '', mobileNo: '', email: '', address: '',
  village: '', state: '', aadhaarNo: '', registrationDate: '',
}

export default function Farmers() {
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
      const { data } = await farmersApi.getAll()
      setRows(data.map((f) => ({ ...f, id: f.farmerId })))
    } catch (err) {
      setError('Could not load farmers. ' + (err.response?.data || err.message))
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
      fullName: row.fullName, mobileNo: row.mobileNo, email: row.email,
      address: row.address, village: row.village, state: row.state,
      aadhaarNo: row.aadhaarNo, registrationDate: row.registrationDate,
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
        await farmersApi.update(editing.farmerId, form)
      } else {
        await farmersApi.create(form)
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      setFormError(err.response?.data?.title || err.response?.data || 'Could not save this farmer.')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await farmersApi.remove(deleteTarget.farmerId)
      setDeleteTarget(null)
      await load()
    } catch (err) {
      setError('Could not delete this farmer. ' + (err.response?.data || err.message))
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'fullName', label: 'Name' },
    { key: 'mobileNo', label: 'Mobile' },
    { key: 'email', label: 'Email' },
    { key: 'village', label: 'Village' },
    { key: 'state', label: 'State' },
    { key: 'registrationDate', label: 'Registered' },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Directory"
        title="Farmers"
        description="Everyone registered to rent machinery through the platform."
        action={can(role, 'farmers', 'create') && (
          <button onClick={openCreate} className="btn-accent"><IconPlus /> Add farmer</button>
        )}
      />
      <ErrorBanner message={error} />
      {loading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <EmptyState title="No farmers yet" description="Registered farmers will show up here." />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Search by name, village, mobile…"
          onEdit={can(role, 'farmers', 'edit') ? openEdit : undefined}
          onDelete={can(role, 'farmers', 'delete') ? (row) => setDeleteTarget(row) : undefined}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit farmer' : 'Add farmer'} wide>
        <ErrorBanner message={formError} />
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <TextField label="Full name" name="fullName" value={form.fullName} onChange={handleChange} required />
          <TextField label="Mobile number" name="mobileNo" value={form.mobileNo} onChange={handleChange} required />
          <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <TextField label="Aadhaar number" name="aadhaarNo" value={form.aadhaarNo} onChange={handleChange} required />
          <TextField label="Village" name="village" value={form.village} onChange={handleChange} required />
          <TextField label="State" name="state" value={form.state} onChange={handleChange} required />
          <TextField label="Registration date" name="registrationDate" type="date" value={form.registrationDate} onChange={handleChange} required />
          <div className="sm:col-span-2">
            <TextField label="Address" name="address" value={form.address} onChange={handleChange} required />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" className="btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save farmer'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Delete ${deleteTarget?.fullName}? This can't be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        busy={deleting}
      />
    </div>
  )
}
