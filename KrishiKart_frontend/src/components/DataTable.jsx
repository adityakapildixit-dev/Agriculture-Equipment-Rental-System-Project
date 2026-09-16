import React, { useMemo, useState } from 'react'
import { IconEdit, IconTrash } from './icons'

// Generic table: columns = [{ key, label, render?(row) }]
// rows must each have a unique `id` field.
export default function DataTable({
  columns,
  rows,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  searchPlaceholder = 'Search…',
  searchKeys,
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return rows
    const q = query.toLowerCase()
    const keys = searchKeys || columns.map((c) => c.key)
    return rows.filter((row) =>
      keys.some((k) => String(row[k] ?? '').toLowerCase().includes(q))
    )
  }, [rows, query, searchKeys, columns])

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-moss-100">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="field-input max-w-xs"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-moss-500 bg-moss-50/70">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 whitespace-nowrap">{col.label}</th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-moss-100">
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-moss-50/50 transition">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-moss-800 whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {onEdit && canEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-1.5 rounded-md text-moss-500 hover:text-moss-800 hover:bg-moss-100"
                          aria-label="Edit"
                        >
                          <IconEdit />
                        </button>
                      )}
                      {onDelete && canDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-1.5 rounded-md text-moss-500 hover:text-red-600 hover:bg-red-50"
                          aria-label="Delete"
                        >
                          <IconTrash />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-moss-400 py-10">No matching records.</p>
        )}
      </div>
    </div>
  )
}
