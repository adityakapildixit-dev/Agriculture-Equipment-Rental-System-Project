import React from 'react'

export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-2.5 py-16 text-moss-500">
      <span className="h-4 w-4 rounded-full border-2 border-moss-300 border-t-harvest-500 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
