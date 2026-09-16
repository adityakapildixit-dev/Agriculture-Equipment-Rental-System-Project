import React from 'react'
import { IconLeaf } from './icons'

// Shared shell for Login / Register: a single centered column, no side panel.
export default function AuthLayout({ eyebrow, title, description, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f3ec] px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-moss-800 text-harvest-400">
            <IconLeaf />
          </span>
          <span className="font-display font-semibold text-lg text-moss-950 tracking-tight">KrishiKart</span>
        </div>

        <div className="text-center">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-wider text-harvest-600 mb-2">{eyebrow}</p>
          )}
          <h1 className="font-display text-3xl font-semibold text-moss-950 mb-2">{title}</h1>
          {description && <p className="text-sm text-moss-500 mb-8">{description}</p>}
        </div>

        {children}

        {footer && <div className="mt-6 text-sm text-moss-500 text-center">{footer}</div>}
      </div>
    </div>
  )
}
