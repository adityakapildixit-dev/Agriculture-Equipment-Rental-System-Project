import React from 'react'

export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wider text-harvest-600 mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-semibold text-moss-950">{title}</h2>
        {description && <p className="text-sm text-moss-500 mt-1 max-w-2xl">{description}</p>}
      </div>
      {action}
    </div>
  )
}
