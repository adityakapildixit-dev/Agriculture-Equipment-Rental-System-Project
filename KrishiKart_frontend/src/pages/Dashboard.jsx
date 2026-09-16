import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { canView } from '../utils/permissions'
import farmersApi from '../api/farmers'
import ownersApi from '../api/owners'
import machineryApi from '../api/machinery'
import bookingsApi from '../api/bookings'
import paymentsApi from '../api/payments'
import maintenancesApi from '../api/maintenances'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import ErrorBanner from '../components/ErrorBanner'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import {
  IconFarmer, IconOwner, IconMachine, IconBooking, IconPayment, IconMaintenance,
} from '../components/icons'

const STAT_DEFS = [
  { entity: 'farmers', label: 'Farmers', icon: IconFarmer, to: '/farmers' },
  { entity: 'owners', label: 'Owners', icon: IconOwner, to: '/owners' },
  { entity: 'machinery', label: 'Machines listed', icon: IconMachine, to: '/machinery' },
  { entity: 'bookings', label: 'Bookings', icon: IconBooking, to: '/bookings' },
  { entity: 'payments', label: 'Payments', icon: IconPayment, to: '/payments' },
  { entity: 'maintenances', label: 'Maintenance jobs', icon: IconMaintenance, to: '/maintenances' },
]

const FETCHERS = {
  farmers: farmersApi, owners: ownersApi, machinery: machineryApi,
  bookings: bookingsApi, payments: paymentsApi, maintenances: maintenancesApi,
}

const ROLE_COPY = {
  Admin: 'Full visibility across farmers, owners, machinery and every transaction on the platform.',
  Owner: "Here's how your listed machinery, bookings and maintenance are tracking.",
  Farmer: 'Browse available machinery and keep an eye on your bookings and payments.',
}

export default function Dashboard() {
  const { user, role } = useAuth()
  const visibleStats = STAT_DEFS.filter((s) => canView(role, s.entity))

  const [counts, setCounts] = useState({})
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const results = await Promise.all(
          visibleStats.map((s) => FETCHERS[s.entity].getAll().then((r) => [s.entity, r.data]))
        )
        if (cancelled) return
        const nextCounts = {}
        let bookingsData = []
        results.forEach(([entity, data]) => {
          nextCounts[entity] = data.length
          if (entity === 'bookings') bookingsData = data
        })
        setCounts(nextCounts)
        setRecentBookings(bookingsData.slice(-5).reverse())
      } catch (err) {
        if (!cancelled) setError('Could not load the dashboard. ' + (err.response?.data || err.message))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role])

  return (
    <div>
      <PageHeader
        eyebrow={`${role} view`}
        title={`Welcome, ${user?.username}`}
        description={ROLE_COPY[role] || 'An overview of the rental system.'}
      />
      <ErrorBanner message={error} />

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {visibleStats.map(({ entity, label, icon: Icon, to }) => (
              <Link
                key={entity}
                to={to}
                className="card p-5 hover:border-harvest-300 hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-moss-50 text-moss-700 group-hover:bg-harvest-100 group-hover:text-harvest-700 transition">
                    <Icon />
                  </span>
                </div>
                <p className="font-display text-2xl font-semibold text-moss-950">{counts[entity] ?? 0}</p>
                <p className="text-sm text-moss-500 mt-0.5">{label}</p>
              </Link>
            ))}
          </div>

          {canView(role, 'bookings') && (
            <div>
              <h3 className="font-display text-base font-semibold text-moss-900 mb-3">Recent bookings</h3>
              {recentBookings.length === 0 ? (
                <EmptyState title="No bookings yet" description="New bookings will appear here as they come in." />
              ) : (
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs font-semibold uppercase tracking-wide text-moss-500 bg-moss-50/70">
                        <th className="px-4 py-3">Farmer</th>
                        <th className="px-4 py-3">Machine</th>
                        <th className="px-4 py-3">Dates</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-moss-100">
                      {recentBookings.map((b) => (
                        <tr key={b.bookingId} className="hover:bg-moss-50/50">
                          <td className="px-4 py-3 text-moss-800">{b.farmerName}</td>
                          <td className="px-4 py-3 text-moss-800">{b.machineryName}</td>
                          <td className="px-4 py-3 text-moss-600">{b.rentalStartDate} → {b.rentalEndDate}</td>
                          <td className="px-4 py-3 text-moss-800">₹{b.totalAmount}</td>
                          <td className="px-4 py-3"><StatusBadge value={b.bookingStatus} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
