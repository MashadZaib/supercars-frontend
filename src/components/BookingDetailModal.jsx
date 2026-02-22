import React, { useState } from 'react'

const TAB_IDS = ['summary', 'booking-vessel', 'cutoffs', 'steps']

function formatLabel(key) {
  if (!key || typeof key !== 'string') return key
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function InfoTable({ rows, emptyMessage = 'No data' }) {
  if (!rows || rows.length === 0) return <p className="text-sm text-slate-500 py-4">{emptyMessage}</p>
  return (
    <table className="w-full text-sm">
      <tbody className="divide-y divide-slate-100">
        {rows.map(({ label, value }) => (
          <tr key={label} className="hover:bg-slate-50/50">
            <td className="py-2.5 pr-4 font-medium text-slate-600 align-top w-[40%]">{formatLabel(label)}</td>
            <td className="py-2.5 text-slate-800">{value != null && value !== '' ? String(value) : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function BookingDetailModal({ detail, onClose }) {
  const [activeTab, setActiveTab] = useState('summary')

  if (!detail) return null

  const {
    fileReference,
    clientName,
    carrier,
    pol,
    pod,
    route,
    bookingNumber,
    vesselName,
    voyage,
    cyCutOff,
    docCutOff,
    siCutOff,
    overallStatus,
    stepsDone,
    lastUpdated,
    fullData,
  } = detail

  const summaryRows = [
    { label: 'File Reference', value: fileReference },
    { label: 'Client', value: clientName },
    { label: 'Carrier / BK MESSRS/AGENT', value: carrier },
    { label: 'POL', value: pol },
    { label: 'POD', value: pod },
    { label: 'Route', value: route },
    { label: 'Overall Status', value: overallStatus },
    { label: 'Steps Done', value: stepsDone },
    { label: 'Last Updated', value: lastUpdated },
  ]

  const bookingVesselRows = [
    { label: 'Booking Number', value: bookingNumber },
    { label: 'Vessel', value: vesselName },
    { label: 'Voyage', value: voyage },
  ]

  const cutoffsRows = [
    { label: 'CY Cut Off', value: cyCutOff },
    { label: 'DOC Cut Off', value: docCutOff },
    { label: 'SI Cut Off', value: siCutOff },
  ]

  const stepEntries = fullData ? Object.entries(fullData).sort(([a], [b]) => Number(a) - Number(b)) : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 shrink-0">
          <h2 id="modal-title" className="text-lg font-bold text-slate-800 truncate">
            Booking Details – {fileReference || 'No file ref'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex border-b border-slate-200 overflow-x-auto shrink-0">
          {[
            { id: 'summary', label: 'Summary' },
            { id: 'booking-vessel', label: 'Booking & Vessel' },
            { id: 'cutoffs', label: 'Cut-offs' },
            { id: 'steps', label: 'Step Data' },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {activeTab === 'summary' && <InfoTable rows={summaryRows} />}
          {activeTab === 'booking-vessel' && <InfoTable rows={bookingVesselRows} />}
          {activeTab === 'cutoffs' && <InfoTable rows={cutoffsRows} />}
          {activeTab === 'steps' && (
            <div className="space-y-6">
              {stepEntries.length === 0 ? (
                <p className="text-sm text-slate-500 py-4">No step data.</p>
              ) : (
                stepEntries.map(([stepId, step]) => {
                  const title = step?.title || `Step ${stepId}`
                  const data = step?.data || {}
                  const rows = Object.entries(data).map(([k, v]) => ({ label: k, value: v }))
                  return (
                    <div key={stepId} className="rounded-lg border border-slate-200 overflow-hidden">
                      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                        <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
                      </div>
                      <div className="p-4">
                        <InfoTable rows={rows} emptyMessage="No fields filled" />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
