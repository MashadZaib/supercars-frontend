/**
 * Export register/booking data as XLSX invoice. All values are dynamic from form fields (fullData).
 * Invoice number uses EBKG15401210 format (booking number / invoice no from form).
 */
import ExcelJS from 'exceljs'

const LIGHT_GREEN = 'FFE2EFE9'
const LIGHT_GREY = 'FFF5F5F5'
const LIGHT_RED = 'FFFFE5E5'
const LIGHT_ORANGE = 'FFFFF3E0'
const DARK_GREY = 'FFE0E0E0'

function val(v) {
  if (v == null || v === '') return ''
  return String(v).trim()
}

function dateStr(v) {
  if (!v) return ''
  const d = new Date(v)
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function numStr(v) {
  if (v == null || v === '') return ''
  const n = Number(v)
  return isNaN(n) ? String(v) : (n % 1 === 0 ? String(n) : n.toFixed(2))
}

/** Build all invoice values from register entry and fullData (step form data). */
function getInvoiceData(entry = {}) {
  const fd = entry.fullData || {}
  const step = (id) => fd[String(id)]?.data || {}
  const s1 = step(1), s2 = step(2), s3 = step(3), s4 = step(4), s5 = step(5), s6 = step(6)
  const s7 = step(7), s10 = step(10), s11 = step(11), s12 = step(12), s13 = step(13), s14 = step(14)

  const fileReference = val(entry.fileReference ?? s2.fileReference)
  const clientName = val(entry.clientName ?? s1.clientName)
  const carrier = val(entry.carrier ?? s1.bkMessrsAgent)
  const bookingNumber = val(entry.bookingNumber ?? s3.bookingNumber ?? s4.bookingNumber)
  const vesselName = val(entry.vesselName ?? s3.vesselName ?? s4.vesselName)
  const voyage = val(entry.voyage ?? s3.voyage ?? s4.voyage)
  const pol = val(entry.pol ?? s1.portOfLoad ?? s2.portOfLoad)
  const pod = val(entry.pod ?? s1.portOfDischarge ?? s2.portOfDischarge)
  const containerNumbers = val(entry.containerNumbers ?? s5.containerNumbers ?? s6.containerNumbers)
  const noSizeContainers = val(s1.noSizeContainers ?? s2.noSizeContainers) || ''
  const freightTerms = val(s1.freightTerms ?? s2.freightTerms)

  const invoiceNoFromForm = val(s11.invoiceNo ?? s12.invoiceNo)
  const invoiceNo = invoiceNoFromForm || bookingNumber

  const dateFromForm = s11.dateOfInvoice ?? s12.dateOfInvoice ?? entry.lastUpdatedRaw
  const date = dateStr(dateFromForm)
  const dueDateForPayment = dateStr(s11.dueDateForPayment ?? s12.dueDateForPayment)
  const blRef = val(fileReference ?? s10.carrierBlRef)
  const blIssue = dateStr(s11.dateFinalBlReleased ?? s7.draftBlSharedDate)
  const etdOnBoard = dateStr(s14.dateOfPayment ?? s13.datePaymentReceived)
  const invoiceAmount = numStr(s11.invoiceAmount ?? s12.invoiceAmount)
  const amountPaid = numStr(s13.amountPaid)
  const paymentToShippingLine = numStr(s14.paymentToShippingLine ?? s14.amountOfPayment)
  const latePaymentFee = numStr(s13.amountPaid)

  return {
    fileReference,
    clientName,
    carrier,
    bookingNumber,
    vesselName,
    voyage,
    pol,
    pod,
    containerNumbers,
    noSizeContainers: noSizeContainers || (containerNumbers ? 'CONTAINERS' : ''),
    freightTerms: freightTerms || 'COLLECT',
    invoiceNo,
    date,
    dueDate: dueDateForPayment,
    blRef,
    blIssue,
    etdOnBoard,
    invoiceAmount,
    amountPaid,
    paymentToShippingLine,
    latePaymentFee,
    methodReferenceOfPayment: val(s11.methodReferenceOfPayment ?? s12.methodReferenceOfPayment),
    methodOfPayment: val(s13.methodOfPayment ?? s14.methodOfPayment),
  }
}

export async function exportInvoiceXlsx(registerEntry, filename) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Invoice', { views: [{ showGridLines: true }] })

  const r = getInvoiceData(registerEntry)

  const setCell = (row, col, value, opts = {}) => {
    const cell = ws.getCell(row, col)
    cell.value = value
    const font = {}
    if (opts.bold) font.bold = true
    if (opts.fontSize) font.size = opts.fontSize
    if (opts.fontColor) font.color = { argb: opts.fontColor }
    if (Object.keys(font).length) cell.font = font
    if (opts.bg) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opts.bg } }
    if (opts.align || opts.vertical) {
      cell.alignment = { horizontal: opts.align || 'left', vertical: opts.vertical || 'middle' }
    }
    return cell
  }

  const mergeAndStyle = (startRow, startCol, endRow, endCol, value, opts = {}) => {
    ws.mergeCells(startRow, startCol, endRow, endCol)
    setCell(startRow, startCol, value, opts)
  }

  ws.getColumn(2).width = 18
  ws.getColumn(3).width = 22
  ws.getColumn(4).width = 16
  ws.getColumn(5).width = 14
  ws.getColumn(6).width = 10
  ws.getColumn(7).width = 12
  ws.getColumn(8).width = 12
  ws.getColumn(9).width = 16
  ws.getColumn(10).width = 14

  setCell(2, 2, 'SUPER CARS CO.,LTD', { bold: true, fontSize: 14 })
  setCell(3, 2, '1-12-10-105 Tatekawa Ayase Shi Kanagawa ken')
  setCell(4, 2, 'Tel : (04) 6740-4743')
  setCell(5, 2, 'Fax : (04) 6740-4874')
  setCell(2, 9, r.fileReference || '', { bold: true, align: 'right' })
  setCell(4, 8, 'Date:', { align: 'right' })
  setCell(4, 9, r.date || '', { align: 'right' })
  setCell(5, 8, 'Invoice No:', { align: 'right' })
  setCell(5, 9, r.invoiceNo || '', { align: 'right' })

  let row = 7
  mergeAndStyle(row, 2, row, 9, 'INVOICE', { bold: true, fontSize: 18, bg: LIGHT_GREEN, align: 'center' })
  row = 9
  mergeAndStyle(row, 2, row, 4, (r.clientName || '').toUpperCase() || 'CLIENT', { bold: true, bg: LIGHT_GREEN })
  row = 11

  const vesselVoyage = [r.vesselName, r.voyage].filter(Boolean).join(' - ')
  const details = [
    ['SHIPPING LINE', r.carrier],
    ['BOOKING', r.bookingNumber],
    ['VESSEL/VOYAGE', vesselVoyage],
    ['CONTAINER', r.containerNumbers],
    ['CONTAINER', r.containerNumbers],
    ['B/L', r.blRef],
    ['POL (Port of Loading)', r.pol],
    ['POD (Port of Discharge)', r.pod],
    ['BL ISSUE', r.blIssue],
    ['ETD/ON BOARD', r.etdOnBoard],
    ['POD ETA', ''],
    ['40\'HC', r.noSizeContainers],
    ['FREIGHT TYPE', r.freightTerms],
  ]

  details.forEach(([label, value], i) => {
    const rn = row + i
    setCell(rn, 2, label, { bold: true, bg: LIGHT_GREEN })
    setCell(rn, 3, value ?? '', { bg: LIGHT_GREEN })
  })
  setCell(row + 7, 9, r.dueDate || '', { align: 'right', bg: LIGHT_GREEN })
  setCell(row + 8, 8, 'PAYMENT DUE DATE', { align: 'right', bold: true, bg: LIGHT_GREEN })

  row += details.length + 2
  setCell(row, 2, 'FREIGHT & CHARGES', { bold: true, bg: LIGHT_GREEN })
  setCell(row, 6, 'CURRENCY', { bold: true, bg: LIGHT_GREEN })
  setCell(row, 7, 'PRICE', { bold: true, bg: LIGHT_GREEN })
  setCell(row, 8, 'EX/RATE', { bold: true, bg: LIGHT_GREEN })
  setCell(row, 9, 'AMOUNT IN JPY', { bold: true, bg: LIGHT_GREEN })
  row++

  const fd = registerEntry.fullData || {}
  const s11 = fd['11']?.data || {}
  const s12 = fd['12']?.data || {}
  const oceanFreight = numStr(s11.invoiceAmount ?? s12.invoiceAmount)
  const freightRows = [
    ['Ocean Freight', 'USD', '', '', oceanFreight],
    ['THC (Japan)', 'JPY', '', '', ''],
    ['Global Fuel Surcharges', 'USD', '', '', ''],
  ]
  freightRows.forEach(([desc, curr, price, rate, amount]) => {
    setCell(row, 2, desc, { bg: LIGHT_GREY })
    setCell(row, 6, curr, { bg: LIGHT_GREY })
    setCell(row, 7, price, { bg: LIGHT_GREY, align: 'right' })
    setCell(row, 8, rate, { bg: LIGHT_GREY, align: 'right' })
    setCell(row, 9, amount ?? '', { bg: LIGHT_GREY, align: 'right' })
    row++
  })
  row++

  const s13 = fd['13']?.data || {}
  const s14 = fd['14']?.data || {}
  const feeRows = [
    ['Cargo Data Declaration (BL) / Per Bill', 'USD', '', '', ''],
    ['Seal Fee', 'USD', '', '', ''],
    ['Documentation Fee (BL) / Per Bill', 'JPY', '', '', ''],
    ['Booking Service fee', 'JPY', '', '', ''],
    ['Telexrelese Fee', 'JPY', '', '', ''],
    ['Amend fee', 'JPY', '', '', ''],
    ['LG fee', 'JPY', '', '', ''],
    ['Split B/L fee', 'JPY', '', '', ''],
    ['Original bill Fee', 'JPY', '', '', ''],
  ]
  feeRows.forEach(([desc, curr, v1, v2, amount]) => {
    setCell(row, 2, desc, { bg: LIGHT_GREY })
    setCell(row, 3, curr, { bg: LIGHT_GREY })
    setCell(row, 4, v1, { bg: LIGHT_GREY, align: 'right' })
    setCell(row, 5, v2, { bg: LIGHT_GREY, align: 'right' })
    setCell(row, 6, amount ?? '', { bg: LIGHT_GREY, align: 'right' })
    row++
  })

  const lateFeeAmount = numStr(s13.amountPaid) || '66,000'
  setCell(row, 2, `Late Payment BL pickup (JPY ${lateFeeAmount}) STRICLY`, { bold: true, bg: LIGHT_RED })
  row++
  setCell(row, 2, 'SHIPPING LINE FREIGHT PAYMENT WITHIN 14 DAYS LIMIT', { fontSize: 10, bg: LIGHT_ORANGE })
  row++
  setCell(row, 2, 'Booking Change/ cancel / amend / slide JPY 10,000', { bg: LIGHT_GREY })
  setCell(row, 3, 'JPY', { bg: LIGHT_GREY })
  row++
  setCell(row, 2, 'If due date passed please add late payment fee amoun', { fontColor: 'FFFF0000', bg: LIGHT_GREY })
  setCell(row, 3, 'JPY', { bg: LIGHT_GREY })
  setCell(row, 4, lateFeeAmount, { bg: LIGHT_GREY, align: 'right' })
  row++
  setCell(row, 2, 'AMOUNT DUE', { bold: true, bg: DARK_GREY })
  row++
  const amountDue = r.invoiceAmount ? `JPY ${r.invoiceAmount}` : (r.amountPaid ? `JPY ${r.amountPaid}` : '')
  mergeAndStyle(row, 4, row, 6, amountDue, { bold: true, align: 'right', bg: DARK_GREY })
  row++
  setCell(row, 2, 'REMARKS', { bold: true, bg: DARK_GREY })
  row++
  setCell(row, 2, 'BANK INFORMATION', { bold: true, bg: DARK_GREY })
  row++
  const bankRows = [
    ['BANK NAME:', 'SBI SUMISHIN NET BANK'],
    ['ACCOUNT NUMBER:', '2189829'],
    ['BRANCH:', 'HOJINDAICHI / 106'],
    ['ACCOUNT NAME:', 'SUPER CARS K K'],
  ]
  bankRows.forEach(([label, value]) => {
    setCell(row, 2, label, { bg: LIGHT_GREEN })
    setCell(row, 4, value, { bg: LIGHT_GREEN })
    row++
  })

  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = (filename && !filename.endsWith('.xlsx')) ? `${filename.replace(/\.csv$/i, '')}.xlsx` : (filename || 'invoice.xlsx')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
