import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import StepHeading from '../Common/StepHeading'
import { bookingConfirmationSchema } from '../../schemas/validationSchemas'
import { toast } from "react-toastify";
import { useBooking } from "../../context/BookingContext"; 
import { createBookingConfirmation, updateBookingConfirmation } from "../../api/bookingConfirmationApi";

const BookingConfirmation = ({
  setShowModal,
  setModalConfig,
  onSubmit,
  initialData,
  onFormValidityChange,
  modalResult = null 
}) => {
  const { bookingId } = useBooking(); 

 const initialValues = {
    id: initialData?.id || null,
    carrierName: initialData?.carrierName || "",
    ratesConfirmed: initialData?.ratesConfirmed || "",
    bookingConfirmationNo: initialData?.bookingConfirmationNo || "",
    bookingDate: initialData?.bookingDate || "",
    shipper: initialData?.shipper || "",
    portOfLoad: initialData?.portOfLoad || "",
    portOfDischarge: initialData?.portOfDischarge || "",
    vesselName: initialData?.vesselName || "",
    voyage: initialData?.voyage || "",
    containerSize: initialData?.containerSize || "",
    quantity: initialData?.quantity || "",
    weightKg: initialData?.weightKg || "",
    cyCfs: initialData?.cyCfs || "",
    hsCode: initialData?.hsCode || "",
    cargoDescription: initialData?.cargoDescription || "",
    specialInstructions: initialData?.specialInstructions || "",
    additionalRemarks: initialData?.additionalRemarks || "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!bookingId) {
      toast.error("❌ Please save a Booking Request first!");
      setSubmitting(false);
      return;
    }

    try {
      const formatted = {
        booking_request_id: bookingId,
        carrier_name: values.carrierName,
        rates_confirmed: values.ratesConfirmed,
        booking_confirmation_no: values.bookingConfirmationNo,
        booking_date: values.bookingDate,
        shipper: values.shipper,
        port_of_load: values.portOfLoad,
        port_of_discharge: values.portOfDischarge,
        vessel_name: values.vesselName,
        voyage: values.voyage,
        container_size: values.containerSize,
        quantity: values.quantity,
        weight_kg: values.weightKg,
        cy_cfs: values.cyCfs,
        hs_code: values.hsCode,
        cargo_description: values.cargoDescription,
        special_instructions: values.specialInstructions,
        additional_remarks: values.additionalRemarks,
      };

      let response;
      if (values.id) {
        // ✅ Update
        response = await updateBookingConfirmation(values.id, formatted);
        toast.success("Booking Confirmation updated successfully!");
      } else {
        // ✅ Create new
        response = await createBookingConfirmation(formatted);
        toast.success("Booking Confirmation saved successfully!");
      }

      if (onSubmit) onSubmit(response, true);
      resetForm({ values: { ...values, ...response } });
    } catch (err) {
      console.error("❌ Error saving booking confirmation:", err);
      toast.error("Something went wrong while saving!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <StepHeading 
        title="Booking Confirmation" 
        description="Enter the booking confirmation details received from the shipping line" 
      />

         <Formik
        initialValues={initialData && Object.keys(initialData).length ? initialData : initialValues}
        validationSchema={bookingConfirmationSchema}
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
            {/* Carrier Name */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="carrierName" className="form-label">
                  Carrier Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field 
                    type="text" 
                    name="carrierName"
                    className={`form-control ${touched.carrierName && errors.carrierName ? 'is-invalid' : ''}`}
                    placeholder="Search Carrier Name" 
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                <ErrorMessage name="carrierName" component="div" className="text-danger small mt-1" />
              </div>
              <div className="col-md-6 text-end">
                 <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setModalConfig({
                      title: 'Create New Carrier Name',
                      fields: [
                        { name: 'carrierName', label: 'Carrier Name', required: true },                      
                      ]
                    })
                    setShowModal(true)
                  }}
                >
                  <i className="fas fa-plus"></i> Create New
                </button>
              </div>
            </div>

            {/* Rates Confirmed and Booking Confirmation No */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-6">
                <label htmlFor="ratesConfirmed" className="form-label">
                  Rates Confirmed <span className="text-danger">*</span>
                </label>
                <Field 
                  type="text" 
                  name="ratesConfirmed"
                  className={`form-control ${touched.ratesConfirmed && errors.ratesConfirmed ? 'is-invalid' : ''}`}
                  placeholder="Enter rates confirmation details"
                />
                <ErrorMessage name="ratesConfirmed" component="div" className="text-danger small mt-1" />
              </div>
              <div className="col-md-6">
                <label htmlFor="bookingConfirmationNo" className="form-label">
                  Booking Confirmation No <span className="text-danger">*</span>
                </label>
                <Field 
                  type="text" 
                  name="bookingConfirmationNo"
                  className={`form-control ${touched.bookingConfirmationNo && errors.bookingConfirmationNo ? 'is-invalid' : ''}`}
                  placeholder="Enter Booking Confirmation no" 
                />
                <ErrorMessage name="bookingConfirmationNo" component="div" className="text-danger small mt-1" />
              </div>
            </div>

            {/* Booking Date */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-6">
                <label htmlFor="bookingDate" className="form-label">
                  Booking Date <span className="text-danger">*</span>
                </label>
                <Field 
                  type="date" 
                  name="bookingDate"
                  className={`form-control ${touched.bookingDate && errors.bookingDate ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name="bookingDate" component="div" className="text-danger small mt-1" />
              </div>
            </div>

            {/* Shipper Details */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="shipper" className="form-label">
                  Shipper (Full Details) <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field 
                    type="text" 
                    name="shipper"
                    className={`form-control ${touched.shipper && errors.shipper ? 'is-invalid' : ''}`}
                    placeholder="Search Shipper" 
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                <ErrorMessage name="shipper" component="div" className="text-danger small mt-1" />
              </div>
              <div className="col-md-6 text-end">
                 <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setModalConfig({
                      title: 'Create New Shipper Name',
                      fields: [
                        { name: 'shipperName', label: 'Shipper Name', required: true },                      
                      ]
                    })
                    setShowModal(true)
                  }}
                >
                  <i className="fas fa-plus"></i> Create New
                </button>
              </div>
            </div>

            {/* Port of Load and Discharge */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-6">
                <label htmlFor="portOfLoad" className="form-label">
                  Port of Load
                </label>
                <Field 
                  type="text" 
                  name="portOfLoad"
                  className="form-control"
                  placeholder="Enter Port of Load" 
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="portOfDischarge" className="form-label">
                  Port of Discharge
                </label>
                <Field 
                  type="text" 
                  name="portOfDischarge"
                  className="form-control"
                  placeholder="Enter Port of Discharge" 
                />
              </div>
            </div>

            {/* Vessel Name */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="vesselName" className="form-label">
                  Vessel Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field 
                    type="text" 
                    name="vesselName"
                    className={`form-control ${touched.vesselName && errors.vesselName ? 'is-invalid' : ''}`}
                    placeholder="Search Vessel Name" 
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                <ErrorMessage name="vesselName" component="div" className="text-danger small mt-1" />
              </div>
              <div className="col-md-6 text-end">
                 <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setModalConfig({
                      title: 'Create New Vessel Name',
                      fields: [
                        { name: 'vesselName', label: 'Vessel Name', required: true },                      
                      ]
                    })
                    setShowModal(true)
                  }}
                >
                  <i className="fas fa-plus"></i> Create New
                </button>
              </div>
            </div>

            {/* Voyage and Container Size */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-6">
                <label htmlFor="voyage" className="form-label">
                  Voyage
                </label>
                <Field 
                  type="text" 
                  name="voyage"
                  className="form-control"
                  placeholder="Enter Voyage Number"
                />
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

            {/* Quantity and Weight */}
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
                <label htmlFor="weightKg" className="form-label">
                  Weight (KG)
                </label>
                <Field 
                  type="number" 
                  name="weightKg"
                  className="form-control"
                  placeholder="Enter Weight"
                />
              </div>
            </div>

            {/* CY/CFS */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-6">
                <label htmlFor="cyCfs" className="form-label">
                  CY / CFS
                </label>
                <Field 
                  as="select" 
                  name="cyCfs" 
                  className="form-select"
                >
                  <option value="">Select CY/CFS</option>
                  <option value="CY">CY</option>
                  <option value="CFS">CFS</option>
                </Field>
              </div>
            </div>

            {/* HS CODE */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="hsCode" className="form-label">
                  HS CODE <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field 
                    type="text" 
                    name="hsCode"
                    className={`form-control ${touched.hsCode && errors.hsCode ? 'is-invalid' : ''}`}
                    placeholder="Search HS CODE" 
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                <ErrorMessage name="hsCode" component="div" className="text-danger small mt-1" />
              </div>
              <div className="col-md-6 text-end">
                 <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setModalConfig({
                      title: 'Create New HS Code',
                      fields: [
                        { name: 'hsCode', label: 'HS Code', required: true },                      
                      ]
                    })
                    setShowModal(true)
                  }}
                >
                  <i className="fas fa-plus"></i> Create New
                </button>
              </div>
            </div>

            {/* Cargo Description */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="cargoDescription" className="form-label">
                  Cargo Description <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field 
                    type="text" 
                    name="cargoDescription"
                    className={`form-control ${touched.cargoDescription && errors.cargoDescription ? 'is-invalid' : ''}`}
                    placeholder="Search Cargo Description" 
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                <ErrorMessage name="cargoDescription" component="div" className="text-danger small mt-1" />
              </div>
              <div className="col-md-6 text-end">
                 <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setModalConfig({
                      title: 'Create New Cargo Description',
                      fields: [
                        { type: "textarea", name: 'cargoDescription', label: 'Cargo Description', required: true },                      
                      ]
                    })
                    setShowModal(true)
                  }}
                >
                  <i className="fas fa-plus"></i> Create New
                </button>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">Additional Information</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <label htmlFor="specialInstructions" className="form-label">
                          Special Instructions
                        </label>
                        <Field 
                          as="textarea" 
                          name="specialInstructions"
                          className="form-control"
                          rows="3"
                          placeholder="Enter any special instructions or notes..."
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="additionalRemarks" className="form-label">
                          Additional Remarks
                        </label>
                        <Field 
                          as="textarea" 
                          name="additionalRemarks"
                          className="form-control"
                          rows="3"
                          placeholder="Enter additional remarks..."
                        />
                      </div>
                    </div>
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
                          <i className="fas fa-save me-1"></i>{" "}
                          {values.id ? "Update Booking Confirmation" : "Save Booking Confirmation"}
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

export default BookingConfirmation