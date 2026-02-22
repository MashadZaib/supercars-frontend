export const steps = [
  {
    id: "1",
    title: "1 CLIENT TO CARIZO",
    short: "NEW BOOKING INSTRUCTIONS RECEIVED FROM CLIENT",
    tag: "CLIENT TO CARIZO",
    desc: "NEW BOOKING INSTRUCTIONS RECEIVED FROM CLIENT",
    fields: [
      { name: "newBookingInstructions", label: "NEW BOOKING INSTRUCTIONS RECEIVED FROM CLIENT", type: "textarea" },
      { name: "dateReceivedFromClient", label: "DATE RECEIVED FROM CLIENT", type: "date" },
      { name: "method", label: "METHOD:", type: "text" },
      { name: "clientName", label: "CLIENT NAME:", type: "text" },
      { name: "clientAddress", label: "CLIENT ADDRESS:", type: "textarea" },
      { name: "clientEmail", label: "CLIENT EMAIL:", type: "email" },
      { name: "clientContactNo", label: "CLIENT CONTACT NO:", type: "text" },
      { name: "portOfLoad", label: "PORT OF LOAD:", type: "text" },
      { name: "portOfDischarge", label: "PORT OF DISCHARGE:", type: "text" },
      { name: "noSizeContainers", label: "NO, SIZE OF CONTAINERS:", type: "text" },
      { name: "numberOfVehicles", label: "NUMBER OF VEHICLES:", type: "text" },
      { name: "cyDetails", label: "CY DETAILS:", type: "textarea" },
      { name: "freightTerms", label: "FREIGHT TERMS:", type: "text" },
      { name: "blType", label: "B/L TYPE:", type: "text" },
      { name: "customBrokerYardName", label: "CUSTOM BROKER/ YARD NAME:", type: "text" },
      { name: "bkMessrsAgent", label: "BK MESSRS/AGENT:", type: "text" }
    ]
  },
  {
    id: "2",
    title: "2 CARIZO TO SHIPPING LINE",
    short: "NEW BOOKING REQUEST SENT TO SHIPPING LINE",
    tag: "CARIZO TO SHIPPING LINE",
    desc: "NEW BOOKING REQUEST SENT TO SHIPPING LINE",
    fields: [
      { name: "newBookingRequestSent", label: "NEW BOOKING REQUEST SENT TO SHIPPING LINE", type: "date" },
      { name: "fileReference", label: "FILE REFERENCE", type: "text" },
      { name: "carrierRequestedDate", label: "CARRIER REQUESTED DATE", type: "date" },
      { name: "portOfLoad", label: "PORT OF LOAD", type: "text" },
      { name: "portOfDischarge", label: "PORT OF DISCHARGE", type: "text" },
      { name: "noSizeContainers", label: "NO, SIZE OF CONTAINERS", type: "text" },
      { name: "numberOfVehicles", label: "NUMBER OF VEHICLES", type: "text" },
      { name: "freightTerms", label: "FREIGHT TERMS", type: "text" },
      { name: "blType", label: "B/L TYPE", type: "text" },
      { name: "cyDetails", label: "CY DETAILS", type: "textarea" },
      { name: "containerReleaseFromDepot", label: "CONTAINER RELEASE FROM DEPOT", type: "text" }
    ]
  },
  {
    id: "3",
    title: "3 SHIPPING LINE TO CARIZO",
    short: "NEW BOOKING REQUEST RECEIVED FROM SHIPPING LINE",
    tag: "SHIPPING LINE TO CARIZO",
    desc: "NEW BOOKING REQUEST RECEIVED FROM SHIPPING LINE",
    fields: [
      { name: "newBookingRequestReceived", label: "NEW BOOKING REQUEST RECEIVED FROM SHIPPING LINE", type: "date" },
      { name: "rateConfirmedMonthly", label: "RATE CONFIRMED MONTHLY", type: "text" },
      { name: "bookingConfirmationReceived", label: "BOOKING CONFIRMATION RECEIVED FROM SHIPPING LINE", type: "date" },
      { name: "bookingNumber", label: "BOOKING NUMBER", type: "text" },
      { name: "vesselName", label: "VESSEL NAME", type: "text" },
      { name: "voyage", label: "VOYAGE", type: "text" },
      { name: "cyCutOff", label: "CY CUT OFF", type: "datetime-local" },
      { name: "docCutOff", label: "DOC CUT OFF", type: "datetime-local" },
      { name: "shippingInstructionCutOff", label: "SHIPPING INSTRUCTION CUT OFF", type: "datetime-local" }
    ]
  },
  {
    id: "4",
    title: "4 CARIZO SENDS BOOKING TO CLIENT",
    short: "NEW BOOKING REQUEST SENT TO CLIENT",
    tag: "CARIZO SENDS BOOKING TO CLIENT",
    desc: "NEW BOOKING REQUEST SENT TO CLIENT",
    fields: [
      { name: "newBookingRequestSentToClient", label: "NEW BOOKING REQUEST SENT TO CLIENT", type: "date" },
      { name: "ratesValidity", label: "RATES VALIDTY", type: "text" },
      { name: "bookingConfirmation", label: "BOOKING CONFIRMATION", type: "date" },
      { name: "bookingNumber", label: "BOOKING NUMBER", type: "text" },
      { name: "bookingStatus", label: "BOOKING STATUS", type: "text" },
      { name: "vesselName", label: "VESSEL NAME", type: "text" },
      { name: "voyage", label: "VOYAGE", type: "text" },
      { name: "cyCutOff", label: "CY CUT OFF", type: "datetime-local" },
      { name: "customsDocCutOff", label: "CUSTOMS DOC CUT OFF", type: "datetime-local" },
      { name: "shippingInstructionCutOffRequest", label: "SHIPPING INSTRUCTION CUT OFF REQUEST", type: "datetime-local" }
    ]
  },
  {
    id: "5",
    title: "OPS INSTRUCTIONS SI – 5 SI TO RECEIVE FROM CLIENT",
    short: "SI TO RECEIVE FROM CLIENT",
    tag: "OPS INSTRUCTIONS SI",
    desc: "5 SI TO RECEIVE FROM CLIENT",
    fields: [
      { name: "shippingInstructions", label: "SHIPPING INSTRUCTIONS", type: "textarea" },
      { name: "shipperDetails", label: "SHIPPER Name, Address & Contact", type: "textarea" },
      { name: "consigneeDetails", label: "CONSIGNEE Name, Address & Contact", type: "textarea" },
      { name: "notifyDetails", label: "NOTIFY Name, Address & Contact", type: "textarea" },
      { name: "marksAndNumbers", label: "MARKS AND NUMBERS", type: "textarea" },
      { name: "containerNumbers", label: "CONTAINER NUMBERS", type: "textarea" },
      { name: "sealNumbers", label: "SEAL NUMBERS", type: "textarea" },
      { name: "vehicleDetails", label: "VEHICLE DETAILS", type: "textarea" }
    ]
  },
  {
    id: "6",
    title: "OPS INSTRUCTIONS – 6 CARIZO TO SUBMIT SI TO SHIPPING LINE",
    short: "CARIZO TO SUBMIT SI TO SHIPPING LINE",
    tag: "OPS INSTRUCTIONS",
    desc: "6 CARIZO TO SUBMIT SI TO SHIPPING LINE",
    fields: [
      { name: "submitsShippingInstruction", label: "SUBMITS SHIPPING INSTRUCTION", type: "date" },
      { name: "shippingInstructions", label: "SHIPPING INSTRUCTIONS", type: "textarea" },
      { name: "shipperDetails", label: "SHIPPER Name, Address & Contact", type: "textarea" },
      { name: "consigneeDetails", label: "CONSIGNEE Name, Address & Contact", type: "textarea" },
      { name: "notifyDetails", label: "NOTIFY Name, Address & Contact", type: "textarea" },
      { name: "marksAndNumbers", label: "MARKS AND NUMBERS", type: "textarea" },
      { name: "containerNumbers", label: "CONTAINER NUMBERS", type: "textarea" },
      { name: "vehicleDetails", label: "VEHICLE DETAILS", type: "textarea" }
    ]
  },
  {
    id: "7",
    title: "OPS B/L – 7 BILL OF LADING DRAFT SHARED WITH CARIZO",
    short: "BILL OF LADING DRAFT SHARED WITH CARIZO",
    tag: "OPS B/L",
    desc: "7 BILL OF LADING DRAFT SHARED WITH CARIZO",
    fields: [
      { name: "draftBlSharedDate", label: "BILL OF LADING DRAFT SHARED WITH CARIZO (DATE)", type: "date" },
      { name: "draftBlNotes", label: "NOTES / DISCREPANCIES", type: "textarea" }
    ]
  },
  {
    id: "8",
    title: "OPS B/L – 8 CARIZO SENDS DRAFT B/L TO CLIENT",
    short: "CARIZO SENDS DRAFT B/L TO CLIENT",
    tag: "OPS B/L",
    desc: "8 CARIZO SENDS DRAFT B/L TO  CLIENT",
    fields: [
      { name: "draftBlSentToClientDate", label: "CARIZO SENDS DRAFT B/L TO  CLIENT (DATE)", type: "date" },
      { name: "draftBlToConfirm", label: "DRAFT BILL OF LADING TO CONFIM", type: "textarea" }
    ]
  },
  {
    id: "9",
    title: "OPS B/L – 9 CLIENT SHARES CONFIRMATION OF B/L",
    short: "CLIENT SHARES CONFIRMATION OF B/L",
    tag: "OPS B/L",
    desc: "9 CLIENT SHARES CONFIRMATION OF B/L",
    fields: [
      { name: "receiveDraftBlConfirmation", label: "RECEIVE DRAFT B/L CONFIRMATION", type: "date" },
      { name: "clientConfirmationNotes", label: "CLIENT CONFIRMATION NOTES", type: "textarea" }
    ]
  },
  {
    id: "10",
    title: "OPS B/L – 10 CARIZO SHARES CONFIRMATION OF B/L",
    short: "CARIZO SHARES CONFIRMATION OF B/L",
    tag: "OPS B/L",
    desc: "10 CARIZO SHARES CONFIRMATION OF B/L",
    fields: [
      { name: "confirmDraftBlWithCarrierDate", label: "CONFIRM DRAFT BILL OF LADING WITH CARRIER (DATE)", type: "date" },
      { name: "carrierBlRef", label: "CARRIER B/L REFERENCE", type: "text" }
    ]
  },
  {
    id: "11",
    title: "OPS INVOICE – 11 FROM CARRIER TO CARIZO",
    short: "FROM CARRIER TO CARIZO",
    tag: "OPS INVOICE",
    desc: "11 FROM CARRIER TO CARIZO",
    fields: [
      { name: "dateOfInvoice", label: "DATE OF INVOICE", type: "date" },
      { name: "invoiceNo", label: "INVOICE NO", type: "text" },
      { name: "invoiceAmount", label: "INVOICE AMOUNT", type: "number" },
      { name: "dueDateForPayment", label: "DUE DATE FOR PAYMENT", type: "date" },
      { name: "methodReferenceOfPayment", label: "METHOD/REFERENCE OF PAYMENT", type: "text" },
      { name: "dateFinalBlReleased", label: "DATE FINAL BILL OF LADING RELEASED", type: "date" }
    ]
  },
  {
    id: "12",
    title: "OPS INVOICE – 12 FROM CARZO TO CLIENT",
    short: "FROM CARZO TO CLIENT",
    tag: "OPS INVOICE",
    desc: "12 FROM CARZO TO CLIENT",
    fields: [
      { name: "dateOfInvoice", label: "DATE OF INVOICE", type: "date" },
      { name: "invoiceNo", label: "INVOICE NO", type: "text" },
      { name: "invoiceAmount", label: "INVOICE AMOUNT", type: "number" },
      { name: "dueDateForPayment", label: "DUE DATE FOR PAYMENT", type: "date" }
    ]
  },
  {
    id: "13",
    title: "OPS PAYMENT – 13 PAYMENT FROM CLIENT",
    short: "PAYMENT FROM CLIENT",
    tag: "OPS PAYMENT",
    desc: "13 PAYMENT FROM CLIENT",
    fields: [
      { name: "status", label: "STATUS", type: "text" },
      { name: "methodOfPayment", label: "METHOD OF PAYMENT", type: "text" },
      { name: "datePaymentReceived", label: "DATE PAYMENT RECEIVED", type: "date" },
      { name: "amountPaid", label: "AMOUNT PAID", type: "number" },
      { name: "amendmentRequested", label: "AMENDMENT REQUESTED THEN CARIZO TO CHECK", type: "textarea" }
    ]
  },
  {
    id: "14",
    title: "OPS PAYMENT – 14 PAYMENT FROM CARIZO TO SHIPPING LINE",
    short: "PAYMENT FROM CARIZO TO SHIPPING LINE",
    tag: "OPS PAYMENT",
    desc: "14 PAYMENT FROM CARIZO TO SHIPPING LINE",
    fields: [
      { name: "paymentToShippingLine", label: "PAYMENT TO SHIPPING LINE", type: "number" },
      { name: "dateOfPayment", label: "DATE OF PAYMENT", type: "date" },
      { name: "methodOfPayment", label: "METHOD OF PAYMENT", type: "text" },
      { name: "amountOfPayment", label: "AMOUNT OF PAYMENT", type: "number" },
      { name: "requestToCarrierForAmendments", label: "CARIZO TO SEND REQUEST TO CARRIER FOR AMENDMENTS", type: "textarea" }
    ]
  },
  {
    id: "15",
    title: "OPS B/L – 15 CARRIER TO CONFIRM CAROGO LOADED AND B/L IS READY",
    short: "CARRIER TO CONFIRM CAROGO LOADED AND B/L IS READY",
    tag: "OPS B/L",
    desc: "15 CARRIER TO CONFIRM CAROGO LOADED AND B/L IS READY",
    fields: [
      { name: "carrierConfirmCargoLoaded", label: "CARRIER TO CONFIRM CAROGO LOADED", type: "date" },
      { name: "blReady", label: "B/L IS READY", type: "date" }
    ]
  },
  {
    id: "16",
    title: "OPS B/L – 16 CARIZO TO CONFIRM CARGO LOADED WITH CLIENT B/L IS READY",
    short: "CARIZO TO CONFIRM CARGO LOADED WITH CLIENT B/L IS READY",
    tag: "OPS B/L",
    desc: "16 CARIZO TO CONFIRM CARGO LOADED WITH CLIENT B/L IS READY",
    fields: [
      { name: "carizoConfirmCargoLoaded", label: "CARIZO TO CONFIRM CARGO LOADED WITH CLIENT", type: "date" },
      { name: "blReadyClient", label: "B/L IS READY", type: "date" },
      { name: "notifyClientAmendmentCharges", label: "CARIZO TO NOTIFY CLIENT FOR ACCEPTANCE OF ADDITONAL AMENDMENT CHARGES", type: "textarea" }
    ]
  }
]
