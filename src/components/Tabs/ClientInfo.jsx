import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import StepHeading from "../Common/StepHeading";
import { clientInfoSchema } from "../../schemas/validationSchemas";
import { useBooking } from "../../context/BookingContext";
import { toast } from "react-toastify";
import { createClient, updateClient, getClient } from "../../api/clientInfoApi";
import { createLink } from "../../api/bookingRequestClientInfoApi";
import { getClients } from "../../api/clientInfoApi";
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
            <>
              <strong>{item.name}</strong>
              {item.address && (
                <small className="text-muted d-block">{item.address}</small>
              )}
            </>

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
const ClientInfo = ({
  setShowModal,
  setModalConfig,
  onSubmit,
  initialData,
  onFormValidityChange,
  modalResult = null,
}) => {
  const { bookingId } = useBooking();
  const initialValues = {
    id: initialData?.id || null,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    methodSent: initialData?.methodSent,
    client: initialData?.client,
    companyRegistrationNo: initialData?.companyRegistrationNo,
    taxId: initialData?.taxId,
    companyVatNo: initialData?.companyVatNo,
    contactPerson: initialData?.contactPerson,
    phone: initialData?.phone,
    email: initialData?.email,
    address: initialData?.address,
  };
  const [clients, setClients] = useState([]);
  const [suggestions, setSuggestions] = useState({
    client: [],
  });
  const [selectedItems, setSelectedItems] = useState({
    client: null,
  });

  const [visibleSuggestions, setVisibleSuggestions] = useState({
    client: false,
  });
  const [loading, setLoading] = useState({
    client: false,
  });
  const [validatedValues, setValidatedValues] = useState({
    client: false,
  });
  const validateAutocompleteField = (fieldName, value, suggestions) => {
    if (!value) return `${fieldName} is required`;

    // Check if the value exists in the suggestions (case insensitive)
    const exists = suggestions.some((item) => {
      const text = item.addrees || item.name || "";

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
        item.addrees || // cargo description
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

    const clientError = validateAutocompleteField(
      "Client",
      values.client,
      suggestions.client
    );
    if (clientError) errors.client = clientError;

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      toast.error("Please fix the validation errors before submitting");
      setSubmitting(false);
      return;
    }

    try {
      const formatted = {
        booking_request_id: bookingId,
        client_info_id: values.client_info_id,
        method_type: values.methodSent, // dropdown value
        entry_date: new Date().toISOString().split("T")[0],
      };

      let response;
      if (!values.id) {
        // ✅ Update
        response = await createLink(formatted);
        toast.success("Client info saved successfully!");
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
  const handleSearchClient = async (term, setFieldValueRef = null) => {
    if (!term.trim()) {
      setSuggestions((prev) => ({ ...prev, client: [] }));
      setVisibleSuggestions((prev) => ({ ...prev, client: false }));
      setValidatedValues((prev) => ({ ...prev, client: false }));
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, client: true }));
      setVisibleSuggestions((prev) => ({ ...prev, client: true }));

      const allClients = await getClients();

      const filtered = allClients.filter(
        (item) =>
          (item.name || "").toLowerCase().includes(term.toLowerCase()) ||
          (item.address || "").toLowerCase().includes(term.toLowerCase())
      );

      setSuggestions((prev) => ({
        ...prev,
        client: filtered,
      }));

      validateFieldInRealTime("client", term, filtered);

      // ⭐ Auto-select exact match and fill all fields
      if (setFieldValueRef) {
        const exactMatch = filtered.find(
          (c) => c.name.toLowerCase() === term.toLowerCase()
        );

        if (exactMatch) {
          handleSuggestionSelect("client", exactMatch, setFieldValueRef);
        }
      }
    } catch (err) {
      console.error(err);
      setSuggestions((prev) => ({ ...prev, client: [] }));
      setValidatedValues((prev) => ({ ...prev, client: false }));
    } finally {
      setLoading((prev) => ({ ...prev, client: false }));
    }
  };

  const handleSuggestionSelect = (fieldName, item, setFieldValue) => {
    const value = item.name || "";
    const id = item.id;

    // Set both the display text and the ID
    setFieldValue(fieldName, value);
    setFieldValue("client_info_id", id);

    // Save selected item
    setSelectedItems((prev) => ({ ...prev, [fieldName]: item }));

    // Hide suggestions
    setVisibleSuggestions((prev) => ({ ...prev, [fieldName]: false }));

    // Mark as valid
    setValidatedValues((prev) => ({ ...prev, [fieldName]: true }));

    // Auto-fill other details
    setFieldValue("companyRegistrationNo", item.company_registration_no || "");
    setFieldValue("taxId", item.tax_id || "");
    setFieldValue("companyVatNo", item.company_vat_no || "");
    setFieldValue("contactPerson", item.contact_person || "");
    setFieldValue("phone", item.phone || "");
    setFieldValue("email", item.email || "");
    setFieldValue("address", item.address || "");

    toast.success(`Selected: ${value}`);
  };

  const handleInputChange = (
    fieldName,
    value,
    setFieldValue,
    searchFunction
  ) => {
    setFieldValue(fieldName, value);

    // Clear the ID when user starts typing
    const selectedText =
      selectedItems[fieldName]?.name || selectedItems[fieldName]?.address || "";

    if (value.trim().toLowerCase() !== selectedText.trim().toLowerCase()) {
      if (fieldName === "client") {
        setFieldValue("client_info_id", "");
      }
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
  useEffect(() => {
    if (!modalResult) return;

    const handleModalResult = async () => {
      try {
        if (modalResult.title === "Create New Client") {
          const payload = {
            name: modalResult.data.clientName,
            contact_person: modalResult.data.clientContactPerson,
            email: modalResult.data.clientEmail,
            phone: modalResult.data.clientPhone,
            address: modalResult.data.clientAddress,
            tax_id: modalResult.data.clientTaxID,
            company_registration_no:
              modalResult.data.clientCompanyRegistrationNo,
            company_vat_no: modalResult.data.clientCompanyVatNo,
          };

          const newClient = await createClient(payload);
          setClients((prev) => [newClient, ...prev]);
          setSuggestions((prev) => ({
            ...prev,
            client: [newClient, ...prev.client],
          }));
          toast.success(`Client Information "${newClient.name}" added!`);
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
        title="Client Information"
        description="Enter the client details for invoice generation"
      />

      <Formik
        initialValues={initialValues}
        validationSchema={clientInfoSchema}
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
                    className={`form-control ${
                      touched.date && errors.date ? "is-invalid" : ""
                    }`}
                    readOnly
                  />
                  <ErrorMessage
                    name="date"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="methodSent" className="form-label">
                    Method Sent <span className="text-danger">*</span>
                  </label>
                  <Field
                    as="select"
                    name="methodSent"
                    className={`form-select ${
                      touched.methodSent && errors.methodSent
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option value="">Select Method</option>
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Verbal">Verbal</option>
                    <option value="In Person">In Person</option>
                    <option value="Post">Post</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ErrorMessage
                    name="methodSent"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
              </div>

              {/* Client Search */}
              <div className="row mb-3">
                <div className="col-md-6 position-relative">
                  <label htmlFor="client" className="form-label">
                    Client Name & Address <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <Field
                      type="text"
                      name="client"
                      className={`form-control ${
                        touched.client && errors.client ? "is-invalid" : ""
                      }`}
                      placeholder="Search Clients Name & Address"
                      onChange={(e) => {
                        handleInputChange(
                          "client",
                          e.target.value,
                          setFieldValue,
                          handleSearchClient
                        );
                      }}
                      onFocus={() => {
                        if (suggestions.client.length > 0 && values.client) {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            client: true,
                          }));
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setVisibleSuggestions((prev) => ({
                            ...prev,
                            client: false,
                          }));
                        }, 200);
                      }}
                      autoComplete="off"
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        const v = values.client;
                        if (v) {
                          handleSearchClient(v, true);
                        } else {
                          toast.warning("Please enter a search term first");
                        }
                      }}
                      disabled={loading.client}
                    >
                      {loading.client ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fas fa-search"></i>
                      )}
                    </button>
                  </div>
                  <Field type="hidden" name="client_info_id" />
                  <AutoCompleteList
                    items={suggestions.client}
                    visible={visibleSuggestions.client}
                    fieldName="client"
                    loading={loading.client}
                    onSelect={(item) =>
                      handleSuggestionSelect("client", item, setFieldValue)
                    }
                  />
                </div>
                <ErrorMessage
                  name="client"
                  component="div"
                  className="text-danger small mt-1"
                />

                <div className="col-md-6 text-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setModalConfig({
                        title: "Create New Client",
                        fields: [
                          {
                            name: "clientName",
                            label: "Client Name",
                            required: true,
                          },
                          {
                            name: "clientCompanyRegistrationNo",
                            label: "Company Registration No",
                          },
                          { name: "clientTaxID", label: "Tax ID" },
                          {
                            name: "clientCompanyVatNo",
                            label: "Company VAT No",
                          },
                          {
                            name: "clientContactPerson",
                            label: "ContactPerson",
                          },
                          { name: "clientPhone", label: "Phone" },
                          {
                            type: "email",
                            name: "clientEmail",
                            label: "Client Email",
                          },
                          {
                            type: "textarea",
                            name: "clientAddress",
                            label: "Client Address",
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

              {/* Company Information */}
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h6 className="mb-0">Company Information</h6>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label
                        htmlFor="companyRegistrationNo"
                        className="form-label"
                      >
                        Company Registration No
                      </label>
                      <Field
                        readOnly
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
                        readOnly
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
                        readOnly
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
                        readOnly
                        type="text"
                        name="phone"
                        className={`form-control ${
                          touched.phone && errors.phone ? "is-invalid" : ""
                        }`}
                        placeholder="Enter Phone Number"
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <Field
                        readOnly
                        type="email"
                        name="email"
                        className={`form-control ${
                          touched.email && errors.email ? "is-invalid" : ""
                        }`}
                        placeholder="Enter Email Address"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger small mt-1"
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
                            <i className="fas fa-save me-1"></i> Save Client
                            Information
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

export default ClientInfo;
