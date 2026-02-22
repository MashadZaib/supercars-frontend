import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { useBookingsStorage, getBookingsList, getBookingLabel, getBookingStatus, createEmptyBooking } from '../hooks/useBookings'
import { generateBookingId } from '../utils/helpers'
import Header from '../components/Header'
import ParticleBackground from '../components/ParticleBackground'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from 'recharts'

const PER_PAGE = 10
const CHART_COLORS = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6f42c1', '#fd7e14', '#e83e8c', '#6c757d']

function statusBadgeClass(status) {
  if (!status) return 'badge badge-default'
  const s = String(status).toUpperCase()
  if (s === 'COMPLETED') return 'badge badge-success'
  if (s === 'CANCELLED') return 'badge badge-danger'
  if (s === 'NOT STARTED') return 'badge badge-default'
  if (s.includes('PAYMENT') || s === 'INVOICING') return 'badge badge-warning'
  if (s.includes('DOCS') || s.includes('B/L')) return 'badge badge-info'
  return 'badge badge-primary'
}

function getLastMonths(n) {
  const out = []
  const d = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1)
    out.push(m.toLocaleString('en-US', { month: 'short', year: '2-digit' }))
  }
  return out
}

function useDashboardMetrics(bookings) {
  return useMemo(() => {
    const list = getBookingsList(bookings)
    const totalBookings = list.length
    const totalShipments = list.reduce((sum, b) => sum + (b.registerEntries?.length || 0), 0)
    const months = getLastMonths(6)
    const monthKeys = months.map((_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - (5 - i))
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    })
    const bookingsByMonth = monthKeys.map((key, idx) => {
      const [y, m] = key.split('-').map(Number)
      const count = list.filter(b => {
        const created = new Date(b.createdAt)
        return created.getFullYear() === y && created.getMonth() + 1 === m
      }).length
      return { month: months[idx], bookings: count, ships: 0 }
    })
    list.forEach(b => {
      (b.registerEntries || []).forEach(ent => {
        const raw = ent.lastUpdatedRaw || ent.lastUpdated || b.updatedAt
        const date = raw ? new Date(raw) : new Date(b.updatedAt)
        const y = date.getFullYear()
        const m = date.getMonth() + 1
        const key = `${y}-${String(m).padStart(2, '0')}`
        const idx = monthKeys.indexOf(key)
        if (idx !== -1) bookingsByMonth[idx].ships += 1
      })
    })
    const thisMonthBookings = bookingsByMonth[bookingsByMonth.length - 1]?.bookings ?? 0
    const lastMonthBookings = bookingsByMonth[bookingsByMonth.length - 2]?.bookings ?? 0
    const thisMonthShips = bookingsByMonth[bookingsByMonth.length - 1]?.ships ?? 0
    const lastMonthShips = bookingsByMonth[bookingsByMonth.length - 2]?.ships ?? 0
    const bookingTrend = lastMonthBookings > 0 ? Math.round(((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100) : (thisMonthBookings > 0 ? 100 : 0)
    const shippingTrend = lastMonthShips > 0 ? Math.round(((thisMonthShips - lastMonthShips) / lastMonthShips) * 100) : (thisMonthShips > 0 ? 100 : 0)
    const statusCounts = {}
    list.forEach(b => {
      (b.registerEntries || []).forEach(ent => {
        const s = ent.overallStatus || 'NOT STARTED'
        statusCounts[s] = (statusCounts[s] || 0) + 1
      })
    })
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
    return {
      totalBookings,
      totalShipments,
      thisMonthBookings,
      thisMonthShips,
      bookingTrend,
      shippingTrend,
      trendData: bookingsByMonth,
      statusData: statusData.length ? statusData : [{ name: 'No data', value: 1 }],
    }
  }, [bookings])
}

export default function BookingsList() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useBookingsStorage()
  const [page, setPage] = useState(1)

  const list = useMemo(() => getBookingsList(bookings), [bookings])
  const metrics = useDashboardMetrics(bookings)
  const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const start = (currentPage - 1) * PER_PAGE
  const pageItems = list.slice(start, start + PER_PAGE)

  function handleNewBooking() {
    const id = generateBookingId()
    const newBooking = createEmptyBooking(id)
    setBookings(prev => ({ ...prev, [id]: newBooking }))
    setPage(1)
    navigate(`/booking/${id}`)
  }

  function handleDeleteBooking(e, id) {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Delete this booking? This cannot be undone.')) return
    setBookings(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    if (page > 1 && pageItems.length <= 1) setPage(p => Math.max(1, p - 1))
  }

  return (
    <div className="app min-h-full flex flex-col px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          {user && (
            <>
              <span className="text-sm text-slate-600 font-medium">{user.username || user.email}</span>
              <button
                type="button"
                onClick={() => logout()}
                className="text-sm px-4 py-2 rounded-button border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      <Header />

      <main className="flex-1 mt-6 sm:mt-8 space-y-6 sm:space-y-8">
        {/* Dashboard */}
        <div className="card p-4 sm:p-5 relative overflow-hidden border-primary-100/60 shadow-lg shadow-primary-900/5">
          <ParticleBackground />
          <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200/80">
            <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Overview</h2>
            <span className="text-xs text-slate-400">· Live metrics</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
            <div className="kpi-card min-h-[4.5rem] flex flex-col justify-center rounded-xl">
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Total Bookings</div>
              <div className="text-lg sm:text-xl font-bold text-primary-700 mt-0.5">{metrics.totalBookings}</div>
            </div>
            <div className="kpi-card min-h-[4.5rem] flex flex-col justify-center rounded-xl">
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Total Shipments</div>
              <div className="text-lg sm:text-xl font-bold text-primary-700 mt-0.5">{metrics.totalShipments}</div>
            </div>
            <div className="kpi-card min-h-[4.5rem] flex flex-col justify-center rounded-xl">
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Bookings This Month</div>
              <div className="text-lg sm:text-xl font-bold text-slate-800 mt-0.5">{metrics.thisMonthBookings}</div>
              {metrics.bookingTrend !== 0 && (
                <span className={`text-xs mt-0.5 ${metrics.bookingTrend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {metrics.bookingTrend >= 0 ? '+' : ''}{metrics.bookingTrend}% vs last month
                </span>
              )}
            </div>
            <div className="kpi-card min-h-[4.5rem] flex flex-col justify-center rounded-xl">
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Shipments This Month</div>
              <div className="text-lg sm:text-xl font-bold text-slate-800 mt-0.5">{metrics.thisMonthShips}</div>
              {metrics.shippingTrend !== 0 && (
                <span className={`text-xs mt-0.5 ${metrics.shippingTrend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {metrics.shippingTrend >= 0 ? '+' : ''}{metrics.shippingTrend}% vs last month
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white/80 p-4 min-h-[200px] shadow-sm">
              <div className="text-xs font-semibold text-slate-600 mb-2">Bookings & Shipments (last 6 months)</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={metrics.trendData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#64748b" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#64748b" allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: 12 }} formatter={(value) => [value, '']} />
                  <Bar dataKey="bookings" name="Bookings" fill="#007bff" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="ships" name="Shipments" fill="#28a745" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-4 min-h-[200px] shadow-sm">
              <div className="text-xs font-semibold text-slate-600 mb-2">Shipments by Status</div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={metrics.statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={1}
                    label={({ name, percent }) => percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : null}
                    labelLine={false}
                  >
                    {metrics.statusData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">New Booking</h1>
              <p className="text-sm text-slate-500 mt-1">Create or open a booking. Each booking has its own workflow and register.</p>
            </div>
            <button
              type="button"
              onClick={handleNewBooking}
              className="btn-primary shrink-0 px-5 py-2.5"
            >
              + New Booking
            </button>
          </div>

          {list.length === 0 ? (
            <div className="py-12 text-center rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-slate-600 font-medium">No bookings yet</p>
              <p className="text-sm text-slate-500 mt-1">Click “New Booking” to create your first booking.</p>
              <button
                type="button"
                onClick={handleNewBooking}
                className="btn-primary mt-4"
              >
                + New Booking
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-slate-200 scrollbar-thin">
                <table className="w-full text-sm min-w-[700px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Booking ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Label</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Updated</th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pageItems.map(b => {
                      const status = getBookingStatus(b)
                      return (
                        <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-slate-600 truncate max-w-[140px]" title={b.id}>
                            {b.id.slice(0, 12)}…
                          </td>
                          <td className="px-4 py-3 text-slate-700 max-w-[200px] truncate" title={getBookingLabel(b)}>
                            {getBookingLabel(b)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={statusBadgeClass(status)} title={status}>{status}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                            {new Date(b.createdAt).toLocaleDateString()} {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                            {new Date(b.updatedAt).toLocaleDateString()} {new Date(b.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2 flex-wrap">
                              <Link
                                to={`/booking/${b.id}`}
                                className="btn-primary py-1.5 px-3 text-xs inline-flex items-center gap-1.5"
                              >
                                Open / Edit
                              </Link>
                              <button
                                type="button"
                                onClick={e => handleDeleteBooking(e, b.id)}
                                className="px-3 py-1.5 text-xs font-medium rounded-button border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1"
                                title="Delete booking"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-500">
                    Showing {start + 1}–{Math.min(start + PER_PAGE, list.length)} of {list.length} bookings
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-slate-600 px-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
