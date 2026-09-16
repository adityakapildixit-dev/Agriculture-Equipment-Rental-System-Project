import React from 'react'
import Modal from './Modal'

export default function ConfirmDialog({ open, title = 'Are you sure?', message, onConfirm, onCancel, busy }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-moss-600">{message}</p>
      <div className="flex justify-end gap-2 mt-6">
        <button className="btn-ghost" onClick={onCancel} disabled={busy}>Cancel</button>
        <button className="btn bg-red-600 text-white hover:bg-red-700" onClick={onConfirm} disabled={busy}>
          {busy ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </Modal>
  )
}
