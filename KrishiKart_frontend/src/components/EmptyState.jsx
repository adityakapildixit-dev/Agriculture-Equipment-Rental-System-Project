import React from 'react'

export default function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="text-center py-16 px-6 border border-dashed border-moss-200 rounded-xl bg-moss-50/50">
      <p className="font-display text-base font-semibold text-moss-800">{title}</p>
      {description && <p className="text-sm text-moss-500 mt-1 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
