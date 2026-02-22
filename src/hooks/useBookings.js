import { useState, useEffect, useCallback } from 'react'
import { generateBookingId, computeOverallStatusFromSteps } from '../utils/helpers'

const STORAGE_KEY = 'carizo_bookings'
const DEFAULT_FILTERS = { search: '', status: '', carrier: '', from: '', to: '' }

function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}

function saveBookings(bookings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  } catch (e) {}
}

/** Create a new empty booking record. */
export function createEmptyBooking(id = generateBookingId()) {
  const now = new Date().toISOString()
  return {
    id,
    createdAt: now,
    updatedAt: now,
    stepData: {},
    registerEntries: [],
    currentUser: '',
    filters: { ...DEFAULT_FILTERS },
    activeStepId: null,
  }
}

/**
 * Hook to read/write the full bookings map from localStorage.
 * Returns [bookings, setBookings] where bookings is { [id]: booking }.
 */
export function useBookingsStorage() {
  const [bookings, setBookingsState] = useState(loadBookings)

  useEffect(() => {
    saveBookings(bookings)
  }, [bookings])

  const setBookings = useCallback(updater => {
    setBookingsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      return { ...next }
    })
  }, [])

  return [bookings, setBookings]
}

/**
 * Get or create a single booking by id. Updates the bookings map when the booking changes.
 */
export function useBooking(bookingId, bookings, setBookings) {
  const booking = bookingId ? bookings[bookingId] : null
  const exists = Boolean(booking)

  const setBooking = useCallback(
    updater => {
      if (!bookingId) return
      setBookings(prev => {
        const current = prev[bookingId] || createEmptyBooking(bookingId)
        const nextBooking = typeof updater === 'function' ? updater(current) : updater
        return { ...prev, [bookingId]: { ...nextBooking, updatedAt: new Date().toISOString() } }
      })
    },
    [bookingId, setBookings]
  )

  const ensureBooking = useCallback(() => {
    if (!bookingId) return
    if (!bookings[bookingId]) {
      setBookings(prev => ({ ...prev, [bookingId]: createEmptyBooking(bookingId) }))
    }
  }, [bookingId, bookings, setBookings])

  return {
    booking: booking || createEmptyBooking(bookingId),
    exists,
    setBooking,
    ensureBooking,
  }
}

/** Get sorted list of bookings for listing (newest first). */
export function getBookingsList(bookings) {
  return Object.values(bookings)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

/** Get display label for a booking (file ref / client from step data). */
export function getBookingLabel(booking) {
  const step1 = booking?.stepData?.['1']?.data || {}
  const step2 = booking?.stepData?.['2']?.data || {}
  const fileRef = (step2.fileReference || '').trim() || '(No file ref)'
  const client = (step1.clientName || '').trim() || '(No client)'
  return `${fileRef} – ${client}`
}

/** Get overall status for a booking from completed step ids (same logic as register). */
export function getBookingStatus(booking) {
  const completedIds = Object.keys(booking?.stepData || {})
  return computeOverallStatusFromSteps(completedIds)
}
