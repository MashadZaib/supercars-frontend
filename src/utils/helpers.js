/**
 * Small utility helpers shared across components.
 */

/** Generate a long random ID for a new booking (URL-safe). */
export function generateBookingId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '')
  }
  const bytes = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256)
  }
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function computeOverallStatusFromSteps(completed) {
  const done = new Set(completed)
  if (done.size === 0) return 'NOT STARTED'
  if (done.has('16') && done.has('15')) return 'COMPLETED'
  if (done.has('13') || done.has('14')) return 'PAYMENTS IN PROGRESS'
  if (done.has('11') || done.has('12')) return 'INVOICING'
  if (
    done.has('7') ||
    done.has('8') ||
    done.has('9') ||
    done.has('10') ||
    done.has('5') ||
    done.has('6')
  ) {
    return 'DOCS / B/L IN PROGRESS'
  }
  if (done.has('4')) return 'BOOKED WITH CLIENT'
  if (done.has('3')) return 'BOOKED WITH CARRIER'
  return 'IN PROGRESS'
}

export function escapeCsv(value) {
  const v = value == null ? '' : String(value)
  if (/[",\n]/.test(v)) {
    return `"${v.replace(/"/g, '""')}"`
  }
  return v
}

const safeFilenamePart = (s) => (s == null ? '' : String(s))
  .replace(/[/\\:*?"<>|]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

/** Build CSV filename in format: {FILE_REF} INV {CLIENT_NAME}.csv */
export function csvFilenameFromRow(fileReference, clientName) {
  const ref = safeFilenamePart(fileReference) || 'FILE_REF'
  const client = safeFilenamePart(clientName) || 'CLIENT'
  return `${ref} INV ${client}.csv`
}

/** Build XLSX filename in format: {FILE_REF} INV {CLIENT_NAME}.xlsx */
export function xlsxFilenameFromRow(fileReference, clientName) {
  const ref = safeFilenamePart(fileReference) || 'FILE_REF'
  const client = safeFilenamePart(clientName) || 'CLIENT'
  return `${ref} INV ${client}.xlsx`
}

export function filterRegister(shipmentRegister, filters) {
  let list = shipmentRegister.slice()
  const { search, status, carrier, from, to } = filters || {}
  if (search) {
    const q = search.toLowerCase()
    list = list.filter((r) => (r.fileReference + ' ' + r.clientName + ' ' + r.bookingNumber).toLowerCase().includes(q))
  }
  if (status) list = list.filter((r) => r.overallStatus === status)
  if (carrier) list = list.filter((r) => r.carrier === carrier)
  if (from) {
    const fromDate = new Date(from + 'T00:00:00')
    list = list.filter((r) => r.lastUpdatedRaw && new Date(r.lastUpdatedRaw) >= fromDate)
  }
  if (to) {
    const toDate = new Date(to + 'T23:59:59')
    list = list.filter((r) => r.lastUpdatedRaw && new Date(r.lastUpdatedRaw) <= toDate)
  }
  return list
}
