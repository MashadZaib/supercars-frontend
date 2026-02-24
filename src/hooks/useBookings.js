import { computeOverallStatusFromSteps } from '../utils/helpers'

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
