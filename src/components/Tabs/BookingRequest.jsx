import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import StepHeading from "../Common/StepHeading";
import { bookingRequestSchema } from "../../schemas/validationSchemas";
import { useBooking } from "../../context/BookingContext";

import {
  createBookingRequest,
  updateBookingRequest,
} from "../../api/bookingRequestApi";
import { toast } from "react-toastify";
import {
  getBookingParties,
  createBookingParty,
  getPorts,
  createPort,
  getUsers,
  getCargoTypesFull,
  getContainerSizes,
  getHsCodes,
  createHsCode,
  getRequestTypes,
} from "../../api/commonRequest";

// ✅ Reusable autocomplete suggestion list component
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

const BookingRequest = ({
  setShowModal,
  setModalConfig,
  onSubmit,
  initialData,
  onFormValidityChange,
  modalResult,
}) => {
  const { setBookingId, setBookingRequestData } = useBooking(); 

  const initialValues = {
    requestedDate: "",
    typeOfRequest: "",
    bookingParty: "",
    bookingPartyId: "",
    userId: "",
    portOfLoad: "",
    portOfLoadId: "",
    portOfDischarge: "",
    portOfDischargeId: "",
    cargoType: "",
    cargoTypeId: "",
    containerSize: "",
    quantity: "",
    hsCode: "",
    weightKg: "",
    commodity: "",
    shippingLines: [
      {
        carrier: "MSC",
        dateSent: "",
        method: "",
        confirmationId: "",
        status: "",
        freight: "",
      },
      {
        carrier: "Maersk",
        dateSent: "",
        method: "",
        confirmationId: "",
        status: "",
        freight: "",
      },
    ],
  };

  const [bookingParties, setBookingParties] = useState([]);
  const [ports, setPorts] = useState([]);
  const [requestTypes, setRequestTypes] = useState([]);
  const [suggestions, setSuggestions] = useState({
    bookingParty: [],
    portOfLoad: [],
    portOfDischarge: [],
    hsCode: [],
  });
  const [selectedItems, setSelectedItems] = useState({
    bookingParty: null,
    portOfLoad: null,
    portOfDischarge: null,
    hsCode: null,
  });
  const [visibleSuggestions, setVisibleSuggestions] = useState({
    bookingParty: false,
    portOfLoad: false,
    portOfDischarge: false,
    hsCode: false,
  });
  const [loading, setLoading] = useState({
    bookingParty: false,
    portOfLoad: false,
    portOfDischarge: false,
    hsCode: false,
  });
  const [validatedValues, setValidatedValues] = useState({
    bookingParty: false,
    portOfLoad: false,
    portOfDischarge: false,
    hsCode: false,
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

  // ✅ Real-time validation as user types
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

  // ✅ Handle form submission with proper ID mapping
  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setErrors }
  ) => {
    try {
      console.log("Form Values on Submit:", values); // Debug all values

      const errors = {};

      const bookingPartyError = validateAutocompleteField(
        "Booking Party",
        values.bookingParty,
        suggestions.bookingParty
      );
      if (bookingPartyError) errors.bookingParty = bookingPartyError;

      const portOfLoadError = validateAutocompleteField(
        "Port of Load",
        values.portOfLoad,
        suggestions.portOfLoad
      );
      if (portOfLoadError) errors.portOfLoad = portOfLoadError;

      const portOfDischargeError = validateAutocompleteField(
        "Port of Discharge",
        values.portOfDischarge,
        suggestions.portOfDischarge
      );
      if (portOfDischargeError) errors.portOfDischarge = portOfDischargeError;

      const hsCodeError = validateAutocompleteField(
        "HS Code",
        values.hsCode,
        suggestions.hsCode
      );
      if (hsCodeError) errors.hsCode = hsCodeError;

      // If there are validation errors, stop submission
      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        toast.error("Please fix the validation errors before submitting");
        setSubmitting(false);
        return;
      }

      // ✅ Prepare formatted payload with IDs instead of strings
      const formatted = {
        requested_date: values.requestedDate,
        type_of_request_id: parseInt(values.typeOfRequest),
        booking_party_id: parseInt(values.bookingPartyId), // Send ID instead of string
        user_id: parseInt(values.userId),
        port_of_load_id: parseInt(values.portOfLoadId), // Send ID instead of string
        port_of_discharge_id: parseInt(values.portOfDischargeId), // Send ID instead of string
        cargo_type_id: parseInt(values.cargoType), // Send ID instead of string
        container_size_id: parseInt(values.containerSize),
        hs_code_id: parseInt(values.hsCodeId),
        quantity: parseInt(values.quantity),
        weight_kg: parseInt(values.weightKg),
        commodity: values.commodity,
        shipping_lines: values.shippingLines.map((line) => ({
          carrier: line.carrier,
          date_sent: line.dateSent,
          method: line.method,
          confirmation_id: line.confirmationId,
          status: line.status,
          freight: line.freight,
        })),
      };

      let response;
      if (values.id) {
        response = await updateBookingRequest(values.id, formatted);
        toast.success("Booking Request updated successfully!");
      } else {
        response = await createBookingRequest(formatted);
        toast.success("Booking Request saved successfully!");
      }
      const saved = response.data || response;
      setBookingId(saved.id);
      const selectedContainerSize = containerSizes.find(
        (cs) => String(cs.id) === String(values.containerSize)
      );
      setBookingRequestData({
        id: saved.id,
        requestedDate: values.requestedDate,
        typeOfRequest: values.typeOfRequest,
        bookingParty: values.bookingParty,
        userId: values.userId,
        portOfLoad: values.portOfLoad,
        portOfDischarge: values.portOfDischarge,
        portOfLoadId: values.portOfLoadId,
        portOfDischargeId: values.portOfDischargeId,
        containerSizeId: values.containerSize,
        containerSize: selectedContainerSize?.name || "",
        quantity: values.quantity,
        hsCodeId: values.hsCodeId,
        hsCode: values.hsCode,
        weightKg: values.weightKg,
        commodity: values.commodity,
      });
      if (onSubmit) onSubmit(saved, true);
      resetForm({ values: { ...values, ...saved } });
    } catch (err) {
      console.error("❌ Error saving booking request:", err);
      toast.error("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handle search for booking parties with debouncing
  const handleSearchBookingParty = async (term, fromButton = false) => {
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
  const handleSearchHsCode = async (term, fromButton = false) => {
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

  // ✅ Handle search for ports with type filtering
  const handleSearchPort = async (
    term,
    field,
    portType,
    fromButton = false
  ) => {
    if (!term.trim()) {
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
      setVisibleSuggestions((prev) => ({ ...prev, [field]: false }));
      setValidatedValues((prev) => ({ ...prev, [field]: false }));
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, [field]: true }));
      setVisibleSuggestions((prev) => ({ ...prev, [field]: true }));

      // Get all ports and filter by type
      const allPorts = await getPorts(term);

      // Filter ports by type (load or discharge)
      const filteredPorts = allPorts.filter(
        (port) =>
          port.type && port.type.toLowerCase() === portType.toLowerCase()
      );

      setSuggestions((prev) => ({ ...prev, [field]: filteredPorts || [] }));

      // Real-time validation after search
      validateFieldInRealTime(field, term, filteredPorts || []);
    } catch (error) {
      console.error("Error searching ports:", error);
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
      setValidatedValues((prev) => ({ ...prev, [field]: false }));
      if (fromButton) {
        toast.error("Search failed. Please try again.");
      }
    } finally {
      setLoading((prev) => ({ ...prev, [field]: false }));
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
        if (modalResult.title === "Create New Booking Party") {
          const newParty = await createBookingParty(modalResult.data);
          setBookingParties((prev) => [newParty, ...prev]);
          // Add to suggestions and validate if it matches current field value
          setSuggestions((prev) => ({
            ...prev,
            bookingParty: [newParty, ...prev.bookingParty],
          }));
          toast.success(`Booking Party "${newParty.name}" added!`);
        } else if (modalResult.title === "Create New Port Of Load") {
          const newPort = await createPort(modalResult.data);
          setPorts((prev) => [newPort, ...prev]);
          // Add only to portOfLoad suggestions
          setSuggestions((prev) => ({
            ...prev,
            portOfLoad: [newPort, ...prev.portOfLoad],
          }));
          toast.success(`Port of Load "${newPort.name}" added!`);
        } else if (modalResult.title === "Create New Port of Discharge") {
          const newPort = await createPort(modalResult.data);
          setPorts((prev) => [newPort, ...prev]);
          // Add only to portOfDischarge suggestions
          setSuggestions((prev) => ({
            ...prev,
            portOfDischarge: [newPort, ...prev.portOfDischarge],
          }));
          toast.success(`Port of Discharge "${newPort.name}" added!`);
        }
        if (modalResult.title === "Create New HS Code") {
          const newHsCode = await createHsCode(modalResult.data);
          setPorts((prev) => [newHsCode, ...prev]);
          // Add only to portOfDischarge suggestions
          setSuggestions((prev) => ({
            ...prev,
            portOfDischarge: [newHsCode, ...prev.portOfDischarge],
          }));
          toast.success(`Port of Discharge "${newHsCode.name}" added!`);
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

  const [users, setUsers] = useState([]);
  const [cargoTypes, setCargoTypes] = useState([]);
  const [containerSizes, setContainerSizes] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res); // API se jo data aa raha hai
      } catch (error) {
        console.error("Failed to load Users");
      }
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    const fetchCargoTypes = async () => {
      try {
        const res = await getCargoTypesFull();
        setCargoTypes(res); // API se jo data aa raha hai
      } catch (error) {
        console.error("Failed to load Cargo Types");
      }
    };

    fetchCargoTypes();
  }, []);
  useEffect(() => {
    const fetchContainerSizes = async () => {
      try {
        const res = await getContainerSizes();
        setContainerSizes(res); // API se jo data aa raha hai
      } catch (error) {
        console.error("Failed to load Container Sizes");
      }
    };

    fetchContainerSizes();
  }, []);
  useEffect(() => {
    const fetchRequestTypes = async () => {
      try {
        const res = await getRequestTypes();
        console;
        setRequestTypes(res); // API se jo data aa raha hai
      } catch (error) {
        console.error("Failed to load Request Types");
      }
    };

    fetchRequestTypes();
  }, []);

  useEffect(() => {
    const fetchCargoTypes = async () => {
      try {
        const res = await getCargoTypesFull();
        setCargoTypes(res);
      } catch (error) {
        console.error("Failed to load Cargo Types");
      }
    };
    fetchCargoTypes();
  }, []);

  return (
    <>
      <StepHeading
        title="Booking Request"
        description="Enter the booking details received from the shipper/client"
      />

      <Formik
        initialValues={
          initialData && Object.keys(initialData).length
            ? initialData
            : initialValues
        }
        validationSchema={bookingRequestSchema}
        onSubmit={handleSubmit}
        validateOnMount
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

          // ✅ DEBUG: Show all errors in UI temporarily
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
              {/* Request Date and Type */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-6">
                  <label htmlFor="requestedDate" className="form-label">
                    Requested Date <span className="text-danger">*</span>
                  </label>
                  <Field
                    type="date"
                    name="requestedDate"
                    className={`form-control ${
                      touched.requestedDate && errors.requestedDate
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="requestedDate"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="typeOfRequest" className="form-label">
                    Type Of Request <span className="text-danger">*</span>
                  </label>
                  <Field
                    as="select"
                    name="typeOfRequest"
                    className={`form-select ${
                      touched.typeOfRequest && errors.typeOfRequest
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option value="">Select Request Type</option>
                    {requestTypes.map((requestType) => (
                      <option key={requestType.id} value={requestType.id}>
                        {requestType.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="typeOfRequest"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
              </div>

              {/* 🔹 Booking Party (Autocomplete Search) */}
              <div className="row mb-3">
                <div className="col-md-6 position-relative">
                  <label htmlFor="bookingParty" className="form-label">
                    Booking Party - Name & Address{" "}
                    <span className="text-danger">*</span>
                  </label>

                  <div className="input-group">
                    <Field
                      type="text"
                      name="bookingParty"
                      placeholder="Search Booking Party"
                      className={`form-control ${
                        (touched.bookingParty && errors.bookingParty) ||
                        (values.bookingParty && !validatedValues.bookingParty)
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={(e) => {
                        handleInputChange(
                          "bookingParty",
                          e.target.value,
                          setFieldValue,
                          handleSearchBookingParty
                        );
                      }}
                      onFocus={() => {
                        if (
                          suggestions.bookingParty.length > 0 &&
                          values.bookingParty
                        ) {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            bookingParty: true,
                          }));
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            bookingParty: false,
                          }));
                        }, 200);
                      }}
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        const currentValue = values.bookingParty;
                        if (currentValue) {
                          handleSearchBookingParty(currentValue, true);
                        } else {
                          toast.warning("Please enter a search term first");
                        }
                      }}
                      disabled={loading.bookingParty}
                    >
                      {loading.bookingParty ? (
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
                    items={suggestions.bookingParty}
                    visible={visibleSuggestions.bookingParty}
                    onSelect={(item) =>
                      handleSuggestionSelect(
                        "bookingParty",
                        item,
                        setFieldValue
                      )
                    }
                    fieldName="bookingParty"
                    loading={loading.bookingParty}
                  />

                  <ErrorMessage
                    name="bookingParty"
                    component="div"
                    className="text-danger small mt-1"
                  />
                  {values.bookingParty &&
                    !validatedValues.bookingParty &&
                    !errors.bookingParty && (
                      <div className="text-warning small mt-1">
                        ⚠️ Please select a value from the suggestions
                      </div>
                    )}
                  {/* Hidden field for booking party ID */}
                  <Field type="hidden" name="bookingPartyId" />
                </div>
                <div
                  className="col-md-6 text-end"
                  style={{ marginTop: "2rem" }}
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setModalConfig({
                        title: "Create New Booking Party",
                        fields: [
                          {
                            name: "name",
                            label: "Booking Party Name",
                            required: true,
                          },
                          {
                            type: "textarea",
                            name: "address",
                            label: "Booking Address",
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

              {/* User Selection */}
              <div className="row mb-3">
                <div className="col-md-12">
                  <label htmlFor="userId" className="form-label">
                    Users <span className="text-danger">*</span>
                  </label>
                  <Field
                    as="select"
                    name="userId"
                    className={`form-select ${
                      touched.userId && errors.userId ? "is-invalid" : ""
                    }`}
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="userId"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
              </div>

              {/* 🔹 Port of Load (Autocomplete Search) */}
              <div className="row mb-3">
                <div className="col-md-6 position-relative">
                  <label htmlFor="portOfLoad" className="form-label">
                    Port of Load <span className="text-danger">*</span>
                  </label>

                  <div className="input-group">
                    <Field
                      type="text"
                      name="portOfLoad"
                      placeholder="Search Port of Load"
                      className={`form-control ${
                        (touched.portOfLoad && errors.portOfLoad) ||
                        (values.portOfLoad && !validatedValues.portOfLoad)
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={(e) => {
                        handleInputChange(
                          "portOfLoad",
                          e.target.value,
                          setFieldValue,
                          (term) => handleSearchPort(term, "portOfLoad", "load")
                        );
                      }}
                      onFocus={() => {
                        if (
                          suggestions.portOfLoad.length > 0 &&
                          values.portOfLoad
                        ) {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            portOfLoad: true,
                          }));
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            portOfLoad: false,
                          }));
                        }, 200);
                      }}
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        const currentValue = values.portOfLoad;
                        if (currentValue) {
                          handleSearchPort(
                            currentValue,
                            "portOfLoad",
                            "load",
                            true
                          );
                        } else {
                          toast.warning("Please enter a search term first");
                        }
                      }}
                      disabled={loading.portOfLoad}
                    >
                      {loading.portOfLoad ? (
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
                    items={suggestions.portOfLoad}
                    visible={visibleSuggestions.portOfLoad}
                    onSelect={(item) =>
                      handleSuggestionSelect("portOfLoad", item, setFieldValue)
                    }
                    fieldName="portOfLoad"
                    loading={loading.portOfLoad}
                  />

                  <ErrorMessage
                    name="portOfLoad"
                    component="div"
                    className="text-danger small mt-1"
                  />
                  {values.portOfLoad &&
                    !validatedValues.portOfLoad &&
                    !errors.portOfLoad && (
                      <div className="text-warning small mt-1">
                        ⚠️ Please select a value from the suggestions
                      </div>
                    )}
                  {/* Hidden field for port of load ID */}
                  <Field type="hidden" name="portOfLoadId" />
                </div>
                <div
                  className="col-md-6 text-end"
                  style={{ marginTop: "2rem" }}
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setModalConfig({
                        title: "Create New Port Of Load",
                        fields: [
                          {
                            name: "name",
                            label: "Port Of Load",
                            required: true,
                          },
                          {
                            name: "type",
                            hidden: true,
                            value: "load",
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

              {/* 🔹 Port of Discharge (Autocomplete Search) */}
              <div className="row mb-3">
                <div className="col-md-6 position-relative">
                  <label htmlFor="portOfDischarge" className="form-label">
                    Port of Discharge <span className="text-danger">*</span>
                  </label>

                  <div className="input-group">
                    <Field
                      type="text"
                      name="portOfDischarge"
                      placeholder="Search Port of Discharge"
                      className={`form-control ${
                        (touched.portOfDischarge && errors.portOfDischarge) ||
                        (values.portOfDischarge &&
                          !validatedValues.portOfDischarge)
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={(e) => {
                        handleInputChange(
                          "portOfDischarge",
                          e.target.value,
                          setFieldValue,
                          (term) =>
                            handleSearchPort(
                              term,
                              "portOfDischarge",
                              "discharge"
                            )
                        );
                      }}
                      onFocus={() => {
                        if (
                          suggestions.portOfDischarge.length > 0 &&
                          values.portOfDischarge
                        ) {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            portOfDischarge: true,
                          }));
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            portOfDischarge: false,
                          }));
                        }, 200);
                      }}
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        const currentValue = values.portOfDischarge;
                        if (currentValue) {
                          handleSearchPort(
                            currentValue,
                            "portOfDischarge",
                            "discharge",
                            true
                          );
                        } else {
                          toast.warning("Please enter a search term first");
                        }
                      }}
                      disabled={loading.portOfDischarge}
                    >
                      {loading.portOfDischarge ? (
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
                    items={suggestions.portOfDischarge}
                    visible={visibleSuggestions.portOfDischarge}
                    onSelect={(item) =>
                      handleSuggestionSelect(
                        "portOfDischarge",
                        item,
                        setFieldValue
                      )
                    }
                    fieldName="portOfDischarge"
                    loading={loading.portOfDischarge}
                  />

                  <ErrorMessage
                    name="portOfDischarge"
                    component="div"
                    className="text-danger small mt-1"
                  />
                  {values.portOfDischarge &&
                    !validatedValues.portOfDischarge &&
                    !errors.portOfDischarge && (
                      <div className="text-warning small mt-1">
                        ⚠️ Please select a value from the suggestions
                      </div>
                    )}
                  {/* Hidden field for port of discharge ID */}
                  <Field type="hidden" name="portOfDischargeId" />
                </div>
                <div
                  className="col-md-6 text-end"
                  style={{ marginTop: "2rem" }}
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setModalConfig({
                        title: "Create New Port of Discharge",
                        fields: [
                          {
                            name: "name",
                            label: "Port of Discharge",
                            required: true,
                          },
                          {
                            name: "type",
                            hidden: true,
                            value: "discharge",
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

              {/* Cargo Type and Container Size */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-6">
                  <label htmlFor="cargoType" className="form-label">
                    Cargo Type <span className="text-danger">*</span>
                  </label>
                  <Field
                    as="select"
                    name="cargoType"
                    className={`form-select ${
                      touched.cargoType && errors.cargoType ? "is-invalid" : ""
                    }`}
                  >
                    <option value="">Select Cargo Type</option>
                    {cargoTypes.map((cargoType) => (
                      <option key={cargoType.id} value={cargoType.id}>
                        {cargoType.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="cargoType"
                    component="div"
                    className="text-danger small mt-1"
                  />
                  {/* Hidden field for cargo type ID */}
                  <Field type="hidden" name="cargoTypeId" />
                </div>
                <div className="col-md-6">
                  <label htmlFor="containerSize" className="form-label">
                    Container Size <span className="text-danger">*</span>
                  </label>
                  <Field
                    as="select"
                    name="containerSize"
                    className={`form-select ${
                      touched.containerSize && errors.containerSize
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option value="">Select Container Size</option>
                    {containerSizes.map((containerSize) => (
                      <option key={containerSize.id} value={containerSize.id}>
                        {containerSize.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="containerSize"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
              </div>

              {/* Rest of the form remains the same... */}
              {/* Quantity and HS Code */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-6">
                  <label htmlFor="weightKg" className="form-label">
                    Weight (KG) <span className="text-danger">*</span>
                  </label>
                  <Field
                    type="number"
                    name="weightKg"
                    className={`form-control ${
                      touched.weightKg && errors.weightKg ? "is-invalid" : ""
                    }`}
                    placeholder="Enter Weight (KG)"
                  />
                  <ErrorMessage
                    name="weightKg"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="commodity" className="form-label">
                    Commodity <span className="text-danger">*</span>
                  </label>
                  <Field
                    type="text"
                    name="commodity"
                    className={`form-control ${
                      touched.commodity && errors.commodity ? "is-invalid" : ""
                    }`}
                    placeholder="Enter Commodity"
                  />
                  <ErrorMessage
                    name="commodity"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
              </div>
              <div className="row mb-3 align-items-center">
                <div className="col-md-6">
                  <label htmlFor="quantity" className="form-label">
                    Quantity <span className="text-danger">*</span>
                  </label>
                  <Field
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
              </div>

              {/* Weight and Commodity */}

              <div className="row mb-3">
                <div className="col-md-6 position-relative">
                  <label htmlFor="hsCode" className="form-label">
                    HS CODE <span className="text-danger">*</span>
                  </label>

                  <div className="input-group">
                    <Field
                      type="text"
                      name="hsCode"
                      placeholder="Search HS CODE"
                      className={`form-control ${
                        (touched.hsCode && errors.hsCode) ||
                        (values.hsCode && !validatedValues.hsCode)
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={(e) => {
                        handleInputChange(
                          "hsCode",
                          e.target.value,
                          setFieldValue,
                          handleSearchHsCode
                        );
                      }}
                      onFocus={() => {
                        if (suggestions.hsCode.length > 0 && values.hsCode) {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            hsCode: true,
                          }));
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            hsCode: false,
                          }));
                        }, 200);
                      }}
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        const currentValue = values.hsCode;
                        if (currentValue) {
                          handleSearchHsCode(currentValue, true);
                        } else {
                          toast.warning("Please enter a search term first");
                        }
                      }}
                      disabled={loading.hsCode}
                    >
                      {loading.hsCode ? (
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
                    items={suggestions.hsCode}
                    visible={visibleSuggestions.hsCode}
                    onSelect={(item) =>
                      handleSuggestionSelect("hsCode", item, setFieldValue)
                    }
                    fieldName="hsCode"
                    loading={loading.hsCode}
                  />

                  <ErrorMessage
                    name="hsCode"
                    component="div"
                    className="text-danger small mt-1"
                  />
                  {values.hsCode &&
                    !validatedValues.hsCode &&
                    !errors.hsCode && (
                      <div className="text-warning small mt-1">
                        ⚠️ Please select a value from the suggestions
                      </div>
                    )}
                  {/* Hidden field for booking party ID */}
                  <Field type="hidden" name="hsCodeId" />
                </div>
                <div
                  className="col-md-6 text-end"
                  style={{ marginTop: "2rem" }}
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setModalConfig({
                        title: "Create New HS Code",
                        fields: [
                          {
                            name: "name",
                            label: "HS Code Name",
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
                            <th scope="col">
                              Booking Request sent to Name of Carrier - *Create
                              New or Search
                            </th>
                            <th scope="col">Date Request sent</th>
                            <th scope="col">
                              Drop List - Email/Online Web/Service contract
                            </th>
                            <th scope="col">Carrier Confirmation ID</th>
                            <th scope="col">
                              Drop List - New/Pending/Received/Closed
                            </th>
                            <th scope="col">
                              Drop list - Freight Prepaid/Freight
                              Collect/Freight Elsewhere
                            </th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {values.shippingLines.map((line, index) => (
                            <tr key={index}>
                              <td>
                                <Field
                                  name={`shippingLines.${index}.carrier`}
                                  className={`form-control ${
                                    errors.shippingLines?.[index]?.carrier
                                      ? "is-invalid"
                                      : ""
                                  }`}
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
                                  <option value="Service Contract">
                                    Service Contract
                                  </option>
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
                                  <option value="Freight Prepaid">
                                    Freight Prepaid
                                  </option>
                                  <option value="Freight Collect">
                                    Freight Collect
                                  </option>
                                  <option value="Freight Elsewhere">
                                    Freight Elsewhere
                                  </option>
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
                        <div
                          key={index}
                          className="table-row mb-3 p-3 border rounded"
                        >
                          <div className="table-cell mb-2">
                            <label className="form-label fw-bold">
                              Booking Request sent to Name of Carrier:
                            </label>
                            <Field
                              name={`shippingLines.${index}.carrier`}
                              className={`form-control ${
                                errors.shippingLines?.[index]?.carrier
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                            <ErrorMessage
                              name={`shippingLines.${index}.carrier`}
                              component="div"
                              className="text-danger small mt-1"
                            />
                          </div>
                          <div className="table-cell mb-2">
                            <label className="form-label fw-bold">
                              Date Request sent:
                            </label>
                            <Field
                              name={`shippingLines.${index}.dateSent`}
                              className="form-control"
                              placeholder="MM/DD/YYYY"
                            />
                          </div>
                          <div className="table-cell mb-2">
                            <label className="form-label fw-bold">
                              Drop List - Email/Online Web/Service contract:
                            </label>
                            <Field
                              as="select"
                              name={`shippingLines.${index}.method`}
                              className="form-control"
                            >
                              <option value="">Select Method</option>
                              <option value="Email">Email</option>
                              <option value="Online Web">Online Web</option>
                              <option value="Service Contract">
                                Service Contract
                              </option>
                            </Field>
                          </div>
                          <div className="table-cell mb-2">
                            <label className="form-label fw-bold">
                              Carrier Confirmation ID:
                            </label>
                            <Field
                              name={`shippingLines.${index}.confirmationId`}
                              className="form-control"
                              placeholder="Enter Confirmation ID"
                            />
                          </div>
                          <div className="table-cell mb-2">
                            <label className="form-label fw-bold">
                              Drop List - New/Pending/Received/Closed:
                            </label>
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
                            <label className="form-label fw-bold">
                              Drop list - Freight Prepaid/Freight
                              Collect/Freight Elsewhere:
                            </label>
                            <Field
                              as="select"
                              name={`shippingLines.${index}.freight`}
                              className="form-control"
                            >
                              <option value="">Select Freight Type</option>
                              <option value="Freight Prepaid">
                                Freight Prepaid
                              </option>
                              <option value="Freight Collect">
                                Freight Collect
                              </option>
                              <option value="Freight Elsewhere">
                                Freight Elsewhere
                              </option>
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
                        onClick={() =>
                          push({
                            carrier: "",
                            dateSent: "",
                            method: "",
                            confirmationId: "",
                            status: "",
                            freight: "",
                          })
                        }
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
                              ? "Update Booking Request"
                              : "Save Booking Request"}
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

export default BookingRequest;
