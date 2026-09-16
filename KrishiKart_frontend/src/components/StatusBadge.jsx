import React from 'react'

// Generic status pill -- colors chosen by loose keyword match so it works
// across BookingStatus, PaymentStatus, AvailabilityStatus, Maintenance Status.
const TONES = {
  green: 'bg-moss-100 text-moss-700',
  amber: 'bg-harvest-100 text-harvest-800',
  red: 'bg-red-100 text-red-700',
  slate: 'bg-moss-50 text-moss-500',
}

function toneFor(value) {
  const v = (value || '').toLowerCase()
  if (['available', 'completed', 'paid', 'confirmed', 'active', 'resolved'].some((k) => v.includes(k))) return 'green'
  if (['pending', 'in progress', 'under maintenance', 'ongoing', 'due'].some((k) => v.includes(k))) return 'amber'
  if (['cancelled', 'rejected', 'failed', 'overdue', 'unavailable'].some((k) => v.includes(k))) return 'red'
  return 'slate'
}

export default function StatusBadge({ value }) {
  if (!value) return <span className="text-moss-300 text-sm">—</span>
  return <span className={`badge ${TONES[toneFor(value)]}`}>{value}</span>
}
