import * as Yup from 'yup';

export const bookingRequestSchema = Yup.object().shape({
  requestedDate: Yup.date().required('Requested date is required'),
  typeOfRequest: Yup.string().required('Type of request is required'),
  bookingParty: Yup.string().required('Booking party is required'),
  userId: Yup.string().required('User is required'),
  portOfLoad: Yup.string().required('Port of load is required'),
  portOfDischarge: Yup.string().required('Port of discharge is required'),
  cargoType: Yup.string().required('Cargo type is required'),
  containerSize: Yup.string().required('Container size is required'),
  quantity: Yup.number().required('Quantity is required').positive('Quantity must be positive'),
  hsCode: Yup.string().required('HS Code is required'),
  weightKg: Yup.number().required('Weight is required').positive('Weight must be positive'),
  commodity: Yup.string().required('Commodity is required'),
  shippingLines: Yup.array().of(
    Yup.object().shape({
      carrier: Yup.string().required('Carrier name is required'),
      dateSent: Yup.string().required('Date sent is required'),
      method: Yup.string().required('Method is required'),
      confirmationId: Yup.string(),
      status: Yup.string().required('Status is required'),
      freight: Yup.string()
    })
  ).min(1, 'At least one shipping line is required')
});

export const bookingConfirmationSchema = Yup.object().shape({
  carrierName: Yup.string().required('Carrier name is required'),
  ratesConfirmed: Yup.string().required('Rates confirmed is required'),
  bookingConfirmationNo: Yup.string().required('Booking confirmation number is required'),
  bookingDate: Yup.date().required('Booking date is required'),
  shipper: Yup.string().required('Shipper is required'),
  portOfLoad: Yup.string().required('Port of load is required'),
  portOfDischarge: Yup.string().required('Port of discharge is required'),
  vesselName: Yup.string().required('Vessel name is required'),
  voyage: Yup.string().required('Voyage is required'),
  containerSize: Yup.string().required('Container size is required'),
  quantity: Yup.number().required('Quantity is required').positive('Quantity must be positive'),
  weightKg: Yup.number().required('Weight is required').positive('Weight must be positive'),
  cyCfs: Yup.string().required('CY/CFS is required'),
  hsCode: Yup.string().required('HS Code is required'),
  cargoDescription: Yup.string().required('Cargo description is required')
});

export const clientInfoSchema = Yup.object().shape({
  date: Yup.string().required('Date is required'),
  methodSent: Yup.string().required('Method sent is required'),
  client: Yup.string().required('Client is required'),
  companyRegistrationNo: Yup.string().required('Company registration number is required'),
  taxId: Yup.string().required('Tax ID is required'),
  companyVatNo: Yup.string().required('Company VAT number is required'),
  contactPerson: Yup.string().required('Contact person is required'),
  phone: Yup.string().required('Phone is required').matches(/^[0-9+\-\s()]+$/, 'Phone number is not valid'),
  email: Yup.string().required('Email is required').email('Email is not valid')
});

export const shippingInstructionsSchema = Yup.object().shape({
  typeOfBillOfLading: Yup.string().required('Type of bill of lading is required'),
  shipper: Yup.object().shape({
    name: Yup.string().required('Shipper name is required'),
    phone: Yup.string().required('Shipper phone is required'),
    contactPerson: Yup.string().required('Shipper contact person is required'),
    email: Yup.string().required('Shipper email is required').email('Email is not valid')
  }),
  consignee: Yup.object().shape({
    name: Yup.string().required('Consignee name is required'),
    phone: Yup.string().required('Consignee phone is required'),
    contactPerson: Yup.string().required('Consignee contact person is required'),
    email: Yup.string().required('Consignee email is required').email('Email is not valid')
  }),
  notify: Yup.object().shape({
    name: Yup.string().required('Notify name is required'),
    phone: Yup.string().required('Notify phone is required'),
    contactPerson: Yup.string().required('Notify contact person is required'),
    email: Yup.string().required('Notify email is required').email('Email is not valid')
  }),
  vessel: Yup.string().required('Vessel is required'),
  voyage: Yup.string().required('Voyage is required'),
  portOfLoad: Yup.string().required('Port of load is required'),
  portOfDischarge: Yup.string().required('Port of discharge is required'),
  vehicles: Yup.array().of(
    Yup.object().shape({
      make: Yup.string().required('Make is required'),
      year: Yup.string().required('Year is required'),
      color: Yup.string().required('Color is required'),
      chassisNo: Yup.string().required('Chassis number is required')
    })
  ).min(1, 'At least one vehicle is required'),
  marksNumbers: Yup.array().of(
    Yup.object().shape({
      containerNo: Yup.string().required('Container number is required'),
      sealNo: Yup.string().required('Seal number is required'),
      size: Yup.string().required('Size is required')
    })
  ).min(1, 'At least one container is required')
});

export const chargesSchema = Yup.object().shape({
  charges: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().required('Description is required'),
      currency: Yup.string().required('Currency is required'),
      amount: Yup.number().required('Amount is required').min(0, 'Amount must be positive'),
      quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
      taxable: Yup.boolean()
    })
  ).min(1, 'At least one charge is required'),
  bankDetails: Yup.object().shape({
    bankName: Yup.string().required('Bank name is required'),
    branch: Yup.string().required('Branch is required'),
    accountType: Yup.string().required('Account type is required'),
    accountNumber: Yup.string().required('Account number is required'),
    accountName: Yup.string().required('Account name is required'),
    accountNameKana: Yup.string().required('Account name Kana is required')
  })
});

export const createClientSchema = Yup.object().shape({
  companyName: Yup.string().required('Company name is required'),
  taxId: Yup.string().required('Tax ID is required'),
  billingAddress: Yup.string().required('Billing address is required'),
  contactPerson: Yup.string().required('Contact person is required'),
  phone: Yup.string().required('Phone is required'),
  email: Yup.string().required('Email is required').email('Email is not valid')
});