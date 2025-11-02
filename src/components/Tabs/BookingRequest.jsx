import React from 'react';

import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import StepHeading from '../Common/StepHeading'
import { bookingRequestSchema } from '../../schemas/validationSchemas'

const BookingRequest = ({ setShowModal, setModalConfig, onSubmit, initialData, onFormValidityChange }) => {
  const initialValues = {
    requestedDate: '',
    typeOfRequest: '',
    bookingParty: '',
    userId: '',
    portOfLoad: '',
    portOfDischarge: '',
    cargoType: '',
    containerSize: '',
    quantity: '',
    hsCode: '',
    weightKg: '',
    commodity: '',
    shippingLines: [
      { carrier: 'MSC', dateSent: '', method: '', confirmationId: '', status: '', freight: '' },
      { carrier: 'Maersk', dateSent: '', method: '', confirmationId: '', status: '', freight: '' }
    ]
  }

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Booking Request Data:', values)
    if (onSubmit) {
      onSubmit(values, true);
    }
    setSubmitting(false)
  }
  return (
    <>
      <StepHeading 
        title="Booking Request" 
        description="Enter the booking details received from the shipper/client" 
      />

<Formik
    initialValues={initialData && Object.keys(initialData).length ? initialData : initialValues}
    validationSchema={bookingRequestSchema}
    onSubmit={(values, { setSubmitting }) => {
      onSubmit(values, true)
      setSubmitting(false)
    }}
    validateOnMount
    //enableReinitialize={!!initialData} // ✅ only reinitialize when real data exists
  >
    {({ isSubmitting, isValid, touched, values, errors }) => {
    React.useEffect(() => {
      if (onFormValidityChange) onFormValidityChange(isValid);
    }, [isValid]);
        return (
          <Form>
            {/* Request Date and Type */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-6">
                <label htmlFor="requestedDate" className="form-label">
                  Requested Date <span className="text-danger">*</span>
                </label>
                <Field 
                  type="date" 
                  name="requestedDate" 
                  className={`form-control ${touched.requestedDate && errors.requestedDate ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name="requestedDate" component="div" className="text-danger small mt-1" />
              </div>
              <div className="col-md-6">
                <label htmlFor="typeOfRequest" className="form-label">
                  Type Of Request <span className="text-danger">*</span>
                </label>
                <Field 
                  as="select" 
                  name="typeOfRequest" 
                  className={`form-select ${touched.typeOfRequest && errors.typeOfRequest ? 'is-invalid' : ''}`}
                >
                  <option value="">Select Request Type</option>
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Verbal">Verbal</option>
                  <option value="Other">Other</option>
                </Field>
                <ErrorMessage name="typeOfRequest" component="div" className="text-danger small mt-1" />
              </div>
            </div>

            {/* Booking Party */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="bookingParty" className="form-label">
                  Booking Party - Name & Address <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field 
                    type="text" 
                    name="bookingParty"
                    className={`form-control ${touched.bookingParty && errors.bookingParty ? 'is-invalid' : ''}`}
                    placeholder="Search Booking Party - Name & Address" 
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                <ErrorMessage name="bookingParty" component="div" className="text-danger small mt-1" />
              </div>
              <div className="col-md-6 text-end">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setModalConfig({
                  title: 'Create New Booking Party',
                  fields: [
                    { name: 'bookingPartyName', label: 'Booking Party Name', required: true },
                    { type: "textarea", name: 'bookingAddress', label: 'Booking Address', required: true },
                   
                  ]
                })
                setShowModal(true)
              }}
            >
              <i className="fas fa-plus"></i> Create New
            </button>
              </div>
            </div>

            {/* User Selection */}
            <div className="row mb-3">
              <div className="col-md-12">
                <label htmlFor="userId" className="form-label">
                  Users <span className="text-danger">*</span>
                </label>
                <Field 
                  as="select" 
                  name="userId" 
                  className={`form-select ${touched.userId && errors.userId ? 'is-invalid' : ''}`}
                >
                  <option value="">Select User</option>
                  <option value="Yousuf">Yousuf</option>
                  <option value="Sumaya">Sumaya</option>
                  <option value="Khurram">Khurram</option>
                  <option value="Abid">Abid</option>
                </Field>
                <ErrorMessage name="userId" component="div" className="text-danger small mt-1" />
              </div>
            </div>

            {/* Port of Load */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="portOfLoad" className="form-label">
                  Port of Load <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field 
                    type="text" 
                    name="portOfLoad"
                    className={`form-control ${touched.portOfLoad && errors.portOfLoad ? 'is-invalid' : ''}`}
                    placeholder="Search Port of Load" 
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                <ErrorMessage name="portOfLoad" component="div" className="text-danger small mt-1" />
              </div>
              <div className="col-md-6 text-end">
              <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setModalConfig({
                      title: 'Create New Port Of Load',
                      fields: [
                        { name: 'portOfLoad', label: 'Port Of Load', required: true },                      
                      ]
                    })
                    setShowModal(true)
                  }}
                >
                  <i className="fas fa-plus"></i> Create New
                </button>
              </div>
            </div>

            {/* Port of Discharge */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="portOfDischarge" className="form-label">
                  Port of Discharge <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field 
                    type="text" 
                    name="portOfDischarge"
                    className={`form-control ${touched.portOfDischarge && errors.portOfDischarge ? 'is-invalid' : ''}`}
                    placeholder="Search Port of Discharge" 
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                <ErrorMessage name="portOfDischarge" component="div" className="text-danger small mt-1" />
              </div>
              <div className="col-md-6 text-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setModalConfig({
                      title: 'Create New Port of Discharge',
                      fields: [
                        { name: 'portOfLoad', label: 'Port of Discharge', required: true },                      
                      ]
                    })
                    setShowModal(true)
                  }}
                >
                  <i className="fas fa-plus"></i> Create New
                </button>
              </div>
            </div>

            {/* Cargo Type and Container Size */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-6">
                <label htmlFor="cargoType" className="form-label">
                  Cargo Type <span className="text-danger">*</span>
                </label>
                <Field 
                  as="select" 
                  name="cargoType" 
                  className={`form-select ${touched.cargoType && errors.cargoType ? 'is-invalid' : ''}`}
                >
                  <option value="">Select Cargo Type</option>
                  <option value="Drop List">Drop List</option>
                  <option value="FCL">FCL - Full Container Load</option>
                  <option value="LCL">LCL - Less than Container Load</option>
                  <option value="RORO">RORO - Roll on Roll Off</option>
                </Field>
                <ErrorMessage name="cargoType" component="div" className="text-danger small mt-1" />
              </div>
              <div className="col-md-6">
                <label htmlFor="containerSize" className="form-label">
                  Container Size <span className="text-danger">*</span>
                </label>
                <Field 
                  as="select" 
                  name="containerSize" 
                  className={`form-select ${touched.containerSize && errors.containerSize ? 'is-invalid' : ''}`}
                >
                  <option value="">Select Container Size</option>
                  <option value="20GP">20'GP</option>
                  <option value="40GP">40'GP</option>
                  <option value="40HQ">40'HQ</option>
                  <option value="40NOR">40'NOR</option>
                  <option value="Non Operating Reefers">Non Operating Reefers</option>
                  <option value="SOC">SOC</option>
                  <option value="Shipper Own Containers">Shipper Own Containers</option>
                  <option value="Other">Other</option>
                </Field>
                <ErrorMessage name="containerSize" component="div" className="text-danger small mt-1" />
              </div>
            </div>

            {/* Quantity and HS Code */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-6">
                <label htmlFor="quantity" className="form-label">
                  Quantity <span className="text-danger">*</span>
                </label>
                <Field 
                  type="number" 
                  name="quantity"
                  className={`form-control ${touched.quantity && errors.quantity ? 'is-invalid' : ''}`}
                  placeholder="Enter Quantity" 
                />
                <ErrorMessage name="quantity" component="div" className="text-danger small mt-1" />
              </div>
              <div className="col-md-6">
                <label htmlFor="hsCode" className="form-label">
                  HS CODE <span className="text-danger">*</span>
                </label>
                <Field 
                  type="text" 
                  name="hsCode"
                  className={`form-control ${touched.hsCode && errors.hsCode ? 'is-invalid' : ''}`}
                  placeholder="Enter HS CODE" 
                />
                <ErrorMessage name="hsCode" component="div" className="text-danger small mt-1" />
              </div>
            </div>

            {/* Weight and Commodity */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-6">
                <label htmlFor="weightKg" className="form-label">
                  Weight (KG) <span className="text-danger">*</span>
                </label>
                <Field 
                  type="number" 
                  name="weightKg"
                  className={`form-control ${touched.weightKg && errors.weightKg ? 'is-invalid' : ''}`}
                  placeholder="Enter Weight (KG)" 
                />
                <ErrorMessage name="weightKg" component="div" className="text-danger small mt-1" />
              </div>
              <div className="col-md-6">
                <label htmlFor="commodity" className="form-label">
                  Commodity <span className="text-danger">*</span>
                </label>
                <Field 
                  type="text" 
                  name="commodity"
                  className={`form-control ${touched.commodity && errors.commodity ? 'is-invalid' : ''}`}
                  placeholder="Enter Commodity" 
                />
                <ErrorMessage name="commodity" component="div" className="text-danger small mt-1" />
              </div>
            </div>

            {/* Shipping Lines Section */}
            <StepHeading 
              title="Booking Request sent to Shipping lines" 
              description="Enter the booking details received from the shipper/client" 
            />

            <FieldArray name="shippingLines">
              {({ push, remove }) => (
                <>
                  {/* Desktop Table */}
                  <div className="d-none d-md-block table-responsive">
                    <table className="table">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Booking Request sent to Name of Carrier - *Create New or Search</th>
                          <th scope="col">Date Request sent</th>
                          <th scope="col">Drop List - Email/Online Web/Service contract</th>
                          <th scope="col">Carrier Confirmation ID</th>
                          <th scope="col">Drop List - New/Pending/Received/Closed</th>
                          <th scope="col">Drop list - Freight Prepaid/Freight Collect/Freight Elsewhere</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {values.shippingLines.map((line, index) => (
                          <tr key={index}>
                            <td>
                              <Field 
                                name={`shippingLines.${index}.carrier`}
                                className={`form-control ${errors.shippingLines?.[index]?.carrier ? 'is-invalid' : ''}`}
                              />
                              <ErrorMessage 
                                name={`shippingLines.${index}.carrier`} 
                                component="div" 
                                className="text-danger small mt-1" 
                              />
                            </td>
                            <td>
                              <Field 
                                name={`shippingLines.${index}.dateSent`}
                                className="form-control"
                                placeholder="MM/DD/YYYY"
                              />
                            </td>
                            <td>
                              <Field 
                                as="select"
                                name={`shippingLines.${index}.method`}
                                className="form-control"
                              >
                                <option value="">Select Method</option>
                                <option value="Email">Email</option>
                                <option value="Online Web">Online Web</option>
                                <option value="Service Contract">Service Contract</option>
                              </Field>
                            </td>
                            <td>
                              <Field 
                                name={`shippingLines.${index}.confirmationId`}
                                className="form-control"
                                placeholder="Enter Confirmation ID"
                              />
                            </td>
                            <td>
                              <Field 
                                as="select"
                                name={`shippingLines.${index}.status`}
                                className="form-control"
                              >
                                <option value="">Select Status</option>
                                <option value="New">New</option>
                                <option value="Pending">Pending</option>
                                <option value="Received">Received</option>
                                <option value="Closed">Closed</option>
                              </Field>
                            </td>
                            <td>
                              <Field 
                                as="select"
                                name={`shippingLines.${index}.freight`}
                                className="form-control"
                              >
                                <option value="">Select Freight Type</option>
                                <option value="Freight Prepaid">Freight Prepaid</option>
                                <option value="Freight Collect">Freight Collect</option>
                                <option value="Freight Elsewhere">Freight Elsewhere</option>
                              </Field>
                            </td>
                            <td>
                             
                                <button 
                                  type="button" 
                                  className="btn btn-danger btn-sm"
                                  onClick={() => remove(index)}
                                  title="Remove this line"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Table */}
                  <div className="d-md-none responsive-table">
                    {values.shippingLines.map((line, index) => (
                      <div key={index} className="table-row mb-3 p-3 border rounded">
                        <div className="table-cell mb-2">
                          <label className="form-label fw-bold">Booking Request sent to Name of Carrier:</label>
                          <Field 
                            name={`shippingLines.${index}.carrier`}
                            className={`form-control ${errors.shippingLines?.[index]?.carrier ? 'is-invalid' : ''}`}
                          />
                          <ErrorMessage 
                            name={`shippingLines.${index}.carrier`} 
                            component="div" 
                            className="text-danger small mt-1" 
                          />
                        </div>
                        <div className="table-cell mb-2">
                          <label className="form-label fw-bold">Date Request sent:</label>
                          <Field 
                            name={`shippingLines.${index}.dateSent`}
                            className="form-control"
                            placeholder="MM/DD/YYYY"
                          />
                        </div>
                        <div className="table-cell mb-2">
                          <label className="form-label fw-bold">Drop List - Email/Online Web/Service contract:</label>
                          <Field 
                            as="select"
                            name={`shippingLines.${index}.method`}
                            className="form-control"
                          >
                            <option value="">Select Method</option>
                            <option value="Email">Email</option>
                            <option value="Online Web">Online Web</option>
                            <option value="Service Contract">Service Contract</option>
                          </Field>
                        </div>
                        <div className="table-cell mb-2">
                          <label className="form-label fw-bold">Carrier Confirmation ID:</label>
                          <Field 
                            name={`shippingLines.${index}.confirmationId`}
                            className="form-control"
                            placeholder="Enter Confirmation ID"
                          />
                        </div>
                        <div className="table-cell mb-2">
                          <label className="form-label fw-bold">Drop List - New/Pending/Received/Closed:</label>
                          <Field 
                            as="select"
                            name={`shippingLines.${index}.status`}
                            className="form-control"
                          >
                            <option value="">Select Status</option>
                            <option value="New">New</option>
                            <option value="Pending">Pending</option>
                            <option value="Received">Received</option>
                            <option value="Closed">Closed</option>
                          </Field>
                        </div>
                        <div className="table-cell mb-2">
                          <label className="form-label fw-bold">Drop list - Freight Prepaid/Freight Collect/Freight Elsewhere:</label>
                          <Field 
                            as="select"
                            name={`shippingLines.${index}.freight`}
                            className="form-control"
                          >
                            <option value="">Select Freight Type</option>
                            <option value="Freight Prepaid">Freight Prepaid</option>
                            <option value="Freight Collect">Freight Collect</option>
                            <option value="Freight Elsewhere">Freight Elsewhere</option>
                          </Field>
                        </div>
                        {index >= 2 && (
                          <div className="table-cell mb-2">
                            <button 
                              type="button" 
                              className="btn btn-danger btn-sm w-100"
                              onClick={() => remove(index)}
                            >
                              <i className="fas fa-trash me-1"></i> Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="text-end mt-3">
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={() => push({ carrier: '', dateSent: '', method: '', confirmationId: '', status: '', freight: '' })}
                    >
                      <i className="fas fa-plus me-1"></i> Add New Line
                    </button>
                  </div>
                </>
              )}
            </FieldArray>

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
                          <i className="fas fa-save me-1"></i> Save Booking Request
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
  );
};

export default BookingRequest