import React from 'react'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import StepHeading from '../Common/StepHeading'
import { chargesSchema } from '../../schemas/validationSchemas'

const Charges = ({ setShowClientModal, onSubmit, initialData, onFormValidityChange, modalResult = null  }) => {
  const initialValues = {
    charges: [
      {
        description: '',
        currency: 'USD',
        amount: 0,
        quantity: 1,
        taxable: false,
        taxRate: 0,
        notes: ''
      }
    ],
    bankDetails: {
      bankName: '',
      branch: '',
      accountType: '',
      accountNumber: '',
      accountName: '',
      accountNameKana: '',
      swiftCode: '',
      iban: '',
      routingNumber: ''
    },
    paymentTerms: 'Net 30',
    dueDate: '',
    discount: {
      amount: 0,
      type: 'percentage', // 'percentage' or 'fixed'
      reason: ''
    },
    taxSummary: {
      subtotal: 0,
      taxableAmount: 0,
      taxAmount: 0,
      totalAmount: 0
    }
  }

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Charges Data:', values)
    if (onSubmit) {
      onSubmit(values, true)
    }
    setSubmitting(false)
  }

  const calculateChargeTotal = (charge) => {
    return (charge.amount * charge.quantity) || 0
  }

  const calculateTaxAmount = (charge) => {
    if (charge.taxable && charge.taxRate > 0) {
      return (calculateChargeTotal(charge) * charge.taxRate) / 100
    }
    return 0
  }

  const calculateTotals = (charges, discount) => {
    const subtotal = charges.reduce((sum, charge) => sum + calculateChargeTotal(charge), 0)
    const taxableAmount = charges.reduce((sum, charge) => 
      charge.taxable ? sum + calculateChargeTotal(charge) : sum, 0
    )
    const taxAmount = charges.reduce((sum, charge) => sum + calculateTaxAmount(charge), 0)
    
    let discountAmount = 0
    if (discount.type === 'percentage' && discount.amount > 0) {
      discountAmount = (subtotal * discount.amount) / 100
    } else if (discount.type === 'fixed') {
      discountAmount = discount.amount
    }
    
    const totalAmount = subtotal + taxAmount - discountAmount
    
    return {
      subtotal: Math.max(0, subtotal),
      taxableAmount: Math.max(0, taxableAmount),
      taxAmount: Math.max(0, taxAmount),
      discountAmount: Math.max(0, discountAmount),
      totalAmount: Math.max(0, totalAmount)
    }
  }

  const currencyOptions = [
    { value: 'USD', symbol: '$', label: 'USD - US Dollar' },
    { value: 'EUR', symbol: '€', label: 'EUR - Euro' },
    { value: 'GBP', symbol: '£', label: 'GBP - British Pound' },
    { value: 'JPY', symbol: '¥', label: 'JPY - Japanese Yen' },
    { value: 'CAD', symbol: 'C$', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', symbol: 'A$', label: 'AUD - Australian Dollar' },
    { value: 'CNY', symbol: '¥', label: 'CNY - Chinese Yuan' }
  ]

  const accountTypes = [
    'Checking Account',
    'Savings Account',
    'Current Account',
    'Business Account',
    'Corporate Account'
  ]

  const paymentTermsOptions = [
    'Due on Receipt',
    'Net 7',
    'Net 15',
    'Net 30',
    'Net 45',
    'Net 60',
    'Custom'
  ]

  const commonCharges = [
    'Ocean Freight',
    'Port Charges',
    'Terminal Handling',
    'Customs Clearance',
    'Documentation Fee',
    'Fuel Surcharge',
    'Security Fee',
    'Insurance',
    'Warehousing',
    'Transportation',
    'Loading/Unloading',
    'Inspection Fee'
  ]

  return (
    <>
      <StepHeading 
        title="Charges & Payment Details" 
        description="Enter all charges and bank payment information" 
      />

  <Formik
      initialValues={initialData && Object.keys(initialData).length ? initialData : initialValues}
      validationSchema={chargesSchema}
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
    const totals = {
      subtotal: values.charges?.reduce(
        (sum, c) => sum + Number(c.amount || 0),
        0
      ) || 0,
      tax: values.taxRate
        ? (values.taxRate / 100) *
          (values.charges?.reduce((sum, c) => sum + Number(c.amount || 0), 0) ||
            0)
        : 0,
      taxableAmount: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 0
    };
    totals.total = totals.subtotal + totals.tax;
          return (
            <Form>
              {/* Charges Section */}
              <div className="card mb-4">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Charges</h6>
                  <FieldArray name="charges">
                    {({ push, remove }) => (
                      <div>
                        <button 
                          type="button" 
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => push({
                            description: '',
                            currency: 'USD',
                            amount: 0,
                            quantity: 1,
                            taxable: false,
                            taxRate: 0,
                            notes: ''
                          })}
                        >
                          <i className="fas fa-plus me-1"></i> Add Charge
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            const commonCharge = commonCharges[Math.floor(Math.random() * commonCharges.length)]
                            push({
                              description: commonCharge,
                              currency: 'USD',
                              amount: 0,
                              quantity: 1,
                              taxable: true,
                              taxRate: 10,
                              notes: ''
                            })
                          }}
                        >
                          <i className="fas fa-bolt me-1"></i> Quick Add
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>
                <div className="card-body">
                  {/* Desktop Table */}
                  <div className="d-none d-md-block">
                    <div className="charges-table-header mb-3">
                      <span className="fw-bold">DESCRIPTION</span>
                      <span className="fw-bold">CURRENCY</span>
                      <span className="fw-bold">UNIT PRICE</span>
                      <span className="fw-bold">QUANTITY</span>
                      <span className="fw-bold">TOTAL</span>
                      <span className="fw-bold">TAXABLE</span>
                      <span className="fw-bold">TAX RATE %</span>
                      <span className="fw-bold">ACTION</span>
                    </div>
                    
                    <FieldArray name="charges">
                      {({ push, remove }) => (
                        <>
                          {values.charges.map((charge, index) => (
                            <div key={index} className="charge-row mb-3">
                              <div>
                                <Field 
                                  name={`charges.${index}.description`}
                                  className={`form-control ${errors.charges?.[index]?.description ? 'is-invalid' : ''}`}
                                  placeholder="Charge description"
                                  list={`commonCharges-${index}`}
                                />
                                <datalist id={`commonCharges-${index}`}>
                                  {commonCharges.map(charge => (
                                    <option key={charge} value={charge} />
                                  ))}
                                </datalist>
                                <ErrorMessage name={`charges.${index}.description`} component="div" className="text-danger small mt-1" />
                              </div>
                              
                              <div>
                                <Field 
                                  as="select" 
                                  name={`charges.${index}.currency`} 
                                  className="form-select"
                                >
                                  {currencyOptions.map(currency => (
                                    <option key={currency.value} value={currency.value}>
                                      {currency.label}
                                    </option>
                                  ))}
                                </Field>
                              </div>
                              
                              <div>
                                <div className="input-group">
                                  <span className="input-group-text">
                                    {currencyOptions.find(c => c.value === charge.currency)?.symbol || '$'}
                                  </span>
                                  <Field 
                                    type="number" 
                                    name={`charges.${index}.amount`}
                                    className={`form-control ${errors.charges?.[index]?.amount ? 'is-invalid' : ''}`}
                                    step="0.01"
                                    min="0"
                                  />
                                </div>
                                <ErrorMessage name={`charges.${index}.amount`} component="div" className="text-danger small mt-1" />
                              </div>
                              
                              <div>
                                <Field 
                                  type="number" 
                                  name={`charges.${index}.quantity`}
                                  className={`form-control ${errors.charges?.[index]?.quantity ? 'is-invalid' : ''}`}
                                  min="1"
                                  step="1"
                                />
                                <ErrorMessage name={`charges.${index}.quantity`} component="div" className="text-danger small mt-1" />
                              </div>
                              
                              <div>
                                <div className="input-group">
                                  <span className="input-group-text">
                                    {currencyOptions.find(c => c.value === charge.currency)?.symbol || '$'}
                                  </span>
                                  <input 
                                    type="text" 
                                    className="form-control bg-light"
                                    value={calculateChargeTotal(charge).toFixed(2)}
                                    readOnly 
                                  />
                                </div>
                              </div>
                              
                              <div className="d-flex justify-content-center align-items-center">
                                <Field 
                                  type="checkbox" 
                                  name={`charges.${index}.taxable`}
                                  className="form-check-input"
                                />
                              </div>
                              
                              <div>
                                <div className="input-group">
                                  <Field 
                                    type="number" 
                                    name={`charges.${index}.taxRate`}
                                    className="form-control"
                                    step="0.1"
                                    min="0"
                                    max="100"
                                    disabled={!charge.taxable}
                                  />
                                  <span className="input-group-text">%</span>
                                </div>
                              </div>
                              
                              <div className="d-flex justify-content-center">
                                <button 
                                  type="button" 
                                  className="btn btn-danger btn-sm"
                                  onClick={() => remove(index)}
                                  disabled={values.charges.length === 1}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </FieldArray>
                  </div>

                  {/* Mobile View */}
                  <div className="d-md-none">
                    <FieldArray name="charges">
                      {({ push, remove }) => (
                        <>
                          {values.charges.map((charge, index) => (
                            <div key={index} className="card mb-3">
                              <div className="card-body">
                                <div className="row mb-2">
                                  <div className="col-8">
                                    <h6 className="mb-0">Charge {index + 1}</h6>
                                  </div>
                                  <div className="col-4 text-end">
                                    <button 
                                      type="button" 
                                      className="btn btn-danger btn-sm"
                                      onClick={() => remove(index)}
                                      disabled={values.charges.length === 1}
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="row g-2">
                                  <div className="col-12">
                                    <label className="form-label">Description</label>
                                    <Field 
                                      name={`charges.${index}.description`}
                                      className={`form-control ${errors.charges?.[index]?.description ? 'is-invalid' : ''}`}
                                      placeholder="Charge description"
                                    />
                                  </div>
                                  
                                  <div className="col-6">
                                    <label className="form-label">Currency</label>
                                    <Field 
                                      as="select" 
                                      name={`charges.${index}.currency`} 
                                      className="form-select"
                                    >
                                      {currencyOptions.map(currency => (
                                        <option key={currency.value} value={currency.value}>
                                          {currency.value}
                                        </option>
                                      ))}
                                    </Field>
                                  </div>
                                  
                                  <div className="col-6">
                                    <label className="form-label">Unit Price</label>
                                    <div className="input-group">
                                      <span className="input-group-text">
                                        {currencyOptions.find(c => c.value === charge.currency)?.symbol || '$'}
                                      </span>
                                      <Field 
                                        type="number" 
                                        name={`charges.${index}.amount`}
                                        className="form-control"
                                        step="0.01"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="col-6">
                                    <label className="form-label">Quantity</label>
                                    <Field 
                                      type="number" 
                                      name={`charges.${index}.quantity`}
                                      className="form-control"
                                      min="1"
                                    />
                                  </div>
                                  
                                  <div className="col-6">
                                    <label className="form-label">Total</label>
                                    <div className="input-group">
                                      <span className="input-group-text">
                                        {currencyOptions.find(c => c.value === charge.currency)?.symbol || '$'}
                                      </span>
                                      <input 
                                        type="text" 
                                        className="form-control bg-light"
                                        value={calculateChargeTotal(charge).toFixed(2)}
                                        readOnly 
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="col-6">
                                    <div className="form-check">
                                      <Field 
                                        type="checkbox" 
                                        name={`charges.${index}.taxable`}
                                        className="form-check-input"
                                      />
                                      <label className="form-check-label">Taxable</label>
                                    </div>
                                  </div>
                                  
                                  <div className="col-6">
                                    <label className="form-label">Tax Rate</label>
                                    <div className="input-group">
                                      <Field 
                                        type="number" 
                                        name={`charges.${index}.taxRate`}
                                        className="form-control"
                                        step="0.1"
                                        disabled={!charge.taxable}
                                      />
                                      <span className="input-group-text">%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </FieldArray>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h6 className="mb-0">Payment Summary</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="payment-summary-section">
                        <div className="payment-summary-item">
                          <h6>Subtotal</h6>
                          <h4 className="text-primary">
                            {currencyOptions.find(c => c.value === values.charges[0]?.currency)?.symbol || '$'}
                            {totals.subtotal.toFixed(2)}
                          </h4>
                        </div>
                        <div className="payment-summary-item">
                          <h6>Taxable Amount</h6>
                          <h4 className="text-warning">
                            {currencyOptions.find(c => c.value === values.charges[0]?.currency)?.symbol || '$'}
                            {totals.taxableAmount.toFixed(2)}
                          </h4>
                        </div>
                        <div className="payment-summary-item">
                          <h6>Tax Amount</h6>
                          <h4 className="text-danger">
                            {currencyOptions.find(c => c.value === values.charges[0]?.currency)?.symbol || '$'}
                            {totals.taxAmount.toFixed(2)}
                          </h4>
                        </div>
                        {totals.discountAmount > 0 && (
                          <div className="payment-summary-item">
                            <h6>Discount</h6>
                            <h4 className="text-success">
                              -{currencyOptions.find(c => c.value === values.charges[0]?.currency)?.symbol || '$'}
                              {totals.discountAmount.toFixed(2)}
                            </h4>
                          </div>
                        )}
                        <div className="payment-summary-item">
                          <h6>Total Amount</h6>
                          <h4 className="text-success">
                            {currencyOptions.find(c => c.value === values.charges[0]?.currency)?.symbol || '$'}
                            {totals.totalAmount.toFixed(2)}
                          </h4>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="mb-3">Discount & Payment Terms</h6>
                          
                          <div className="row mb-3">
                            <div className="col-6">
                              <label className="form-label">Discount Type</label>
                              <Field 
                                as="select" 
                                name="discount.type" 
                                className="form-select"
                              >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                              </Field>
                            </div>
                            <div className="col-6">
                              <label className="form-label">Discount Amount</label>
                              <div className="input-group">
                                <Field 
                                  type="number" 
                                  name="discount.amount"
                                  className="form-control"
                                  step="0.01"
                                  min="0"
                                />
                                {values.discount.type === 'percentage' ? (
                                  <span className="input-group-text">%</span>
                                ) : (
                                  <span className="input-group-text">
                                    {currencyOptions.find(c => c.value === values.charges[0]?.currency)?.symbol || '$'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <label className="form-label">Discount Reason</label>
                            <Field 
                              type="text" 
                              name="discount.reason"
                              className="form-control"
                              placeholder="Reason for discount"
                            />
                          </div>
                          
                          <div className="row mb-3">
                            <div className="col-6">
                              <label className="form-label">Payment Terms</label>
                              <Field 
                                as="select" 
                                name="paymentTerms" 
                                className="form-select"
                              >
                                {paymentTermsOptions.map(term => (
                                  <option key={term} value={term}>{term}</option>
                                ))}
                              </Field>
                            </div>
                            <div className="col-6">
                              <label className="form-label">Due Date</label>
                              <Field 
                                type="date" 
                                name="dueDate"
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h6 className="mb-0">Bank Details</h6>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label htmlFor="bankDetails.bankName" className="form-label">Bank Name</label>
                      <Field 
                        type="text" 
                        name="bankDetails.bankName"
                        className="form-control"
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="bankDetails.branch" className="form-label">Branch</label>
                      <Field 
                        type="text" 
                        name="bankDetails.branch"
                        className="form-control"
                        placeholder="Enter branch name"
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="bankDetails.accountType" className="form-label">Account Type</label>
                      <Field 
                        as="select" 
                        name="bankDetails.accountType" 
                        className="form-select"
                      >
                        <option value="">Select Account Type</option>
                        {accountTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Field>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label htmlFor="bankDetails.accountNumber" className="form-label">Account Number</label>
                      <Field 
                        type="text" 
                        name="bankDetails.accountNumber"
                        className="form-control"
                        placeholder="Enter account number"
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="bankDetails.accountName" className="form-label">Account Name</label>
                      <Field 
                        type="text" 
                        name="bankDetails.accountName"
                        className="form-control"
                        placeholder="Enter account name"
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="bankDetails.accountNameKana" className="form-label">Account Name (Kana)</label>
                      <Field 
                        type="text" 
                        name="bankDetails.accountNameKana"
                        className="form-control"
                        placeholder="Enter account name in Kana"
                      />
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4">
                      <label htmlFor="bankDetails.swiftCode" className="form-label">SWIFT Code</label>
                      <Field 
                        type="text" 
                        name="bankDetails.swiftCode"
                        className="form-control"
                        placeholder="Enter SWIFT code"
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="bankDetails.iban" className="form-label">IBAN</label>
                      <Field 
                        type="text" 
                        name="bankDetails.iban"
                        className="form-control"
                        placeholder="Enter IBAN"
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="bankDetails.routingNumber" className="form-label">Routing Number</label>
                      <Field 
                        type="text" 
                        name="bankDetails.routingNumber"
                        className="form-control"
                        placeholder="Enter routing number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h6 className="mb-0">Additional Notes</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <label htmlFor="additionalNotes" className="form-label">Payment Instructions & Notes</label>
                      <Field 
                        as="textarea" 
                        name="additionalNotes"
                        className="form-control"
                        rows="4"
                        placeholder="Enter any additional payment instructions, notes, or special requirements..."
                      />
                    </div>
                  </div>
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
                            <i className="fas fa-save me-1"></i> Save Charges & Payment Details
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            
            </Form>
          )
        }}
      </Formik>
    </>
  );
};

export default Charges