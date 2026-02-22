import React from 'react'

export default function Header(){
  return (
    <header className="card flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-4 px-5 sm:px-6 py-5 shadow-header">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-primary-800 tracking-tight truncate">
        SUPER CARS CO.LTD 
        </h1>
        {/* <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          End-to-End Booking / B/L / Invoice / Payment Flow
        </p> */}
      </div>
      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 shrink-0">
        <span aria-live="polite" className="font-medium text-slate-600">
          {new Date().toLocaleString()}
        </span>
        <span className="px-3 py-1.5 rounded-button bg-primary-100 text-primary-800 font-semibold text-xs uppercase tracking-wide">
          Internal Use
        </span>
      </div>
    </header>
  )
}
