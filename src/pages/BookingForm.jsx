import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { steps } from '../data/steps'
import { computeOverallStatusFromSteps, filterRegister, xlsxFilenameFromRow } from '../utils/helpers'
import { exportInvoiceXlsx } from '../utils/exportInvoiceXlsx'
import { getBookingByKey as apiGetBookingByKey, updateBookingByKey as apiUpdateBookingByKey, deleteBookingByKey as apiDeleteBookingByKey, bookingToStepData } from '../api/bookings'
import Header from '../components/Header'
import StepsPanel from '../components/StepsPanel'
import Dashboard from '../components/Dashboard'
import StepForm from '../components/StepForm'
import Register from '../components/Register'

export default function BookingForm() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const auth = useAuth()
  const [booking, setBooking] = useState(null)
  const [stepDataState, setStepDataState] = useState({})
  const [bookingDetail, setBookingDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const stepFormSectionRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!bookingId) return
      if (!auth.user) return
      setLoading(true)
      setError(null)
      try {
        const data = await apiGetBookingByKey(auth.token, bookingId)
        if (!cancelled) {
          setBooking(data)
          setStepDataState(bookingToStepData(data))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load booking')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [auth.token, auth.user, bookingId])

  useEffect(() => {
    if (booking?.activeStepId && stepFormSectionRef.current) {
      stepFormSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [booking?.activeStepId])

  const stepData = stepDataState || {}
  const registerEntries = booking?.registerEntries || []
  const filters = booking?.filters || { search: '', status: '', carrier: '', from: '', to: '' }
  const totalSteps = steps.length
  const completedIds = Object.keys(stepData)
  const completedCount = completedIds.length
  const percentage = totalSteps ? Math.round((completedCount / totalSteps) * 100) : 0

  const clientStepIds = ['1', '5', '9', '13', '16']
  const carrierStepIds = ['2', '3', '7', '11', '14', '15']
  const docsStepIds = ['5', '6', '7', '8', '9', '10']
  const financeStepIds = ['11', '12', '13', '14']
  const clientCompleted = completedIds.filter(id => clientStepIds.includes(id)).length
  const carrierCompleted = completedIds.filter(id => carrierStepIds.includes(id)).length
  const docsCompleted = completedIds.filter(id => docsStepIds.includes(id)).length
  const financeCompleted = completedIds.filter(id => financeStepIds.includes(id)).length

  function saveStepData(stepId, formValues) {
    if (!stepId) return
    const stepMeta = steps.find(s => s.id === stepId)
    setStepDataState(prev => {
      const next = {
        ...prev,
        [stepId]: { stepId, data: formValues, title: stepMeta?.title, tag: stepMeta?.tag },
      }
      persistStepData(next)
      return next
    })
  }

  async function persistStepData(nextStepData) {
    if (!bookingId) return
    try {
      const updated = await apiUpdateBookingByKey(auth.token, bookingId, nextStepData)
      setBooking(updated)
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.message || 'Failed to save booking')
    }
  }

  function setFiltersUpdater(updater) {
    setBooking(prev => {
      if (!prev) return prev
      const nextFilters = typeof updater === 'function' ? updater(prev.filters || {}) : updater
      const next = { ...prev, filters: nextFilters }
      return next
    })
  }

  function setActiveStepId(id) {
    setBooking(prev => (prev ? { ...prev, activeStepId: id } : prev))
  }

  function setCurrentUser(value) {
    setBooking(prev => (prev ? { ...prev, currentUser: value } : prev))
  }

  function addOrUpdateRegisterFromCurrent() {
    const step1 = stepData['1']?.data || {}
    const step2 = stepData['2']?.data || {}
    const step3 = stepData['3']?.data || {}
    const step4 = stepData['4']?.data || {}

    const fileReference = (step2.fileReference || '').trim() || '(NO FILE REF)'
    const clientName = (step1.clientName || '').trim() || '(NO CLIENT)'
    const carrier = (step1.bkMessrsAgent || '').trim() || '(NO CARRIER/AGENT)'
    const pol = (step1.portOfLoad || step2.portOfLoad || '').trim() || '(NO POL)'
    const pod = (step1.portOfDischarge || step2.portOfDischarge || '').trim() || '(NO POD)'
    const route = pol !== '(NO POL)' && pod !== '(NO POD)' ? `${pol} → ${pod}` : '(NO POL/POD)'
    const bookingNumber = (step3.bookingNumber || step4.bookingNumber || '').trim() || '(NO BKG NO)'
    const vesselName = (step3.vesselName || step4.vesselName || '').trim() || '(NO VESSEL)'
    const voyage = (step3.voyage || step4.voyage || '').trim() || '(NO VOYAGE)'
    const cyCutOff = (step3.cyCutOff || step4.cyCutOff || '').trim() || ''
    const docCutOff = (step3.docCutOff || step4.docCutOff || '') || ''
    const siCutOff = (step3.shippingInstructionCutOff || step4.shippingInstructionCutOffRequest || '').trim() || ''

    const rawBookingStatus = (step4.bookingStatus || '').trim().toUpperCase()
    const overallStatus = (rawBookingStatus === 'CANCELLED' || rawBookingStatus === 'CANCELED') ? 'CANCELLED' : computeOverallStatusFromSteps(completedIds)
    const stepsDone = completedIds.length
    const now = new Date()
    const nowStr = now.toLocaleString()
    const nowISO = now.toISOString()
    const currentUsr = (booking?.currentUser || '').trim() || '(NO USER)'
    const fullDataSnapshot = JSON.parse(JSON.stringify(stepData))

    setBooking(prev => {
      const prevEntries = prev.registerEntries || []
      const existingIndex = prevEntries.findIndex(r => r.fileReference === fileReference)
      const entry = {
        fileReference, clientName, carrier, pol, pod, route, bookingNumber, vesselName, voyage, cyCutOff, docCutOff, siCutOff,
        overallStatus, stepsDone, lastUpdated: `${nowStr} (${currentUsr})`, lastUpdatedRaw: nowISO, createdAt: nowStr, createdAtRaw: nowISO, createdBy: currentUsr, updatedBy: currentUsr, fullData: fullDataSnapshot,
      }
      const nextEntries = existingIndex >= 0
        ? prevEntries.map((r, i) => (i === existingIndex ? entry : r))
        : [...prevEntries, entry]
      return { ...prev, registerEntries: nextEntries }
    })
  }

  async function downloadRegisterAsXlsx() {
    if (!registerEntries.length) return alert('No shipments in the register to export.')
    const first = registerEntries[0]
    const filename = xlsxFilenameFromRow(first.fileReference, first.clientName)
    try {
      await exportInvoiceXlsx(first, filename)
    } catch (err) {
      console.error('Export XLSX failed', err)
      alert('Export failed. Please try again.')
    }
  }

  const filteredRegister = useMemo(() => filterRegister(registerEntries, filters), [registerEntries, filters])
  const carrierOptions = useMemo(() => {
    const s = new Set()
    registerEntries.forEach(r => { if (r.carrier && r.carrier !== '(NO CARRIER/AGENT)') s.add(r.carrier) })
    return Array.from(s).sort()
  }, [registerEntries])

  const activeStepId = booking?.activeStepId ?? null
  const currentUser = booking?.currentUser ?? ''

  function handleDeleteBooking() {
    if (!window.confirm('Delete this booking? This cannot be undone.')) return
    apiDeleteBookingByKey(auth.token, bookingId)
      .then(() => {
        navigate('/', { replace: true })
      })
      .catch(err => {
        // eslint-disable-next-line no-alert
        alert(err.message || 'Failed to delete booking')
      })
  }

  if (!bookingId) {
    return (
      <div className="app p-8">
        <p className="text-slate-600">Invalid booking.</p>
        <Link to="/" className="text-primary-600 hover:underline mt-2 inline-block">Back to Bookings</Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="app p-8">
        <p className="text-slate-600">Loading booking…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app p-8">
        <p className="text-slate-600">Failed to load booking.</p>
        <p className="text-sm text-slate-500 mt-1">{error}</p>
        <Link to="/" className="text-primary-600 hover:underline mt-2 inline-block">Back to Bookings</Link>
      </div>
    )
  }

  return (
    <div className="app min-h-full flex flex-col px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Bookings
          </Link>
          {auth.user && (
            <button
              type="button"
              onClick={() => auth.logout()}
              className="text-sm px-4 py-2 rounded-button border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
            >
              Logout
            </button>
          )}
          <button
            type="button"
            onClick={handleDeleteBooking}
            className="text-sm px-4 py-2 rounded-button border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
            title="Delete this booking"
          >
            Delete booking
          </button>
        </div>
        <p className="text-xs font-mono text-slate-500 truncate max-w-[280px] sm:max-w-none" title={bookingId}>
          Booking ID: {bookingId.slice(0, 16)}…
        </p>
      </div>

      <Header />

        <main className="flex-1 flex flex-col lg:grid lg:grid-cols-[minmax(260px,320px)_1fr] gap-6 lg:gap-8 mt-6">
        <aside className="lg:min-w-0 order-1 lg:order-1">
          <StepsPanel
            steps={steps}
            activeId={activeStepId}
            onSelect={setActiveStepId}
          />
        </aside>

        <section className="space-y-6 lg:space-y-8 order-2 lg:order-2 min-w-0">
          <Dashboard
            completedCount={completedCount}
            totalSteps={totalSteps}
            percentage={percentage}
            clientCompleted={clientCompleted}
            carrierCompleted={carrierCompleted}
            docsCompleted={docsCompleted}
            financeCompleted={financeCompleted}
            completedIds={completedIds}
            currentUser={(auth.user && (auth.user.username || auth.user.email)) || currentUser}
            setCurrentUser={auth.user ? () => {} : setCurrentUser}
            dashboardReadOnly={!!auth.user}
          />

          <div ref={stepFormSectionRef}>
            <StepForm
              step={steps.find(s => s.id === activeStepId)}
              initialData={stepData[activeStepId]?.data || {}}
              onSave={form => saveStepData(activeStepId, form)}
            />
          </div>

          <Register
            shipmentRegister={registerEntries}
            filteredRegister={filteredRegister}
            filters={filters}
            setFilters={setFiltersUpdater}
            carrierOptions={carrierOptions}
            addOrUpdateRegisterFromCurrent={addOrUpdateRegisterFromCurrent}
            downloadRegisterAsXlsx={downloadRegisterAsXlsx}
            showBookingDetail={setBookingDetail}
            bookingDetail={bookingDetail}
          />
        </section>
      </main>
    </div>
  )
}
