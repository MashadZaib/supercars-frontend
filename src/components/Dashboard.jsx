import React from 'react'
import ParticleBackground from './ParticleBackground'

/** Renders a list of step numbers; highlights those in completedIds. */
function StepNumbers({ stepIds, completedIds }) {
  const set = new Set(completedIds || [])
  return (
    <span className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap gap-x-0.5 gap-y-0.5">
      {stepIds.map((id, i) => {
        const filled = set.has(String(id))
        return (
          <span key={id}>
            {i > 0 && <span className="text-slate-300">, </span>}
            <span
              className={filled ? 'text-primary-600 font-semibold' : ''}
              title={filled ? 'Form filled' : 'Not filled'}
            >
              {id}
            </span>
          </span>
        )
      })}
    </span>
  )
}

/** Step ids for Documentation (5–10) as array. */
const DOCS_STEP_IDS = ['5', '6', '7', '8', '9', '10']
const CLIENT_STEP_IDS = ['1', '5', '9', '13', '16']
const CARRIER_STEP_IDS = ['2', '3', '7', '11', '14', '15']
const FINANCE_STEP_IDS = ['11', '12', '13', '14']

export default function Dashboard({
  completedCount,
  totalSteps,
  percentage,
  clientCompleted,
  carrierCompleted,
  docsCompleted,
  financeCompleted,
  completedIds = [],
  currentUser,
  setCurrentUser,
  dashboardReadOnly = false,
}) {
  return (
    <div className="card p-5 sm:p-6 relative overflow-hidden border-primary-100/50 shadow-md">
      <ParticleBackground />
      <div className="relative z-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 pb-3 border-b border-slate-200/80">
        <h2 className="text-base sm:text-lg font-bold text-slate-800">
          Booking Dashboard
        </h2>
        <span className="text-xs sm:text-sm text-slate-500">
          Auto-updates as you save steps
        </span>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <label className="text-sm font-medium text-slate-600 whitespace-nowrap">
          Current User:
        </label>
        <input
          id="currentUser"
          className={`input-base flex-1 min-w-0 ${dashboardReadOnly ? 'bg-slate-50 cursor-default' : ''}`}
          value={currentUser}
          onChange={e => setCurrentUser(e.target.value)}
          placeholder="e.g. Khurram / Ops User"
          aria-label="Current user"
          readOnly={dashboardReadOnly}
        />
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span className="font-medium">Overall Workflow Completion</span>
          <span className="font-semibold text-primary-700">
            {completedCount} / {totalSteps} ({percentage}%)
          </span>
        </div>
        <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 items-stretch">
        <div className="kpi-card min-w-0 flex flex-col min-h-[7rem] rounded-xl">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide min-h-[2.25rem] flex items-start leading-snug whitespace-nowrap">Total Steps</div>
          <div className="text-xl font-bold text-primary-700 mt-1 flex-shrink-0">{completedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1 min-h-[1.5rem] flex items-end">Out of {totalSteps} items</div>
        </div>
        <div className="kpi-card min-w-0 flex flex-col min-h-[7rem] rounded-xl">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide min-h-[2.25rem] flex items-start leading-snug whitespace-nowrap">Client Steps</div>
          <div className="text-xl font-bold text-slate-800 mt-1 flex-shrink-0">{clientCompleted}</div>
          <div className="mt-1 min-h-[1.5rem] flex items-end"><StepNumbers stepIds={CLIENT_STEP_IDS} completedIds={completedIds} /></div>
        </div>
        <div className="kpi-card min-w-0 flex flex-col min-h-[7rem] rounded-xl">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide min-h-[2.25rem] flex items-start leading-snug whitespace-nowrap">Carrier Steps</div>
          <div className="text-xl font-bold text-slate-800 mt-1 flex-shrink-0">{carrierCompleted}</div>
          <div className="mt-1 min-h-[1.5rem] flex items-end"><StepNumbers stepIds={CARRIER_STEP_IDS} completedIds={completedIds} /></div>
        </div>
        <div className="kpi-card min-w-0 flex flex-col min-h-[7rem] lg:min-w-[9rem] rounded-xl">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide min-h-[2.25rem] flex items-start leading-snug whitespace-nowrap">Documentation</div>
          <div className="text-xl font-bold text-slate-800 mt-1 flex-shrink-0">{docsCompleted}</div>
          <div className="mt-1 min-h-[1.5rem] flex items-end"><StepNumbers stepIds={DOCS_STEP_IDS} completedIds={completedIds} /></div>
        </div>
        <div className="kpi-card min-w-0 flex flex-col min-h-[7rem] col-span-2 sm:col-span-3 lg:col-span-1 rounded-xl">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide min-h-[2.25rem] flex items-start leading-snug whitespace-nowrap">Finance Steps</div>
          <div className="text-xl font-bold text-slate-800 mt-1 flex-shrink-0">{financeCompleted}</div>
          <div className="mt-1 min-h-[1.5rem] flex items-end"><StepNumbers stepIds={FINANCE_STEP_IDS} completedIds={completedIds} /></div>
        </div>
      </div>
      </div>
    </div>
  )
}
