import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import StepHeading from "../Common/StepHeading";
import { bookingConfirmationSchema } from "../../schemas/validationSchemas";
import { toast } from "react-toastify";
import { useBooking } from "../../context/BookingContext";
import {
  createBookingConfirmation,
  updateBookingConfirmation,
} from "../../api/bookingConfirmationApi";


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
            {fieldName === "shipper" ? (
              <>
                <strong>{item.username}</strong>
                {item.address && (
                  <small className="text-muted d-block">{item.address}</small>
                )}
              </>
            ) : (
              item.description || item.name || item
            )}

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
  modalResult = null,
}) => {
  const { bookingId, bookingRequestData, setBookingConfirmationData  } = useBooking();

  const initialValues = {
    id: initialData?.id || null,
    carrier: initialData?.carrier || "",
    ratesConfirmed: initialData?.ratesConfirmed || "",
    bookingConfirmationNo: initialData?.bookingConfirmationNo || "",
    bookingDate: initialData?.bookingDate || "",
    shipper: initialData?.shipper || "",

    // ✅ Pre-fill from Booking Request, but allow existing confirmation data to win
    portOfLoad: initialData?.portOfLoad || bookingRequestData?.portOfLoad || "",
    portOfLoadId:
      initialData?.portOfLoadId || bookingRequestData?.portOfLoadId || "",
    portOfDischarge:
      initialData?.portOfDischarge || bookingRequestData?.portOfDischarge || "",
    portOfDischargeId:
      initialData?.portOfDischargeId ||
      bookingRequestData?.portOfDischargeId ||
      "",

    vessel: initialData?.vessel || "",
    voyage: initialData?.voyage || "",

    containerSize:
      initialData?.containerSize || bookingRequestData?.containerSize || "",

    containerSizeId:
      initialData?.containerSizeId || bookingRequestData?.containerSizeId || "",

    quantity: initialData?.quantity || bookingRequestData?.quantity || "",

    weightKg: initialData?.weightKg || bookingRequestData?.weightKg || "",

    cyCfs: initialData?.cyCfs || "",

    hsCode: initialData?.hsCode || bookingRequestData?.hsCode || "",

    cargoDescription: initialData?.cargoDescription || "",
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
  const [selectedItems, setSelectedItems] = useState({
    carrier: null,
    shipper: null,
    vessel: null,
    cargoDescription: null,
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
    const exists = suggestions.some((item) => {
      const text =
        item.username || // shipper
        item.description || // cargo description
        item.name || // carrier / vessel / container sizes
        "";

      return text.toLowerCase() === value.toLowerCase();
    });

    if (!exists)
      return `Please select a valid ${fieldName} from the suggestions`;

    return null;
  };

  const validateFieldInRealTime = (fieldName, value, currentSuggestions) => {
    if (!value) {
      setValidatedValues((prev) => ({ ...prev, [fieldName]: false }));
      return false;
    }

    const exists = currentSuggestions.some((item) => {
      const text =
        item.username || // shipper
        item.description || // cargo description
        item.name || // carrier / vessel
        "";

      return text.toLowerCase() === value.toLowerCase();
    });

    setValidatedValues((prev) => ({ ...prev, [fieldName]: exists }));
    return exists;
  };

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setErrors }
  ) => {
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
      values.cargoDescription,
      suggestions.cargoDescription
    );
    if (cargoDescriptionError) errors.cargoDescription = cargoDescriptionError;

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
        carrier_id: values.carrierId,
        rates_confirmed: values.ratesConfirmed,
        booking_confirmation_no: values.bookingConfirmationNo,
        booking_date: values.bookingDate,
        shipper_id: values.shipperId,
        port_of_load_id: values.portOfLoadId,
        port_of_discharge_id: values.portOfDischargeId,
        vessel_id: values.vesselId,
        voyage: values.voyage,
        container_size_id: values.containerSizeId,
        quantity: values.quantity,
        weight_kg: values.weightKg,
        cy_cfs: values.cyCfs,
        hs_code_id: values.hsCodeId,
        cargo_description_id: values.cargoDescriptionId,
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
      setBookingConfirmationData({
        shipper: selectedItems.shipper,
        vessel: values.vessel,
        voyage: values.voyage,
        portOfLoad: values.portOfLoad,
        portOfDischarge: values.portOfDischarge,
        containerSize: values.containerSize,
        quantity: values.quantity
      });

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
      setSuggestions((prev) => ({ ...prev, carrier: [] }));
      setVisibleSuggestions((prev) => ({ ...prev, carrier: false }));
      setValidatedValues((prev) => ({ ...prev, carrier: false }));
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, carrier: true }));
      setVisibleSuggestions((prev) => ({ ...prev, carrier: true }));

      const data = await getCarriers(term);
      setSuggestions((prev) => ({ ...prev, carrier: data || [] }));

      validateFieldInRealTime("carrier", term, data || []);
    } catch {
      setSuggestions((prev) => ({ ...prev, carrier: [] }));
      setValidatedValues((prev) => ({ ...prev, carrier: false }));
    } finally {
      setLoading((prev) => ({ ...prev, carrier: false }));
    }
  };

  const handleSearchShipper = async (term, fromButton = false) => {
    if (!term.trim()) {
      setSuggestions((prev) => ({ ...prev, shipper: [] }));
      setVisibleSuggestions((prev) => ({ ...prev, shipper: false }));
      setValidatedValues((prev) => ({ ...prev, shipper: false }));
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, shipper: true }));
      setVisibleSuggestions((prev) => ({ ...prev, shipper: true }));

      const data = await getShippers(term); // FIXED
      const filtered = (data || []).filter((u) => u.role === "shipper"); // ONLY SHIPPERS

      setSuggestions((prev) => ({ ...prev, shipper: filtered }));

      validateFieldInRealTime("shipper", term, filtered);
    } catch {
      setSuggestions((prev) => ({ ...prev, shipper: [] }));
      setValidatedValues((prev) => ({ ...prev, shipper: false }));
    } finally {
      setLoading((prev) => ({ ...prev, shipper: false }));
    }
  };

  const handleSearchVessel = async (term, fromButton = false) => {
    if (!term.trim()) {
      setSuggestions((prev) => ({ ...prev, vessel: [] }));
      setVisibleSuggestions((prev) => ({ ...prev, vessel: false }));
      setValidatedValues((prev) => ({ ...prev, vessel: false }));
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, vessel: true }));
      setVisibleSuggestions((prev) => ({ ...prev, vessel: true }));

      const data = await getVessels(term);
      setSuggestions((prev) => ({ ...prev, vessel: data || [] }));

      validateFieldInRealTime("vessel", term, data || []);
    } catch {
      setSuggestions((prev) => ({ ...prev, vessel: [] }));
      setValidatedValues((prev) => ({ ...prev, vessel: false }));
    } finally {
      setLoading((prev) => ({ ...prev, vessel: false }));
    }
  };

  const handleSearchCargoDescription = async (term, fromButton = false) => {
    if (!term.trim()) {
      setSuggestions((prev) => ({ ...prev, cargoDescription: [] }));
      setVisibleSuggestions((prev) => ({ ...prev, cargoDescription: false }));
      setValidatedValues((prev) => ({ ...prev, cargoDescription: false }));
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, cargoDescription: true }));
      setVisibleSuggestions((prev) => ({ ...prev, cargoDescription: true }));

      const data = await getCargoDescription(term);
      setSuggestions((prev) => ({ ...prev, cargoDescription: data || [] }));

      validateFieldInRealTime("cargoDescription", term, data || []);
    } catch {
      setSuggestions((prev) => ({ ...prev, cargoDescription: [] }));
      setValidatedValues((prev) => ({ ...prev, cargoDescription: false }));
    } finally {
      setLoading((prev) => ({ ...prev, cargoDescription: false }));
    }
  };

  // ✅ Handle selection from autocomplete - store both name and ID
  const handleSuggestionSelect = (fieldName, item, setFieldValue) => {
    const value = item.username || item.description || item.name || "";

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
    const selectedText =
      selectedItems[fieldName]?.username ||
      selectedItems[fieldName]?.description ||
      selectedItems[fieldName]?.name ||
      "";

    if (value.trim().toLowerCase() !== selectedText.trim().toLowerCase()) {
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
          const newCarrer = await createCarrier(modalResult.data);
          setCarriers((prev) => [newCarrer, ...prev]);
          // Add to suggestions and validate if it matches current field value
          setSuggestions((prev) => ({
            ...prev,
            carrier: [newCarrer, ...prev.carrier],
          }));
          toast.success(`Carrier Name "${newCarrer.name}" added!`);
        } else if (modalResult.title === "Create New Shipper Name") {
          const randomPassword = Math.random().toString(36).slice(-10);

          const payload = {
            username: modalResult.data.username,
            email: modalResult.data.email,
            address: modalResult.data.address,
            role: "shipper",
            password: randomPassword,
            phone: modalResult.data.phone,
            contact_person: modalResult.data.contactPerson,
          };
          const newShipper = await createShipper(payload);
          setShippers((prev) => [newShipper, ...prev]);
          setSuggestions((prev) => ({
            ...prev,
            shipper: [newShipper, ...prev.shipper],
          }));
          toast.success(`Shipper Information "${newShipper.username}" added!`);
        } else if (modalResult.title === "Create New Vessel Name") {
          const newVessel = await createVessel(modalResult.data);
          setVessels((prev) => [newVessel, ...prev]);
          // Add only to portOfDischarge suggestions
          setSuggestions((prev) => ({
            ...prev,
            vessel: [newVessel, ...prev.vessel],
          }));
          toast.success(`Vessel Name "${newVessel.name}" added!`);
        }
        if (modalResult.title === "Create New Cargo Description") {
          const newCargoDescription = await createCargoDescription(
            modalResult.data
          );
          setCargoDescriptions((prev) => [newCargoDescription, ...prev]);
          // Add only to portOfDischarge suggestions
          setSuggestions((prev) => ({
            ...prev,
            cargoDescription: [newCargoDescription, ...prev.cargoDescription],
          }));
          toast.success(
            `Cargo Description "${newCargoDescription.name}" added!`
          );
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
        initialValues={initialValues}
        validationSchema={bookingConfirmationSchema}
        onSubmit={handleSubmit}
        validateOnMount
        enableReinitialize
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
                <div className="col-md-6 position-relative">
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
                        if (suggestions.carrier.length > 0 && values.carrier) {
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
                      handleSuggestionSelect("carrier", item, setFieldValue)
                    }
                    fieldName="carrier"
                    loading={loading.carrier}
                  />
                  <ErrorMessage
                    name="carrier"
                    component="div"
                    className="text-danger small mt-1"
                  />
                  {values.carrier &&
                    !validatedValues.carrier &&
                    !errors.carrier && (
                      <div className="text-warning small mt-1">
                        ⚠️ Please select a value from the suggestions
                      </div>
                    )}
                  {/* Hidden field for booking party ID */}
                  <Field type="hidden" name="carrierId" />
                </div>
                <div className="col-md-6 text-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setModalConfig({
                        title: "Create New Carrier Name",
                        fields: [
                          {
                            name: "name",
                            label: "Carrier Name",
                            required: true,
                          },
                        ],
                      });
                      setShowModal(true);
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
                    className={`form-control ${
                      touched.ratesConfirmed && errors.ratesConfirmed
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter rates confirmation details"
                  />
                  <ErrorMessage
                    name="ratesConfirmed"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="bookingConfirmationNo" className="form-label">
                    Booking Confirmation No{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <Field
                    type="text"
                    name="bookingConfirmationNo"
                    className={`form-control ${
                      touched.bookingConfirmationNo &&
                      errors.bookingConfirmationNo
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter Booking Confirmation no"
                  />
                  <ErrorMessage
                    name="bookingConfirmationNo"
                    component="div"
                    className="text-danger small mt-1"
                  />
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
                    className={`form-control ${
                      touched.bookingDate && errors.bookingDate
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="bookingDate"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
              </div>

              {/* Shipper Details */}
              <div className="row mb-3">
                <div className="col-md-6 position-relative">
                  <label htmlFor="shipper" className="form-label">
                    Shipper <span className="text-danger">*</span>
                  </label>

                  <div className="input-group">
                    <Field
                      type="text"
                      name="shipper"
                      placeholder="Search Shipper"
                      className={`form-control ${
                        (touched.shipper && errors.shipper) ||
                        (values.shipper && !validatedValues.shipper)
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={(e) => {
                        handleInputChange(
                          "shipper",
                          e.target.value,
                          setFieldValue,
                          handleSearchShipper
                        );
                      }}
                      onFocus={() => {
                        if (suggestions.shipper.length > 0 && values.shipper) {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            shipper: true,
                          }));
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            shipper: false,
                          }));
                        }, 200);
                      }}
                      autoComplete="off"
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        const v = values.shipper;
                        if (v) {
                          handleSearchShipper(v, true);
                        } else {
                          toast.warning("Please enter a search term first");
                        }
                      }}
                      disabled={loading.shipper}
                    >
                      {loading.shipper ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fas fa-search"></i>
                      )}
                    </button>
                  </div>
                  <Field type="hidden" name="shipperId" />

                  <AutoCompleteList
                    items={suggestions.shipper}
                    visible={visibleSuggestions.shipper}
                    fieldName="shipper"
                    loading={loading.shipper}
                    onSelect={(item) =>
                      handleSuggestionSelect("shipper", item, setFieldValue)
                    }
                  />
                </div>

                <div className="col-md-6 text-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setModalConfig({
                        title: "Create New Shipper Name",
                        fields: [
                          {
                            name: "username",
                            label: "Shipper Name",
                            required: true,
                          },
                          {
                            type: "email",
                            name: "email",
                            label: "Shipper Email",
                            required: true,
                          },
                           {
                            name: "phone",
                            label: "Shipper Phone Number",
                            required: true,
                          },
                           {
                            name: "contactPerson",
                            label: "Shipper Contact Person",
                            required: true,
                          },
                          {
                            type: "textarea",
                            name: "address",
                            label: "Shipper Address",
                            required: false,
                          },
                          {
                            name: "role",
                            type: "hidden",
                            defaultValue: "shipper",
                            required: false,
                          },
                        ],
                      });
                      setShowModal(true);
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
                    readOnly
                    type="text"
                    name="portOfLoad"
                    className={`form-control`}
                    placeholder="Enter Port of Load"
                  />
                  <Field type="hidden" name="portOfLoadId" />
                </div>
                <div className="col-md-6">
                  <label htmlFor="portOfDischarge" className="form-label">
                    Port of Discharge
                  </label>
                  <Field
                    readOnly
                    type="text"
                    name="portOfDischarge"
                    className={`form-control`}
                    placeholder="Enter Port of Discharge"
                  />
                  <Field type="hidden" name="portOfDischargeId" />
                </div>
              </div>

              {/* Vessel Name */}
              <div className="row mb-3">
                <div className="col-md-6 position-relative">
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
                        if (suggestions.vessel.length > 0 && values.vessel) {
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
                      handleSuggestionSelect("vessel", item, setFieldValue)
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
                        title: "Create New Vessel Name",
                        fields: [
                          {
                            name: "name",
                            label: "Vessel Name",
                            required: true,
                          },
                        ],
                      });
                      setShowModal(true);
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
                    readOnly
                    type="text"
                    name="containerSize"
                    className={`form-control`}
                    placeholder="Enter Container Size"
                  />
                  <Field type="hidden" name="containerSizeId" />
                </div>
              </div>

              {/* Quantity and Weight */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-6">
                  <label htmlFor="quantity" className="form-label">
                    Quantity <span className="text-danger">*</span>
                  </label>
                  <Field
                    readOnly
                    type="number"
                    name="quantity"
                    className={`form-control ${
                      touched.quantity && errors.quantity ? "is-invalid" : ""
                    }`}
                    placeholder="Enter Quantity"
                  />
                  <ErrorMessage
                    name="quantity"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="weightKg" className="form-label">
                    Weight (KG)
                  </label>
                  <Field
                    readOnly
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
                  <Field as="select" name="cyCfs" className="form-select">
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
                      readOnly
                      type="text"
                      name="hsCode"
                      className={`form-control`}
                      placeholder="Search HS CODE"
                    />
                    <Field type="hidden" name="hsCodeId" />
                  </div>
                </div>
              </div>

              {/* Cargo Description */}
              <div className="row mb-3">
                <div className="col-md-6 position-relative">
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
                        (values.cargoDescription &&
                          !validatedValues.cargoDescription)
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
                        title: "Create New Cargo Description",
                        fields: [
                          {
                            type: "textarea",
                            name: "description",
                            label: "Cargo Description",
                            required: true,
                          },
                        ],
                      });
                      setShowModal(true);
                    }}
                  >
                    <i className="fas fa-plus"></i> Create New
                  </button>
                </div>
              </div>

              {/* Additional Information Section */}
              {/* <div className="row mt-4">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Additional Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <label
                            htmlFor="specialInstructions"
                            className="form-label"
                          >
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
                          <label
                            htmlFor="additionalRemarks"
                            className="form-label"
                          >
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
              </div> */}

              {/* Form Actions */}
              <div className="row mt-4">
                <div className="col-md-12">
                  <div className="d-flex justify-content-end">
                    <div>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-1"></i>{" "}
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-1"></i>{" "}
                            {values.id
                              ? "Update Booking Confirmation"
                              : "Save Booking Confirmation"}
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

export default BookingConfirmation;
