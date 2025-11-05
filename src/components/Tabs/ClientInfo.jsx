import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import StepHeading from '../Common/StepHeading'
import { clientInfoSchema } from '../../schemas/validationSchemas'

const ClientInfo = ({ setShowModal, setModalConfig, onSubmit, initialData, onFormValidityChange, modalResult = null  }) => {
  const initialValues = {
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }),
    methodSent: '',
    client: '',
    companyRegistrationNo: '',
    taxId: '',
    companyVatNo: '',
    contactPerson: '',
    phone: '',
    email: '',
    billingAddress: '',
    shippingAddress: '',
    country: '',
    city: '',
    postalCode: '',
    paymentTerms: '',
    currency: 'USD'
  }

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Client Information Data:', values)
    if (onSubmit) {
      onSubmit(values, true)
    }
    setSubmitting(false)
  }

  const countries = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Japan',
    'China',
    'UAE',
    'Saudi Arabia',
    'Other'
  ]

  const paymentTermsOptions = [
    'Net 15',
    'Net 30',
    'Net 45',
    'Net 60',
    'Due on Receipt',
    '50% Advance, 50% on Delivery',
    'Custom'
  ]

  const currencyOptions = [
    'USD - US Dollar',
    'EUR - Euro',
    'GBP - British Pound',
    'JPY - Japanese Yen',
    'CAD - Canadian Dollar',
    'AUD - Australian Dollar',
    'CNY - Chinese Yuan'
  ]

  return (
    <>
      <StepHeading 
        title="Client Information" 
        description="Enter the client details for invoice generation" 
      />

     <Formik
         initialValues={initialData && Object.keys(initialData).length ? initialData : initialValues}
         validationSchema={clientInfoSchema}
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
            {/* Date and Method Sent */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="date" className="form-label">
                  Date <span className="text-danger">*</span>
                </label>
                <Field 
                  type="text" 
                  name="date"
                  className={`form-control ${touched.date && errors.date ? 'is-invalid' : ''}`}
                  readOnly 
                />
                <ErrorMessage name="date" component="div" className="text-danger small mt-1" />
              </div>
              <div className="col-md-6">
                <label htmlFor="methodSent" className="form-label">
                  Method Sent <span className="text-danger">*</span>
                </label>
                <Field 
                  as="select" 
                  name="methodSent" 
                  className={`form-select ${touched.methodSent && errors.methodSent ? 'is-invalid' : ''}`}
                >
                  <option value="">Select Method</option>
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Verbal">Verbal</option>
                  <option value="In Person">In Person</option>
                  <option value="Post">Post</option>
                  <option value="Other">Other</option>
                </Field>
                <ErrorMessage name="methodSent" component="div" className="text-danger small mt-1" />
              </div>
            </div>

            {/* Client Search */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="client" className="form-label">
                  Client Name & Address <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field 
                    type="text" 
                    name="client"
                    className={`form-control ${touched.client && errors.client ? 'is-invalid' : ''}`}
                    placeholder="Search Clients Name & Address" 
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                <ErrorMessage name="client" component="div" className="text-danger small mt-1" />
              </div>
              <div className="col-md-6 text-end">
              <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setModalConfig({
                      title: 'Create New Client',
                      fields: [
                        { name: 'clientName', label: 'Client Name', required: true }, 
                        { type: "textarea", name: 'clientAddress', label: 'Client Address', required: true }                     
                      ]
                    })
                    setShowModal(true)
                  }}
                >
                  <i className="fas fa-plus"></i> Create New
                </button>
              </div>
            </div>

            {/* Company Information */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Company Information</h6>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="companyRegistrationNo" className="form-label">
                      Company Registration No
                    </label>
                    <Field 
                      type="text" 
                      name="companyRegistrationNo"
                      className="form-control"
                      placeholder="Enter Company Registration No" 
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="taxId" className="form-label">
                      Tax ID
                    </label>
                    <Field 
                      type="text" 
                      name="taxId"
                      className="form-control"
                      placeholder="Enter Tax ID" 
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="companyVatNo" className="form-label">
                      Company VAT No
                    </label>
                    <Field 
                      type="text" 
                      name="companyVatNo"
                      className="form-control"
                      placeholder="Enter Company VAT No" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Contact Information</h6>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="contactPerson" className="form-label">
                      Contact Person
                    </label>
                    <Field 
                      type="text" 
                      name="contactPerson"
                      className="form-control"
                      placeholder="Enter contact name" 
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">
                      Phone
                    </label>
                    <Field 
                      type="text" 
                      name="phone"
                      className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                      placeholder="Enter Phone Number" 
                    />
                    <ErrorMessage name="phone" component="div" className="text-danger small mt-1" />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <Field 
                      type="email" 
                      name="email"
                      className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                      placeholder="Enter Email Address" 
                    />
                    <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
                  </div>
                  {/* <div className="col-md-6">
                    <label htmlFor="currency" className="form-label">
                      Preferred Currency
                    </label>
                    <Field 
                      as="select" 
                      name="currency" 
                      className="form-select"
                    >
                      {currencyOptions.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </Field>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Address Information */}
            {/* <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Address Information</h6>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="billingAddress" className="form-label">
                      Billing Address
                    </label>
                    <Field 
                      as="textarea" 
                      name="billingAddress"
                      className="form-control"
                      rows="3"
                      placeholder="Enter complete billing address" 
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="shippingAddress" className="form-label">
                      Shipping Address
                    </label>
                    <Field 
                      as="textarea" 
                      name="shippingAddress"
                      className="form-control"
                      rows="3"
                      placeholder="Enter complete shipping address (if different from billing)" 
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <Field 
                      as="select" 
                      name="country" 
                      className="form-select"
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </Field>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="city" className="form-label">
                      City
                    </label>
                    <Field 
                      type="text" 
                      name="city"
                      className="form-control"
                      placeholder="Enter City" 
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="postalCode" className="form-label">
                      Postal Code
                    </label>
                    <Field 
                      type="text" 
                      name="postalCode"
                      className="form-control"
                      placeholder="Enter Postal Code" 
                    />
                  </div>
                </div>
              </div>
            </div> */}

            {/* Payment Information */}
            {/* <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Payment Information</h6>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="paymentTerms" className="form-label">
                      Payment Terms
                    </label>
                    <Field 
                      as="select" 
                      name="paymentTerms" 
                      className="form-select"
                    >
                      <option value="">Select Payment Terms</option>
                      {paymentTermsOptions.map(term => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </Field>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="creditLimit" className="form-label">
                      Credit Limit (Optional)
                    </label>
                    <Field 
                      type="number" 
                      name="creditLimit"
                      className="form-control"
                      placeholder="Enter Credit Limit" 
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div> */}

            {/* Additional Notes */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Additional Notes</h6>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="additionalNotes" className="form-label">
                      Notes & Comments
                    </label>
                    <Field 
                      as="textarea" 
                      name="additionalNotes"
                      className="form-control"
                      rows="4"
                      placeholder="Enter any additional notes or comments about the client..." 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Client Status */}
            {/* <div className="card mb-4">
              <div className="card-header bg-light">
                <h6 className="mb-0">Client Status</h6>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Client Type</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <Field 
                          type="radio" 
                          name="clientType"
                          className="form-check-input"
                          value="Individual"
                        />
                        <label className="form-check-label">Individual</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <Field 
                          type="radio" 
                          name="clientType"
                          className="form-check-input"
                          value="Company"
                        />
                        <label className="form-check-label">Company</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Status</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <Field 
                          type="radio" 
                          name="clientStatus"
                          className="form-check-input"
                          value="Active"
                        />
                        <label className="form-check-label">Active</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <Field 
                          type="radio" 
                          name="clientStatus"
                          className="form-check-input"
                          value="Inactive"
                        />
                        <label className="form-check-label">Inactive</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="clientSince" className="form-label">
                      Client Since
                    </label>
                    <Field 
                      type="date" 
                      name="clientSince"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div> */}

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
                          <i className="fas fa-save me-1"></i> Save Client Information
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

export default ClientInfo