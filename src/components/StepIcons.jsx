import React from 'react'

const iconClass = 'w-5 h-5 shrink-0'

/** Inline SVG icons for process steps. */
export const StepIconUser = ({ className = iconClass }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

export const StepIconShip = ({ className = iconClass }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

export const StepIconFile = ({ className = iconClass }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

export const StepIconInvoice = ({ className = iconClass }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
  </svg>
)

export const StepIconPayment = ({ className = iconClass }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
)

export const StepIconCheck = ({ className = iconClass }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

export const StepIconSave = ({ className = 'w-4 h-4 shrink-0' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
)

const iconMap = {
  user: StepIconUser,
  ship: StepIconShip,
  file: StepIconFile,
  invoice: StepIconInvoice,
  payment: StepIconPayment,
  check: StepIconCheck,
}

/** Step id -> icon key for sidebar and form. */
export function getStepIconKey(step) {
  if (!step) return 'file'
  const id = String(step.id)
  const tag = (step.tag || '').toUpperCase()
  if (id === '1' || tag.includes('CLIENT TO CARIZO')) return 'user'
  if (['2', '3'].includes(id) || tag.includes('SHIPPING LINE') || tag.includes('CARIZO TO SHIPPING')) return 'ship'
  if (tag.includes('INVOICE')) return 'invoice'
  if (tag.includes('PAYMENT')) return 'payment'
  if (['15', '16'].includes(id) && tag.includes('B/L')) return 'check'
  return 'file'
}

export function StepIcon({ step, className }) {
  const key = getStepIconKey(step)
  const Icon = iconMap[key] || StepIconFile
  return <Icon className={className || iconClass} />
}
