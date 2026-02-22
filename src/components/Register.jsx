import React from 'react'
import BookingDetailModal from './BookingDetailModal'

export default function Register({ shipmentRegister, filteredRegister, filters, setFilters, carrierOptions, addOrUpdateRegisterFromCurrent, downloadRegisterAsXlsx, showBookingDetail, bookingDetail }){
  const filtered = filteredRegister || []

  const paymentsInProgressCount = shipmentRegister.filter(r => r.overallStatus === 'PAYMENTS IN PROGRESS').length
  const cancelledCount = shipmentRegister.filter(r => r.overallStatus === 'CANCELLED').length
  const uniqueCarriersCount = (() => { const s = new Set(); shipmentRegister.forEach(r => { if(r.carrier && r.carrier !== '(NO CARRIER/AGENT)') s.add(r.carrier) }); return s.size })()
  const uniqueClientsCount = (() => { const s = new Set(); shipmentRegister.forEach(r => { if(r.clientName && r.clientName !== '(NO CLIENT)') s.add(r.clientName) }); return s.size })()

  const kpiCards = [
    { label: 'Total Shipments', value: shipmentRegister.length, meta: 'In this session' },
    { label: 'Completed Shipments', value: shipmentRegister.filter(r => r.overallStatus === 'COMPLETED').length, meta: 'Status = COMPLETED' },
    { label: 'In-Progress Shipments', value: shipmentRegister.filter(r => r.overallStatus !== 'NOT STARTED' && r.overallStatus !== 'COMPLETED' && r.overallStatus !== 'CANCELLED').length, meta: 'Excludes Not Started / Cancelled' },
    { label: 'Payments in Progress', value: paymentsInProgressCount, meta: 'Status = PAYMENTS IN PROGRESS' },
    { label: 'Cancelled Shipments', value: cancelledCount, meta: 'Status = CANCELLED' },
    { label: 'Unique Carriers', value: uniqueCarriersCount, meta: 'From BK MESSRS/AGENT' },
    { label: 'Unique Clients', value: uniqueClientsCount, meta: 'Client Names' },
  ]

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 mb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-800">
          Shipment Register & Reporting
        </h2>
        <span className="text-xs sm:text-sm text-slate-500">
          Overview per carrier, client, POL & POD – session only
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
        {kpiCards.map(({ label, value, meta }) => (
          <div key={label} className="kpi-card min-w-0 flex flex-col min-h-[7.5rem]">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide min-h-[2.25rem] flex items-start break-words leading-snug" title={label}>
              {label}
            </div>
            <div className="text-xl font-bold text-primary-700 mt-1 flex-shrink-0">{value}</div>
            <div className="text-[11px] text-slate-400 mt-1 min-h-[2.25rem] break-words leading-snug flex items-end">{meta}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
        <div className="lg:col-span-2 flex flex-col">
          <label className="text-xs font-medium text-slate-600 block mb-1.5 whitespace-nowrap">Search</label>
          <input
            className="input-base h-10 w-full"
            placeholder="File ref / Client / Booking #"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-600 block mb-1.5 whitespace-nowrap">Status</label>
          <select
            className="input-base h-10 w-full"
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          >
            <option value="">All</option>
            <option value="NOT STARTED">NOT STARTED</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
            <option value="BOOKED WITH CARRIER">BOOKED WITH CARRIER</option>
            <option value="BOOKED WITH CLIENT">BOOKED WITH CLIENT</option>
            <option value="DOCS / B/L IN PROGRESS">DOCS / B/L IN PROGRESS</option>
            <option value="INVOICING">INVOICING</option>
            <option value="PAYMENTS IN PROGRESS">PAYMENTS IN PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-600 block mb-1.5 whitespace-nowrap">Carrier / Shipping Line</label>
          <select
            className="input-base h-10 w-full"
            value={filters.carrier}
            onChange={e => setFilters(f => ({ ...f, carrier: e.target.value }))}
          >
            <option value="">All</option>
            {carrierOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-600 block mb-1.5 whitespace-nowrap">From Date</label>
          <input
            type="date"
            className="input-base h-10 w-full"
            value={filters.from}
            onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-600 block mb-1.5 whitespace-nowrap">To Date</label>
          <input
            type="date"
            className="input-base h-10 w-full"
            value={filters.to}
            onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="kpi-card">
          <h3 className="text-sm font-semibold text-slate-700">By Carrier (BK MESSRS/AGENT)</h3>
          <ul className="text-sm mt-2 max-h-28 overflow-y-auto scrollbar-thin space-y-1">
            {shipmentRegister.length === 0 ? <li className="text-slate-400">No carrier data yet</li> : (() => { const map = {}; shipmentRegister.forEach(r => { map[r.carrier] = (map[r.carrier] || 0) + 1 }); return Object.keys(map).sort().map(k => <li key={k} className="flex justify-between"><span className="truncate pr-2">{k}</span><span className="font-medium">{map[k]}</span></li>) })()}
          </ul>
        </div>
        <div className="kpi-card">
          <h3 className="text-sm font-semibold text-slate-700">By Client</h3>
          <ul className="text-sm mt-2 max-h-28 overflow-y-auto scrollbar-thin space-y-1">
            {shipmentRegister.length === 0 ? <li className="text-slate-400">No client data yet</li> : (() => { const map = {}; shipmentRegister.forEach(r => { map[r.clientName] = (map[r.clientName] || 0) + 1 }); return Object.keys(map).sort().map(k => <li key={k} className="flex justify-between"><span className="truncate pr-2">{k}</span><span className="font-medium">{map[k]}</span></li>) })()}
          </ul>
        </div>
        <div className="kpi-card">
          <h3 className="text-sm font-semibold text-slate-700">By Route (POL → POD)</h3>
          <ul className="text-sm mt-2 max-h-28 overflow-y-auto scrollbar-thin space-y-1">
            {shipmentRegister.length === 0 ? <li className="text-slate-400">No POL/POD data yet</li> : (() => { const map = {}; shipmentRegister.forEach(r => { map[r.route] = (map[r.route] || 0) + 1 }); return Object.keys(map).sort().map(k => <li key={k} className="flex justify-between"><span className="truncate pr-2">{k}</span><span className="font-medium">{map[k]}</span></li>) })()}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
          <h3 className="text-sm font-semibold text-slate-700">Shipment Register</h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={addOrUpdateRegisterFromCurrent} className="btn-primary text-sm py-1.5 px-3">
              Add / Update From Current Booking
            </button>
            <button onClick={downloadRegisterAsXlsx} className="btn-secondary text-sm py-1.5 px-3">
              Download Invoice (XLSX)
            </button>
          </div>
        </div>

        <div className="max-h-64 sm:max-h-72 overflow-auto rounded-lg border border-slate-200 scrollbar-thin">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">File Ref</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Client</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Carrier</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">POL</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">POD</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Booking #</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Vessel</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Voyage</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Steps</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={11} className="p-6 text-center text-slate-500">No shipments match filters. Adjust search or filters.</td></tr>
              ) : filtered.map((r, idx) => (
                <tr key={idx} onClick={() => showBookingDetail(r)} className="hover:bg-primary-50/50 cursor-pointer transition-colors">
                  <td className="px-3 py-2 text-slate-700">{r.fileReference}</td>
                  <td className="px-3 py-2 text-slate-700">{r.clientName}</td>
                  <td className="px-3 py-2 text-slate-700">{r.carrier}</td>
                  <td className="px-3 py-2 text-slate-700">{r.pol}</td>
                  <td className="px-3 py-2 text-slate-700">{r.pod}</td>
                  <td className="px-3 py-2 text-slate-700">{r.bookingNumber}</td>
                  <td className="px-3 py-2 text-slate-700">{r.vesselName}</td>
                  <td className="px-3 py-2 text-slate-700">{r.voyage}</td>
                  <td className="px-3 py-2"><span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">{r.overallStatus}</span></td>
                  <td className="px-3 py-2 text-slate-700">{r.stepsDone}</td>
                  <td className="px-3 py-2 text-slate-500 text-xs">{r.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Click a row to open booking details in a popup.
        </p>

        {bookingDetail && (
          <BookingDetailModal
            detail={bookingDetail}
            onClose={() => showBookingDetail(null)}
          />
        )}
      </div>
    </div>
  )
}
