import { steps } from '../data/steps'
import { generateBookingId } from '../utils/helpers'

const camelToSnakeMap = {
  newBookingInstructions: 'new_booking_instructions',
  dateReceivedFromClient: 'date_received_from_client',
  method: 'method',
  clientName: 'client_name',
  clientAddress: 'client_address',
  clientEmail: 'client_email',
  clientContactNo: 'client_contact_no',
  portOfLoad: 'port_of_load',
  portOfDischarge: 'port_of_discharge',
  noSizeContainers: 'no_size_containers',
  numberOfVehicles: 'number_of_vehicles',
  cyDetails: 'cy_details',
  freightTerms: 'freight_terms',
  blType: 'bl_type',
  customBrokerYardName: 'custom_broker_yard_name',
  bkMessrsAgent: 'bk_messrs_agent',
  newBookingRequestSent: 'new_booking_request_sent',
  fileReference: 'file_reference',
  carrierRequestedDate: 'carrier_requested_date',
  containerReleaseFromDepot: 'container_release_from_depot',
  newBookingRequestReceived: 'new_booking_request_received',
  rateConfirmedMonthly: 'rate_confirmed_monthly',
  bookingConfirmationReceived: 'booking_confirmation_received',
  bookingNumber: 'booking_number',
  vesselName: 'vessel_name',
  voyage: 'voyage',
  cyCutOff: 'cy_cut_off',
  docCutOff: 'doc_cut_off',
  shippingInstructionCutOff: 'shipping_instruction_cut_off',
  newBookingRequestSentToClient: 'new_booking_request_sent_to_client',
  ratesValidity: 'rates_validity',
  bookingConfirmation: 'booking_confirmation',
  bookingStatus: 'booking_status',
  customsDocCutOff: 'customs_doc_cut_off',
  shippingInstructionCutOffRequest: 'shipping_instruction_cut_off_request',
  shippingInstructions: 'shipping_instructions',
  shipperDetails: 'shipper_details',
  consigneeDetails: 'consignee_details',
  notifyDetails: 'notify_details',
  marksAndNumbers: 'marks_and_numbers',
  containerNumbers: 'container_numbers',
  sealNumbers: 'seal_numbers',
  vehicleDetails: 'vehicle_details',
  submitsShippingInstruction: 'submits_shipping_instruction',
  draftBlSharedDate: 'draft_bl_shared_date',
  draftBlNotes: 'draft_bl_notes',
  draftBlSentToClientDate: 'draft_bl_sent_to_client_date',
  draftBlToConfirm: 'draft_bl_to_confirm',
  receiveDraftBlConfirmation: 'receive_draft_bl_confirmation',
  clientConfirmationNotes: 'client_confirmation_notes',
  confirmDraftBlWithCarrierDate: 'confirm_draft_bl_with_carrier_date',
  carrierBlRef: 'carrier_bl_ref',
  dateOfInvoice: 'date_of_invoice',
  invoiceNo: 'invoice_no',
  invoiceAmount: 'invoice_amount',
  dueDateForPayment: 'due_date_for_payment',
  methodReferenceOfPayment: 'method_reference_of_payment',
  dateFinalBlReleased: 'date_final_bl_released',
  status: 'status',
  methodOfPayment: 'method_of_payment',
  datePaymentReceived: 'date_payment_received',
  amountPaid: 'amount_paid',
  amendmentRequested: 'amendment_requested',
  paymentToShippingLine: 'payment_to_shipping_line',
  dateOfPayment: 'date_of_payment',
  amountOfPayment: 'amount_of_payment',
  requestToCarrierForAmendments: 'request_to_carrier_for_amendments',
  carrierConfirmCargoLoaded: 'carrier_confirm_cargo_loaded',
  blReady: 'bl_ready',
  carizoConfirmCargoLoaded: 'carizo_confirm_cargo_loaded',
  blReadyClient: 'bl_ready_client',
  notifyClientAmendmentCharges: 'notify_client_amendment_charges',
}

const snakeToCamelMap = Object.entries(camelToSnakeMap).reduce((acc, [camel, snake]) => {
  acc[snake] = camel
  return acc
}, {})

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

