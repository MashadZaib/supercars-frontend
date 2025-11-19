import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik'
import StepHeading from '../Common/StepHeading'
import { bookingConfirmationSchema } from '../../schemas/validationSchemas'
import { toast } from "react-toastify";
import { useBooking } from "../../context/BookingContext"; 
import { createBookingConfirmation, updateBookingConfirmation } from "../../api/bookingConfirmationApi";

import {
  getCarriers,
  createCarrier,
  createShipper,
  getShippers,
  createVessel,
  getVessels,
  createCargoDescription,
  getCargoDescription,
} from "../../api/commonRequest";

const AutoCompleteList = ({ items, onSelect, visible, fieldName, loading }) => {
  if (!visible) return null;

  return (
    <ul
      className="list-group position-absolute w-100 shadow-sm"
      style={{
        zIndex: 1000,
        top: "100%",
        maxHeight: "180px",
        overflowY: "auto",
      }}
    >
      {loading ? (
        <li className="list-group-item text-center py-2">
          <div
            className="spinner-border spinner-border-sm me-2"
            role="status"
          ></div>
          Searching...
        </li>
      ) : items.length > 0 ? (
        items.map((item, index) => (
          <li
            key={index}
            className="list-group-item list-group-item-action py-2"
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(item)}
          >
            {item.name || item}
            {item.type && (
              <span className="text-muted ms-2">({item.type})</span>
            )}
          </li>
        ))
      ) : (
        <li className="list-group-item text-muted py-2">No results found</li>
      )}
    </ul>
  );
};



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
    carrier: initialData?.carrier || "",
    ratesConfirmed: initialData?.ratesConfirmed || "",
    bookingConfirmationNo: initialData?.bookingConfirmationNo || "",
    bookingDate: initialData?.bookingDate || "",
    shipper: initialData?.shipper || "",
    portOfLoad: initialData?.portOfLoad || "",
    portOfDischarge: initialData?.portOfDischarge || "",
    vessel: initialData?.vessel || "",
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
 
  const [carriers, setCarriers] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [vessels, setVessels] = useState([]);
   const [cargoDescriptions, setCargoDescriptions] = useState([]);
  const [suggestions, setSuggestions] = useState({
    carrier: [],
    shipper: [],
    vessel: [],
    cargoDescription: [],
  });
  

    const [visibleSuggestions, setVisibleSuggestions] = useState({
      carrier: false,
      shipper: false,
      vessel: false,
      cargoDescription: false,
    });
    const [loading, setLoading] = useState({
      carrier: false,
      shipper: false,
      vessel: false,
      cargoDescription: false,
    });
    const [validatedValues, setValidatedValues] = useState({
      carrier: false,
      shipper: false,
      vessel: false,
      cargoDescription: false,
    });

      // ✅ Custom validation for autocomplete fields
  const validateAutocompleteField = (fieldName, value, suggestions) => {
    if (!value) return `${fieldName} is required`;

    // Check if the value exists in the suggestions (case insensitive)
    const exists = suggestions.some(
      (item) => (item.name || item).toLowerCase() === value.toLowerCase()
    );

    if (!exists)
      return `Please select a valid ${fieldName} from the suggestions`;

    return null;
  };

    const validateFieldInRealTime = (fieldName, value, currentSuggestions) => {
    if (!value) {
      setValidatedValues((prev) => ({ ...prev, [fieldName]: false }));
      return false;
    }

    const exists = currentSuggestions.some(
      (item) => (item.name || item).toLowerCase() === value.toLowerCase()
    );

    setValidatedValues((prev) => ({ ...prev, [fieldName]: exists }));
    return exists;
  };

  const handleSubmit = async (values, {setSubmitting, resetForm, setErrors }) => {
    console.log("Form Values on Submit:", values); // Debug all values
    const errors = {};

    if (!bookingId) {
      toast.error("❌ Please save a Booking Request first!");
      setSubmitting(false);
      return;
    }

    const carrierError = validateAutocompleteField(
      "Carrier Name",
      values.carrier,
      suggestions.carrier
    );
    if (carrierError) errors.carrier = carrierError;


      const shipperError = validateAutocompleteField(
      "Shipper",
      values.shipper,
      suggestions.shipper
      );
      if (shipperError) errors.shipper = shipperError;



      const vesselError = validateAutocompleteField(
        "Vessel Name",
        values.vessel,
        suggestions.vessel
      );
      if (vesselError) errors.vessel = vesselError;



      const cargoDescriptionError = validateAutocompleteField(
        "Cargo Description",
        values.hsCode,
        suggestions.hsCode
      );
      if (cargoDescriptionError) errors.hsCode = cargoDescriptionError;


            // If there are validation errors, stop submission
      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        toast.error("Please fix the validation errors before submitting");
        setSubmitting(false);
        return;
      }


    try {
      const formatted = {
        booking_request_id: bookingId,
        carrier_id: values.carrier,
        rates_confirmed: values.ratesConfirmed,
        booking_confirmation_no: values.bookingConfirmationNo,
        booking_date: values.bookingDate,
        shipper_id: values.shipper,
        port_of_load_id: values.portOfLoad,
        port_of_discharge_id: values.portOfDischarge,
        vessel_id: values.vessel,
        voyage: values.voyage,
        container_size_id: values.containerSize,
        quantity: values.quantity,
        weight_kg: values.weightKg,
        cy_cfs: values.cyCfs,
        hs_code_id: values.hsCode,
        cargo_description_id: values.cargoDescription,
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


    const handleSearchCarrier = async (term, fromButton = false) => {
      if (!term.trim()) {
        setSuggestions((prev) => ({ ...prev, bookingParty: [] }));
        setVisibleSuggestions((prev) => ({ ...prev, bookingParty: false }));
        setValidatedValues((prev) => ({ ...prev, bookingParty: false }));
        return;
      }
  
      try {
        setLoading((prev) => ({ ...prev, bookingParty: true }));
        setVisibleSuggestions((prev) => ({ ...prev, bookingParty: true }));
  
        const data = await getBookingParties(term);
        setSuggestions((prev) => ({ ...prev, bookingParty: data || [] }));
  
        // Real-time validation after search
        validateFieldInRealTime("bookingParty", term, data || []);
      } catch (error) {
        console.error("Error searching booking parties:", error);
        setSuggestions((prev) => ({ ...prev, bookingParty: [] }));
        setValidatedValues((prev) => ({ ...prev, bookingParty: false }));
        if (fromButton) {
          toast.error("Search failed. Please try again.");
        }
      } finally {
        setLoading((prev) => ({ ...prev, bookingParty: false }));
      }
    };
    const handleSearchShipper = async (term, fromButton = false) => {
      if (!term.trim()) {
        setSuggestions((prev) => ({ ...prev, hsCode: [] }));
        setVisibleSuggestions((prev) => ({ ...prev, hsCode: false }));
        setValidatedValues((prev) => ({ ...prev, hsCode: false }));
        return;
      }
  
      try {
        setLoading((prev) => ({ ...prev, hsCode: true }));
        setVisibleSuggestions((prev) => ({ ...prev, hsCode: true }));
  
        const data = await getHsCodes(term);
        setSuggestions((prev) => ({ ...prev, hsCode: data || [] }));
  
        // Real-time validation after search
        validateFieldInRealTime("hsCode", term, data || []);
      } catch (error) {
        console.error("Error searching booking parties:", error);
        setSuggestions((prev) => ({ ...prev, hsCode: [] }));
        setValidatedValues((prev) => ({ ...prev, hsCode: false }));
        if (fromButton) {
          toast.error("Search failed. Please try again.");
        }
      } finally {
        setLoading((prev) => ({ ...prev, hsCode: false }));
      }
    };
     const handleSearchVessel = async (term, fromButton = false) => {
      if (!term.trim()) {
        setSuggestions((prev) => ({ ...prev, hsCode: [] }));
        setVisibleSuggestions((prev) => ({ ...prev, hsCode: false }));
        setValidatedValues((prev) => ({ ...prev, hsCode: false }));
        return;
      }
  
      try {
        setLoading((prev) => ({ ...prev, hsCode: true }));
        setVisibleSuggestions((prev) => ({ ...prev, hsCode: true }));
  
        const data = await getHsCodes(term);
        setSuggestions((prev) => ({ ...prev, hsCode: data || [] }));
  
        // Real-time validation after search
        validateFieldInRealTime("hsCode", term, data || []);
      } catch (error) {
        console.error("Error searching booking parties:", error);
        setSuggestions((prev) => ({ ...prev, hsCode: [] }));
        setValidatedValues((prev) => ({ ...prev, hsCode: false }));
        if (fromButton) {
          toast.error("Search failed. Please try again.");
        }
      } finally {
        setLoading((prev) => ({ ...prev, hsCode: false }));
      }
    };
    const handleSearchCargoDescription = async (term, fromButton = false) => {
      if (!term.trim()) {
        setSuggestions((prev) => ({ ...prev, hsCode: [] }));
        setVisibleSuggestions((prev) => ({ ...prev, hsCode: false }));
        setValidatedValues((prev) => ({ ...prev, hsCode: false }));
        return;
      }
  
      try {
        setLoading((prev) => ({ ...prev, hsCode: true }));
        setVisibleSuggestions((prev) => ({ ...prev, hsCode: true }));
  
        const data = await getHsCodes(term);
        setSuggestions((prev) => ({ ...prev, hsCode: data || [] }));
  
        // Real-time validation after search
        validateFieldInRealTime("hsCode", term, data || []);
      } catch (error) {
        console.error("Error searching booking parties:", error);
        setSuggestions((prev) => ({ ...prev, hsCode: [] }));
        setValidatedValues((prev) => ({ ...prev, hsCode: false }));
        if (fromButton) {
          toast.error("Search failed. Please try again.");
        }
      } finally {
        setLoading((prev) => ({ ...prev, hsCode: false }));
      }
    };



      // ✅ Handle selection from autocomplete - store both name and ID
      const handleSuggestionSelect = (fieldName, item, setFieldValue) => {
        const value = item.name || item;
        const id = item.id;
    
        // Set both the display name and the ID
        setFieldValue(fieldName, value);
        setFieldValue(`${fieldName}Id`, id);
    
        // Store the selected item for reference
        setSelectedItems((prev) => ({ ...prev, [fieldName]: item }));
    
        setVisibleSuggestions((prev) => ({ ...prev, [fieldName]: false }));
        setValidatedValues((prev) => ({ ...prev, [fieldName]: true }));
        toast.success(`Selected: ${value}`);
      };
    
      // ✅ Handle input change with real-time validation
      const handleInputChange = (
        fieldName,
        value,
        setFieldValue,
        searchFunction
      ) => {
        setFieldValue(fieldName, value);
    
        // Clear the ID when user starts typing
        if (value !== selectedItems[fieldName]?.name) {
          setFieldValue(`${fieldName}Id`, "");
          setSelectedItems((prev) => ({ ...prev, [fieldName]: null }));
        }
    
        // Real-time validation against current suggestions
        const isValid = validateFieldInRealTime(
          fieldName,
          value,
          suggestions[fieldName]
        );
    
        if (value.length >= 1) {
          searchFunction(value);
        } else {
          setVisibleSuggestions((prev) => ({ ...prev, [fieldName]: false }));
          if (value.length > 0 && !isValid) {
            setValidatedValues((prev) => ({ ...prev, [fieldName]: false }));
          }
        }
      };

  // ✅ Handle new modal-created items (Booking Party or Port)
  useEffect(() => {
    if (!modalResult) return;

    const handleModalResult = async () => {
      try {
        if (modalResult.title === "Create New Carrier Name") {
          const newCarrerName = await createCarrier(modalResult.data);
          setCarriers((prev) => [newCarrerName, ...prev]);
          // Add to suggestions and validate if it matches current field value
          setSuggestions((prev) => ({
            ...prev,
            carrerName: [newCarrerName, ...prev.carrerName],
          }));
          toast.success(`Carrier Name "${newCarrerName.name}" added!`);
        } else if (modalResult.title === "Create New Shipper Name") {
          const newShipper = await createShipper(modalResult.data);
          setShippers((prev) => [newShipper, ...prev]);
          // Add only to portOfLoad suggestions
          setSuggestions((prev) => ({
            ...prev,
            shipper: [newShipper, ...prev.shipper],
          }));
          toast.success(`Shipper Information "${shipper.name}" added!`);
        } else if (modalResult.title === "Create New Vessel Name") {
          const newCreateVessel = await createVessel(modalResult.data);
          setVessels((prev) => [newCreateVessel, ...prev]);
          // Add only to portOfDischarge suggestions
          setSuggestions((prev) => ({
            ...prev,
            vessel: [newVessel, ...prev.vessel],
          }));
          toast.success(`Vessel Name "${newVessel.name}" added!`);
        }
        if (modalResult.title === "Create New Cargo Description") {
          const newCargoDescription = await createCargoDescription(modalResult.data);
          setCargoDescriptions((prev) => [newCargoDescription, ...prev]);
          // Add only to portOfDischarge suggestions
          setSuggestions((prev) => ({
            ...prev,
            cargoDescription: [newCargoDescription, ...prev.portOfDischarge],
          }));
          toast.success(`Cargo Description "${newCargoDescription.name}" added!`);
        }
      } catch (err) {
        console.error("Error creating record:", err);
        toast.error("Failed to add record");
      } finally {
        setShowModal(false);
      }
    };

    handleModalResult();
  }, [modalResult]);


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
        // enableReinitialize
      >
        {({
          isSubmitting,
          isValid,
          touched,
          values,
          errors,
          setFieldValue,
        }) => {
               useEffect(() => {
               console.log("=== FORM VALIDATION DEBUG ===");
               console.log("Is Form Valid?", isValid);
               console.log("All Errors:", errors);
               console.log("All Touched Fields:", touched);
               console.log("Current Values:", values);
               console.log("=== END DEBUG ===");
               
               if (onFormValidityChange) onFormValidityChange(isValid);
             }, [isValid, errors, touched, values]);
              const showAllErrors = () => {
      return (
        <div className="alert alert-warning mt-3">
          <strong>Validation Errors Found:</strong>
          <ul className="mb-0 mt-2">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                <strong>{field}:</strong> {error}
              </li>
            ))}
          </ul>
        </div>
      );
    };

        return (
          <Form>
            {/* Carrier Name */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="carrier" className="form-label">
                  Carrier Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field 
                    type="text" 
                    name="carrier"
                    className={`form-control ${
                        (touched.carrier && errors.carrier) ||
                        (values.carrier && !validatedValues.carrier)
                          ? "is-invalid"
                          : ""
                      }`}
                    placeholder="Search Carrier Name" 
                   onChange={(e) => {
                        handleInputChange(
                          "carrier",
                          e.target.value,
                          setFieldValue,
                          handleSearchCarrier
                        );
                      }}
                      onFocus={() => {
                        if (
                          suggestions.carrier.length > 0 &&
                          values.carrier
                        ) {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            carrier: true,
                          }));
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            carrier: false,
                          }));
                        }, 200);
                      }}
                      autoComplete="off"
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          const currentValue = values.carrier;
                          if (currentValue) {
                            handleSearchCarrier(currentValue, true);
                          } else {
                            toast.warning("Please enter a search term first");
                          }
                        }}
                        disabled={loading.carrier}
                      >
                        {loading.carrier ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                          ></span>
                        ) : (
                          <i className="fas fa-search"></i>
                        )}
                      </button>
                </div>
                  <AutoCompleteList
                    items={suggestions.carrier}
                    visible={visibleSuggestions.carrier}
                    onSelect={(item) =>
                      handleSuggestionSelect(
                        "carrier",
                        item,
                        setFieldValue
                      )
                    }
                    fieldName="carrier"
                    loading={loading.carrier}
                  />
                  <ErrorMessage
                    name="carrerName"
                    component="div"
                    className="text-danger small mt-1"
                  />
                  {values.carrerName &&
                    !validatedValues.carrerName &&
                    !errors.carrerName && (
                      <div className="text-warning small mt-1">
                        ⚠️ Please select a value from the suggestions
                      </div>
                    )}
                  {/* Hidden field for booking party ID */}
                  <Field type="hidden" name="carrerNameId" />
              </div>
              <div className="col-md-6 text-end">
                 <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setModalConfig({
                      title: 'Create New Carrier Name',
                      fields: [
                        { name: 'carrier', label: 'Carrier Name', required: true },                      
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
                <label htmlFor="vessel" className="form-label">
                  Vessel Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field
                      type="text"
                      name="vessel"
                      placeholder="Search Vessel Name"
                      className={`form-control ${
                        (touched.vessel && errors.vessel) ||
                        (values.vessel && !validatedValues.vessel)
                          ? "is-invalid"
                          : ""
                      }`}
                       onChange={(e) => {
                        handleInputChange(
                          "vessel",
                          e.target.value,
                          setFieldValue,
                          handleSearchVessel
                        );
                      }}
                        onFocus={() => {
                        if (
                          suggestions.vessel.length > 0 &&
                          values.vessel
                        ) {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            vessel: true,
                          }));
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            vessel: false,
                          }));
                        }, 200);
                      }}
                      autoComplete="off"
                    />
                  <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        const currentValue = values.vessel;
                        if (currentValue) {
                          handleSearchVessel(currentValue, true);
                        } else {
                          toast.warning("Please enter a search term first");
                        }
                      }}
                      disabled={loading.vessel}
                    >
                      {loading.vessel ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                        ></span>
                      ) : (
                        <i className="fas fa-search"></i>
                      )}
                    </button>
                </div>
                   <AutoCompleteList
                    items={suggestions.vessel}
                    visible={visibleSuggestions.vessel}
                    onSelect={(item) =>
                      handleSuggestionSelect(
                        "vessel",
                        item,
                        setFieldValue
                      )
                    }
                    fieldName="vessel"
                    loading={loading.vessel}
                  />
                      <ErrorMessage
                  name="vessel"
                  component="div"
                  className="text-danger small mt-1"
                />
                {values.vessel &&
                  !validatedValues.vessel &&
                  !errors.vessel && (
                    <div className="text-warning small mt-1">
                      ⚠️ Please select a value from the suggestions
                    </div>
                  )}
                {/* Hidden field for booking party ID */}
                <Field type="hidden" name="vesselId" />
              </div>
              <div className="col-md-6 text-end">
                 <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setModalConfig({
                      title: 'Create New Vessel Name',
                      fields: [
                        { name: 'vessel', label: 'Vessel Name', required: true },                      
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
                  {/* <button className="btn btn-outline-secondary" type="button">
                    <i className="fas fa-search"></i>
                  </button> */}
                </div>
                <ErrorMessage name="hsCode" component="div" className="text-danger small mt-1" />
              </div>
              {/* <div className="col-md-6 text-end">
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
              </div> */}
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
                    placeholder="Search Cargo Description" 
          
                    
                  className={`form-control ${
                        (touched.cargoDescription && errors.cargoDescription) ||
                        (values.cargoDescription && !validatedValues.cargoDescription)
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={(e) => {
                        handleInputChange(
                          "cargoDescription",
                          e.target.value,
                          setFieldValue,
                          handleSearchCargoDescription
                        );
                      }}
                      onFocus={() => {
                        if (
                          suggestions.cargoDescription.length > 0 &&
                          values.cargoDescription
                        ) {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            cargoDescription: true,
                          }));
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            cargoDescription: false,
                          }));
                        }, 200);
                      }}
                      autoComplete="off"
                    />
                  <button
                                      type="button"
                                      className="btn btn-outline-secondary"
                                      onClick={() => {
                                        const currentValue = values.cargoDescription;
                                        if (currentValue) {
                                          handleSearchCargoDescription(currentValue, true);
                                        } else {
                                          toast.warning("Please enter a search term first");
                                        }
                                      }}
                                      disabled={loading.cargoDescription}
                                    >
                                      {loading.cargoDescription ? (
                                        <span
                                          className="spinner-border spinner-border-sm"
                                          role="status"
                                        ></span>
                                      ) : (
                                        <i className="fas fa-search"></i>
                                      )}
                                    </button>
                                  </div>
                
                                  <AutoCompleteList
                                    items={suggestions.cargoDescription}
                                    visible={visibleSuggestions.cargoDescription}
                                    onSelect={(item) =>
                                      handleSuggestionSelect(
                                        "cargoDescription",
                                        item,
                                        setFieldValue
                                      )
                                    }
                                    fieldName="cargoDescription"
                                    loading={loading.cargoDescription}
                                  />
                
                                  <ErrorMessage
                                    name="cargoDescription"
                                    component="div"
                                    className="text-danger small mt-1"
                                  />
                                  {values.cargoDescription &&
                                    !validatedValues.cargoDescription &&
                                    !errors.cargoDescription && (
                                      <div className="text-warning small mt-1">
                                        ⚠️ Please select a value from the suggestions
                                      </div>
                                    )}
                                  {/* Hidden field for booking party ID */}
                                  <Field type="hidden" name="cargoDescriptionId" />
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