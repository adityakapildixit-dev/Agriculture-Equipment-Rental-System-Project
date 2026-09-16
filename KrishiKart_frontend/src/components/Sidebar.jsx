import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { canView, ROLES } from '../utils/permissions'
import {
  IconDashboard, IconFarmer, IconOwner, IconMachine, IconBooking,
  IconPayment, IconMaintenance, IconInvoice, IconLeaf, IconCart,
} from './icons'

const NAV = [
  { to: '/', label: 'Dashboard', icon: IconDashboard, entity: null },
  { to: '/machinery', label: 'Machinery', icon: IconMachine, entity: 'machinery' },
  { to: '/book-machinery', label: 'Book & Pay', icon: IconCart, roles: [ROLES.ADMIN, ROLES.FARMER] },
  { to: '/bookings', label: 'Bookings', icon: IconBooking, entity: 'bookings' },
  { to: '/payments', label: 'Payments', icon: IconPayment, entity: 'payments' },
  { to: '/invoices', label: 'Invoices', icon: IconInvoice, entity: 'invoices' },
  { to: '/maintenances', label: 'Maintenance', icon: IconMaintenance, entity: 'maintenances' },
  { to: '/farmers', label: 'Farmers', icon: IconFarmer, entity: 'farmers' },
  { to: '/owners', label: 'Owners', icon: IconOwner, entity: 'owners' },
]

export default function Sidebar({ open, onClose }) {
  const { role, user } = useAuth()
  const items = NAV.filter((item) => {
    if (item.roles) return item.roles.includes(role)
    return !item.entity || canView(role, item.entity)
  })

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-moss-950/40 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-64 shrink-0 bg-moss-900 text-moss-50
        flex flex-col transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-moss-800/80">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-harvest-500 text-moss-950">
            <IconLeaf />
          </span>
          <div className="leading-tight">
            <p className="font-display font-semibold text-[15px] tracking-tight">KrishiKart</p>
            <p className="text-[11px] text-moss-300 -mt-0.5">Equipment Rental</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition
                 ${isActive
                   ? 'bg-moss-800 text-white'
                   : 'text-moss-200 hover:bg-moss-800/60 hover:text-white'}`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-moss-800/80 text-xs text-moss-300">
          <p className="text-moss-100 font-medium">{user?.username}</p>
          <p className="mt-0.5 inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-harvest-400" />
            {user?.role}
          </p>
        </div>
      </aside>
    </>
  )
}
