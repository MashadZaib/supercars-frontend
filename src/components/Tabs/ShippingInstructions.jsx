import React from 'react'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import StepHeading from '../Common/StepHeading'
import { shippingInstructionsSchema } from '../../schemas/validationSchemas'

const ShippingInstructions = ({ setShowClientModal, onSubmit, initialData, onFormValidityChange }) => {
  const initialValues = {
    typeOfBillOfLading: '',
    shipper: {
      name: '',
      address: '',
      phone: '',
      contactPerson: '',
      email: ''
    },
    consignee: {
      name: '',
      address: '',
      phone: '',
      contactPerson: '',
      email: ''
    },
    notify: {
      name: '',
      address: '',
      phone: '',
      contactPerson: '',
      email: ''
    },
    vessel: '',
    voyage: '',
    bookingReference: '',
    billOfLadingNo: '',
    portOfLoad: '',
    portOfDischarge: '',
    etdDeparture: '',
    etaArrival: '',
    vehicles: [
      {
        make: '',
        year: '',
        color: '',
        chassisNo: '',
        length: '',
        width: '',
        height: '',
        m3: '',
        cc: ''
      }
    ],
    marksNumbers: [
      {
        containerNo: '',
        sealNo: '',
        size: '',
        type: '',
        noOfPackages: '',
        pkgType: '',
        cargoWeight: ''
      }
    ],
    specialInstructions: '',
    dangerousGoods: false,
    temperatureControl: '',
    humidityControl: ''
  }

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Shipping Instructions Data:', values)
    if (onSubmit) {
      onSubmit(values, true)
    }
    setSubmitting(false)
  }

  const containerSizes = [
    '20GP',
    '40GP',
    '40HQ',
    '45HQ',
    '20RF',
    '40RF',
    'Other'
  ]

  const packageTypes = [
    'Pallets',
    'Cartons',
    'Crates',
    'Drums',
    'Bags',
    'Units',
    'Bundles',
    'Other'
  ]

  const vehicleMakes = [
    'Toyota',
    'Honda',
    'Ford',
    'BMW',
    'Mercedes-Benz',
    'Audi',
    'Volkswagen',
    'Nissan',
    'Hyundai',
    'Kia',
    'Other'
  ]

  return (
    <>
      <StepHeading 
        title="Shipping Instructions" 
        description="Enter the shipping details for invoice generation" 
      />

       <Formik
            initialValues={initialData || initialValues}
            validationSchema={shippingInstructionsSchema}
            onSubmit={handleSubmit}
            validateOnMount
            enableReinitialize
          >
        {({ isSubmitting, isValid, touched, values, errors }) => {
            React.useEffect(() => {
              if (onFormValidityChange) onFormValidityChange(isValid);
            }, [isValid]);
        return (
          <Form>
            {/* Type of Bill of Lading */}
            <div className="row mb-4">
              <div className="col-md-12">
                <label htmlFor="typeOfBillOfLading" className="form-label">
                  Type of Bill of Lading <span className="text-danger">*</span>
                </label>
                <Field 
                  as="select" 
                  name="typeOfBillOfLading" 
                  className={`form-select ${touched.typeOfBillOfLading && errors.typeOfBillOfLading ? 'is-invalid' : ''}`}
                >
                  <option value="">Select Type</option>
                  <option value="SEA_WAY">SEA WAY</option>
                  <option value="ORIGINAL">ORIGINAL</option>
                  <option value="TELEX">TELEX</option>
                  <option value="SURRENDER">SURRENDER</option>
                  <option value="COURIER">COURIER</option>
                  <option value="EXPRESS">EXPRESS</option>
                </Field>
                <ErrorMessage name="typeOfBillOfLading" component="div" className="text-danger small mt-1" />
              </div>
            </div>

            {/* Shipper Information */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Shipper Name & Address <span className="text-danger">*</span></h6>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="shipper.name" className="form-label">Company Name</label>
                    <Field 
                      type="text" 
                      name="shipper.name"
                      className={`form-control ${touched.shipper?.name && errors.shipper?.name ? 'is-invalid' : ''}`}
                      placeholder="Enter company name"
                    />
                    <ErrorMessage name="shipper.name" component="div" className="text-danger small mt-1" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="shipper.contactPerson" className="form-label">Contact Person</label>
                    <Field 
                      type="text" 
                      name="shipper.contactPerson"
                      className="form-control"
                      placeholder="Enter contact person name"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="shipper.address" className="form-label">Full Address</label>
                    <Field 
                      as="textarea" 
                      name="shipper.address"
                      className="form-control"
                      rows="3"
                      placeholder="Enter complete address"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="shipper.phone" className="form-label">Phone</label>
                    <Field 
                      type="text" 
                      name="shipper.phone"
                      className="form-control"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="shipper.email" className="form-label">Email</label>
                    <Field 
                      type="email" 
                      name="shipper.email"
                      className={`form-control ${touched.shipper?.email && errors.shipper?.email ? 'is-invalid' : ''}`}
                      placeholder="Enter email address"
                    />
                    <ErrorMessage name="shipper.email" component="div" className="text-danger small mt-1" />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="shipper.fax" className="form-label">Fax (Optional)</label>
                    <Field 
                      type="text" 
                      name="shipper.fax"
                      className="form-control"
                      placeholder="Enter fax number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Consignee Information */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Consignee Name & Address <span className="text-danger">*</span></h6>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="consignee.name" className="form-label">Company Name</label>
                    <Field 
                      type="text" 
                      name="consignee.name"
                      className={`form-control ${touched.consignee?.name && errors.consignee?.name ? 'is-invalid' : ''}`}
                      placeholder="Enter company name"
                    />
                    <ErrorMessage name="consignee.name" component="div" className="text-danger small mt-1" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="consignee.contactPerson" className="form-label">Contact Person</label>
                    <Field 
                      type="text" 
                      name="consignee.contactPerson"
                      className="form-control"
                      placeholder="Enter contact person name"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="consignee.address" className="form-label">Full Address</label>
                    <Field 
                      as="textarea" 
                      name="consignee.address"
                      className="form-control"
                      rows="3"
                      placeholder="Enter complete address"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="consignee.phone" className="form-label">Phone</label>
                    <Field 
                      type="text" 
                      name="consignee.phone"
                      className="form-control"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="consignee.email" className="form-label">Email</label>
                    <Field 
                      type="email" 
                      name="consignee.email"
                      className={`form-control ${touched.consignee?.email && errors.consignee?.email ? 'is-invalid' : ''}`}
                      placeholder="Enter email address"
                    />
                    <ErrorMessage name="consignee.email" component="div" className="text-danger small mt-1" />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="consignee.fax" className="form-label">Fax (Optional)</label>
                    <Field 
                      type="text" 
                      name="consignee.fax"
                      className="form-control"
                      placeholder="Enter fax number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notify Party Information */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Notify Name & Address</h6>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="notify.name" className="form-label">Company Name</label>
                    <Field 
                      type="text" 
                      name="notify.name"
                      className="form-control"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="notify.contactPerson" className="form-label">Contact Person</label>
                    <Field 
                      type="text" 
                      name="notify.contactPerson"
                      className="form-control"
                      placeholder="Enter contact person name"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="notify.address" className="form-label">Full Address</label>
                    <Field 
                      as="textarea" 
                      name="notify.address"
                      className="form-control"
                      rows="3"
                      placeholder="Enter complete address"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="notify.phone" className="form-label">Phone</label>
                    <Field 
                      type="text" 
                      name="notify.phone"
                      className="form-control"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="notify.email" className="form-label">Email</label>
                    <Field 
                      type="email" 
                      name="notify.email"
                      className={`form-control ${touched.notify?.email && errors.notify?.email ? 'is-invalid' : ''}`}
                      placeholder="Enter email address"
                    />
                    <ErrorMessage name="notify.email" component="div" className="text-danger small mt-1" />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="notify.fax" className="form-label">Fax (Optional)</label>
                    <Field 
                      type="text" 
                      name="notify.fax"
                      className="form-control"
                      placeholder="Enter fax number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vessel and Voyage Information */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Vessel & Voyage Information</h6>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="vessel" className="form-label">Vessel Name</label>
                    <Field 
                      type="text" 
                      name="vessel"
                      className="form-control"
                      placeholder="Enter Vessel Name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="voyage" className="form-label">Voyage Number</label>
                    <Field 
                      type="text" 
                      name="voyage"
                      className="form-control"
                      placeholder="Enter Voyage Number"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="bookingReference" className="form-label">Booking Reference</label>
                    <Field 
                      type="text" 
                      name="bookingReference"
                      className="form-control"
                      placeholder="Enter Booking Reference"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="billOfLadingNo" className="form-label">Bill of Lading No</label>
                    <Field 
                      type="text" 
                      name="billOfLadingNo"
                      className="form-control"
                      placeholder="Enter Bill of Lading No"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Port Information */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Port Information</h6>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="portOfLoad" className="form-label">Port of Load</label>
                    <Field 
                      type="text" 
                      name="portOfLoad"
                      className="form-control"
                      placeholder="Enter Port of Load"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="portOfDischarge" className="form-label">Port of Discharge</label>
                    <Field 
                      type="text" 
                      name="portOfDischarge"
                      className="form-control"
                      placeholder="Enter Port of Discharge"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="etdDeparture" className="form-label">ETD (Estimated Time of Departure)</label>
                    <Field 
                      type="datetime-local" 
                      name="etdDeparture"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="etaArrival" className="form-label">ETA (Estimated Time of Arrival)</label>
                    <Field 
                      type="datetime-local" 
                      name="etaArrival"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicles Information */}
            <div className="card mb-4">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Vehicles Information</h6>
                <FieldArray name="vehicles">
                  {({ push, remove }) => (
                    <button 
                      type="button" 
                      className="btn btn-primary btn-sm"
                      onClick={() => push({
                        make: '',
                        year: '',
                        color: '',
                        chassisNo: '',
                        length: '',
                        width: '',
                        height: '',
                        m3: '',
                        cc: ''
                      })}
                    >
                      <i className="fas fa-plus me-1"></i> Add Vehicle
                    </button>
                  )}
                </FieldArray>
              </div>
              <div className="card-body">
                <FieldArray name="vehicles">
                  {({ push, remove }) => (
                    <>
                      {values.vehicles.map((vehicle, index) => (
                        <div key={index} className="border-bottom pb-3 mb-3">
                          <div className="row mb-2">
                            <div className="col-md-11">
                              <h6 className="text-primary">Vehicle {index + 1}</h6>
                            </div>
                            <div className="col-md-1 text-end">
                              {values.vehicles.length > 1 && (
                                <button 
                                  type="button" 
                                  className="btn btn-danger btn-sm"
                                  onClick={() => remove(index)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3">
                              <label className="form-label">Make</label>
                              <Field 
                                as="select" 
                                name={`vehicles.${index}.make`} 
                                className="form-select"
                              >
                                <option value="">Select Make</option>
                                {vehicleMakes.map(make => (
                                  <option key={make} value={make}>{make}</option>
                                ))}
                              </Field>
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">Year</label>
                              <Field 
                                type="text" 
                                name={`vehicles.${index}.year`} 
                                className="form-control"
                                placeholder="Year"
                                maxLength="4"
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">Color</label>
                              <Field 
                                type="text" 
                                name={`vehicles.${index}.color`} 
                                className="form-control"
                                placeholder="Color"
                              />
                            </div>
                            <div className="col-md-5">
                              <label className="form-label">Chassis No</label>
                              <Field 
                                type="text" 
                                name={`vehicles.${index}.chassisNo`} 
                                className="form-control"
                                placeholder="Chassis Number"
                              />
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-md-2">
                              <label className="form-label">Length (m)</label>
                              <Field 
                                type="number" 
                                name={`vehicles.${index}.length`} 
                                className="form-control"
                                placeholder="L"
                                step="0.01"
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">Width (m)</label>
                              <Field 
                                type="number" 
                                name={`vehicles.${index}.width`} 
                                className="form-control"
                                placeholder="W"
                                step="0.01"
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">Height (m)</label>
                              <Field 
                                type="number" 
                                name={`vehicles.${index}.height`} 
                                className="form-control"
                                placeholder="H"
                                step="0.01"
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">Volume (m³)</label>
                              <Field 
                                type="number" 
                                name={`vehicles.${index}.m3`} 
                                className="form-control"
                                placeholder="M3"
                                step="0.01"
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">Engine CC</label>
                              <Field 
                                type="number" 
                                name={`vehicles.${index}.cc`} 
                                className="form-control"
                                placeholder="CC"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </FieldArray>
              </div>
            </div>

            {/* Marks & Numbers */}
            <div className="card mb-4">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Marks & Numbers</h6>
                <FieldArray name="marksNumbers">
                  {({ push, remove }) => (
                    <button 
                      type="button" 
                      className="btn btn-primary btn-sm"
                      onClick={() => push({
                        containerNo: '',
                        sealNo: '',
                        size: '',
                        type: '',
                        noOfPackages: '',
                        pkgType: '',
                        cargoWeight: ''
                      })}
                    >
                      <i className="fas fa-plus me-1"></i> Add Container
                    </button>
                  )}
                </FieldArray>
              </div>
              <div className="card-body">
                <FieldArray name="marksNumbers">
                  {({ push, remove }) => (
                    <>
                      {values.marksNumbers.map((mark, index) => (
                        <div key={index} className="border-bottom pb-3 mb-3">
                          <div className="row mb-2">
                            <div className="col-md-11">
                              <h6 className="text-primary">Container {index + 1}</h6>
                            </div>
                            <div className="col-md-1 text-end">
                              {values.marksNumbers.length > 1 && (
                                <button 
                                  type="button" 
                                  className="btn btn-danger btn-sm"
                                  onClick={() => remove(index)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3">
                              <label className="form-label">Container No</label>
                              <Field 
                                type="text" 
                                name={`marksNumbers.${index}.containerNo`} 
                                className="form-control"
                                placeholder="Container Number"
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">Seal No</label>
                              <Field 
                                type="text" 
                                name={`marksNumbers.${index}.sealNo`} 
                                className="form-control"
                                placeholder="Seal Number"
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">Size</label>
                              <Field 
                                as="select" 
                                name={`marksNumbers.${index}.size`} 
                                className="form-select"
                              >
                                <option value="">Select Size</option>
                                {containerSizes.map(size => (
                                  <option key={size} value={size}>{size}</option>
                                ))}
                              </Field>
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">Type</label>
                              <Field 
                                type="text" 
                                name={`marksNumbers.${index}.type`} 
                                className="form-control"
                                placeholder="Container Type"
                              />
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-md-3">
                              <label className="form-label">No. of Packages</label>
                              <Field 
                                type="number" 
                                name={`marksNumbers.${index}.noOfPackages`} 
                                className="form-control"
                                placeholder="Packages"
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">Package Type</label>
                              <Field 
                                as="select" 
                                name={`marksNumbers.${index}.pkgType`} 
                                className="form-select"
                              >
                                <option value="">Select Type</option>
                                {packageTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </Field>
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">Cargo Weight (kg)</label>
                              <Field 
                                type="number" 
                                name={`marksNumbers.${index}.cargoWeight`} 
                                className="form-control"
                                placeholder="Weight"
                                step="0.01"
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label">Gross Weight (kg)</label>
                              <Field 
                                type="number" 
                                name={`marksNumbers.${index}.grossWeight`} 
                                className="form-control"
                                placeholder="Gross Weight"
                                step="0.01"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </FieldArray>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Special Instructions & Requirements</h6>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="specialInstructions" className="form-label">
                      Special Instructions
                    </label>
                    <Field 
                      as="textarea" 
                      name="specialInstructions"
                      className="form-control"
                      rows="4"
                      placeholder="Enter any special instructions, handling requirements, or additional information..."
                    />
                  </div>
                </div>
                {/* <div className="row">
                  <div className="col-md-4">
                    <div className="form-check">
                      <Field 
                        type="checkbox" 
                        name="dangerousGoods"
                        className="form-check-input"
                      />
                      <label className="form-check-label">
                        Dangerous Goods
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="temperatureControl" className="form-label">
                      Temperature Control (°C)
                    </label>
                    <Field 
                      type="text" 
                      name="temperatureControl"
                      className="form-control"
                      placeholder="e.g., +2 to +8"
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="humidityControl" className="form-label">
                      Humidity Control (%)
                    </label>
                    <Field 
                      type="text" 
                      name="humidityControl"
                      className="form-control"
                      placeholder="e.g., 40-60%"
                    />
                  </div>
                </div> */}
              </div>
            </div>

            {/* Form Actions */}
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="d-flex justify-content-end">
                
                  <div>
                   
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-1"></i> Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-1"></i> Save Shipping Instructions
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

           
          </Form>
        );
        }}
      </Formik>
    </>
  )
}

export default ShippingInstructions