function buildHeaders(token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

function normalizeDateOnly(value) {
  if (!value) return value
  // HTML date inputs already give 'YYYY-MM-DD'
  if (typeof value === 'string') {
    // Take just the date portion if a full ISO string was passed
    const m = value.match(/^(\d{4}-\d{2}-\d{2})/)
    if (m) return m[1]
  }
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toISOString().slice(0, 10)
}

function normalizeDateTime(value) {
  if (!value) return value
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toISOString()
}

export function stepDataToPayload(stepData) {
  const flat = {}
  Object.values(stepData || {}).forEach(stepEntry => {
    const data = stepEntry?.data || {}
    Object.entries(data).forEach(([camelKey, rawVal]) => {
      const snakeKey = camelToSnakeMap[camelKey]
      if (!snakeKey) return
      const lowerCamel = camelKey.toLowerCase()
      let value = rawVal

      if (lowerCamel.includes('date') || lowerCamel.includes('cutoff') || lowerCamel.includes('released')) {
        // Fields mapped to *_cut_off or *_cut_off_request are true datetimes; others are dates.
        if (snakeKey.includes('cut_off')) {
          value = normalizeDateTime(rawVal)
        } else {
          value = normalizeDateOnly(rawVal)
        }
      }
      if (value !== undefined && value !== null && value !== '') {
        flat[snakeKey] = value
      }
    })
  })
  return flat
}

export function bookingToStepData(booking) {
  const stepData = {}
  if (!booking) return stepData

  const fieldsByStepId = steps.reduce((acc, step) => {
    acc[step.id] = step.fields || []
    return acc
  }, {})

  Object.entries(booking).forEach(([snakeKey, value]) => {
    const camelKey = snakeToCamelMap[snakeKey]
    if (!camelKey) return
    const stepId = Object.keys(fieldsByStepId).find(id =>
      fieldsByStepId[id].some(f => f.name === camelKey)
    )
    if (!stepId) return
    if (!stepData[stepId]) {
      const meta = steps.find(s => s.id === stepId)
      stepData[stepId] = {
        stepId,
        title: meta?.title,
        tag: meta?.tag,
        data: {},
      }
    }
    stepData[stepId].data[camelKey] = value
  })

  return stepData
}

async function handleJsonResponse(res) {
  if (!res.ok) {
    let message = 'Request failed'
    try {
      const body = await res.json()
      if (body?.detail) {
        if (Array.isArray(body.detail)) {
          // FastAPI validation errors array
          const msgs = body.detail.map(e => e.msg || JSON.stringify(e)).join('; ')
          message = msgs || message
        } else if (typeof body.detail === 'string') {
          message = body.detail
        } else {
          message = JSON.stringify(body.detail)
        }
      }
    } catch {
      // ignore
    }
    const error = new Error(message)
    error.status = res.status
    throw error
  }
  if (res.status === 204) return null
  return res.json()
}

export async function listBookings(token, { skip = 0, limit = 100 } = {}) {
  const url = new URL(`${API_BASE}/bookings`)
  url.searchParams.set('skip', String(skip))
  url.searchParams.set('limit', String(limit))
  const res = await fetch(url.toString(), { headers: buildHeaders(token) })
  return handleJsonResponse(res)
}

export async function getBooking(token, id) {
  const res = await fetch(`${API_BASE}/bookings/${id}`, { headers: buildHeaders(token) })
  return handleJsonResponse(res)
}

export async function getBookingByKey(token, externalId) {
  const res = await fetch(`${API_BASE}/bookings/key/${externalId}`, { headers: buildHeaders(token) })
  return handleJsonResponse(res)
}

export async function createBooking(token, stepData = {}) {
  const payload = stepDataToPayload(stepData)
  const externalId = generateBookingId()
  payload.external_id = externalId
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  })
  return handleJsonResponse(res)
}

export async function updateBooking(token, id, stepData) {
  const payload = stepDataToPayload(stepData)
  const res = await fetch(`${API_BASE}/bookings/${id}`, {
    method: 'PUT',
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  })
  return handleJsonResponse(res)
}

export async function updateBookingByKey(token, externalId, stepData) {
  const payload = stepDataToPayload(stepData)
  const res = await fetch(`${API_BASE}/bookings/key/${externalId}`, {
    method: 'PUT',
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  })
  return handleJsonResponse(res)
}

export async function deleteBooking(token, id) {
  const res = await fetch(`${API_BASE}/bookings/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(token),
  })
  await handleJsonResponse(res)
}

export async function deleteBookingByKey(token, externalId) {
  const res = await fetch(`${API_BASE}/bookings/key/${externalId}`, {
    method: 'DELETE',
    headers: buildHeaders(token),
  })
  await handleJsonResponse(res)
}

