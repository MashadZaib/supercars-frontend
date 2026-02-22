import React from 'react'
import { StepIcon } from './StepIcons'
import ParticleBackground from './ParticleBackground'

export default function StepsPanel({ steps, activeId, onSelect }) {
  return (
    <div className="card p-5 sm:p-6 sticky top-4 lg:top-6 transition-shadow duration-300 hover:shadow-lg relative overflow-hidden border-primary-100/40 shadow-md">
      <ParticleBackground variant="light" />
      <div className="relative z-10">
      <div className="pb-3 mb-3 border-b border-slate-200/80">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Process Steps</h2>
        <p className="text-[11px] text-slate-400 mt-0.5">Select a step to edit</p>
      </div>
      <ul className="space-y-2 max-h-[35vh] sm:max-h-[45vh] lg:max-h-[62vh] overflow-y-auto scrollbar-thin pr-1">
        {steps.map((step, index) => {
          const isActive = activeId === step.id
          return (
            <li
              key={step.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'backwards' }}
            >
              <button
                type="button"
                className={`w-full text-left p-3 rounded-xl border flex gap-3 items-start transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.99] ${
                  isActive
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md ring-2 ring-primary-400/30'
                    : 'bg-slate-50 hover:bg-primary-50 hover:border-primary-200 border-slate-200 text-slate-700 hover:shadow-sm'
                }`}
                onClick={() => onSelect(step.id)}
                aria-pressed={isActive}
              >
                <span className={`mt-0.5 transition-transform duration-300 ${isActive ? 'text-white' : 'text-primary-500'}`}>
                  <StepIcon step={step} className="w-5 h-5 shrink-0" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                    {step.title}
                  </div>
                  <div className={`text-xs mt-0.5 ${isActive ? 'text-primary-100' : 'text-slate-500'}`}>
                    {step.short}
                  </div>
                  <div className={`text-[11px] mt-1 ${isActive ? 'text-primary-200' : 'text-slate-400'}`}>
                    {step.tag}
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
      </div>
    </div>
  )
}
