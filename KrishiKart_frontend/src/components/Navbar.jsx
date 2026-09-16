import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { IconMenu, IconLogout, IconChevronDown } from './icons'

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const initials = (user?.username || '?').slice(0, 2).toUpperCase()

  return (
    <header className="h-16 shrink-0 border-b border-moss-100 bg-white/90 backdrop-blur px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-moss-700 hover:text-moss-900 -ml-1 p-1.5"
          aria-label="Open menu"
        >
          <IconMenu />
        </button>
        <p className="font-display text-sm text-moss-500">
          Welcome back, <span className="text-moss-900 font-semibold">{user?.username}</span>
        </p>
      </div>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 hover:bg-moss-50 transition"
        >
          <span className="h-8 w-8 rounded-full bg-moss-700 text-white text-xs font-semibold flex items-center justify-center">
            {initials}
          </span>
          <span className="hidden sm:block text-sm font-medium text-moss-800">{user?.username}</span>
          <IconChevronDown className="text-moss-400" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-moss-100 bg-white shadow-lg py-1 z-20">
            <div className="px-3 py-2 border-b border-moss-100">
              <p className="text-sm font-medium text-moss-900 truncate">{user?.username}</p>
              <p className="text-xs text-moss-500">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <IconLogout />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
