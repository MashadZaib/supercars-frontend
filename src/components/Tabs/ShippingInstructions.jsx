import React, { useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import StepHeading from "../Common/StepHeading";
import { shippingInstructionsSchema } from "../../schemas/validationSchemas";
import { toast } from "react-toastify";
import {
  createShippingInstruction,
  updateShippingInstruction,
} from "../../api/shippingInstructionApi";
import { useBooking } from "../../context/BookingContext";
const ShippingInstructions = ({
  setShowClientModal,
  onSubmit,
  initialData,
  onFormValidityChange,
  modalResult = null,
}) => {
  const { bookingRequestData, bookingConfirmationData, bookingId } =
    useBooking();

  const initialValues = {
    typeOfBillOfLading: "",
    shipper: {
      name: "",
      address: "",
      phone: "",
      contactPerson: "",
      email: "",
    },
    consignee: {
      name: "",
      address: "",
      phone: "",
      contactPerson: "",
      email: "",
    },
    notify: {
      name: "",
      address: "",
      phone: "",
      contactPerson: "",
      email: "",
    },
    vessel: "",
    voyage: "",
    bookingReference: "",
    billOfLadingNo: "",
    portOfLoad: "",
    portOfDischarge: "",
    etdDeparture: "",
    etaArrival: "",
    vehicles: [
      {
        make: "",
        year: "",
        color: "",
        chassisNo: "",
        length: "",
        width: "",
        height: "",
        m3: "",
        cc: "",
      },
    ],
    marksNumbers: [
      {
        containerNo: "",
        sealNo: "",
        size: "",
        type: "",
        noOfPackages: "",
        pkgType: "",
        cargoWeight: "",
      },
    ],
    specialInstructions: "",
    dangerousGoods: false,
    temperatureControl: "",
    humidityControl: "",
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

    try {
      const formatted = {
        booking_request_id: bookingId,

        type_of_bill_of_lading: values.typeOfBillOfLading,

        shipper_id: bookingConfirmationData?.shipper?.id,


        consignee: {
          name: values.consignee.name,
          address: values.consignee.address,
          phone: values.consignee.phone,
          contact_person: values.consignee.contactPerson,
          email: values.consignee.email,
        },

        notify: {
          name: values.notify.name,
          address: values.notify.address,
          phone: values.notify.phone,
          contact_person: values.notify.contactPerson,
          email: values.notify.email,
        },

        vessel: values.vessel,
        voyage: values.voyage,

        booking_reference: values.bookingReference,
        bill_of_lading_no: values.billOfLadingNo,

        port_of_load: values.portOfLoad,
        port_of_discharge: values.portOfDischarge,

        etd_departure: values.etdDeparture?.split("T")[0] || null,
        eta_arrival: values.etaArrival?.split("T")[0] || null,

        vehicles: values?.vehicles?.map((v) => ({
          make: v.make,
          year: v.year,
          color: v.color,
          chassis_no: v.chassisNo,
          length: v.length,
          width: v.width,
          height: v.height,
          m3: v.m3,
          cc: v.cc,
        })),

        marks_numbers: values?.marksNumbers?.map((m) => ({
          container_no: m.containerNo,
          seal_no: m.sealNo,
          size: m.size,
          type: m.type,
          no_of_packages: m.noOfPackages,
          pkg_type: m.pkgType,
          cargo_weight: m.cargoWeight,
        })),

        special_instructions: values.specialInstructions,
        dangerous_goods: values.dangerousGoods,
        temperature_control: values.temperatureControl,
        humidity_control: values.humidityControl,
      };
      console.log("Formatted Payload:", formatted); // Debug formatted payload

      let response;
      if (values.id) {
        // ✅ Update
        response = await updateShippingInstruction(values.id, formatted);
        toast.success("Shipping Instruction updated successfully!");
      } else {
        // ✅ Create new
        response = await createShippingInstruction(formatted);
        toast.success("Shipping Instruction saved successfully!");
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

  const containerSizes = [
    "20GP",
    "40GP",
    "40HQ",
    "45HQ",
    "20RF",
    "40RF",
    "Other",
  ];

  const packageTypes = [
    "Pallets",
    "Cartons",
    "Crates",
    "Drums",
    "Bags",
    "Units",
    "Bundles",
    "Other",
  ];

  const vehicleMakes = [
    "Toyota",
    "Honda",
    "Ford",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Volkswagen",
    "Nissan",
    "Hyundai",
    "Kia",
    "Other",
  ];

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
          useEffect(() => {
            if (!bookingConfirmationData) return;

            // ⛴ Vessel & Voyage
            setFieldValue("vessel", bookingConfirmationData.vessel || "");
            setFieldValue("voyage", bookingConfirmationData.voyage || "");

            // 📦 Ports
            setFieldValue(
              "portOfLoad",
              bookingConfirmationData.portOfLoad || ""
            );
            setFieldValue(
              "portOfDischarge",
              bookingConfirmationData.portOfDischarge || ""
            );

            // 👤 Shipper Autofill (from users table)
            if (!bookingConfirmationData?.shipper) return;

            const s = bookingConfirmationData.shipper;

            setFieldValue("shipper.name", s.username || "");
            setFieldValue("shipper.address", s.address || "");
            setFieldValue("shipper.phone", s.phone || "");
            setFieldValue("shipper.contactPerson", s.contact_person || "");
            setFieldValue("shipper.email", s.email || "");
            setFieldValue("shipperId", s.id)

          }, [bookingConfirmationData]);
          useEffect(() => {
            if (!bookingRequestData) return;

            const qty = parseInt(bookingRequestData.quantity || 1);

            // Auto generate qty rows for marksNumbers[]
            const rows = Array.from({ length: qty }).map(() => ({
              containerNo: "",
              sealNo: "",
              size: bookingRequestData.containerSize || "",
              type: "",
              noOfPackages: "",
              pkgType: "",
              cargoWeight: "",
            }));

            setFieldValue("marksNumbers", rows);
          }, [bookingRequestData]);
          return (
            <Form>
              {/* Type of Bill of Lading */}
              <div className="row mb-4">
                <div className="col-md-12">
                  <label htmlFor="typeOfBillOfLading" className="form-label">
                    Type of Bill of Lading{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <Field
                    as="select"
                    name="typeOfBillOfLading"
                    className={`form-select ${
                      touched.typeOfBillOfLading && errors.typeOfBillOfLading
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option value="">Select Type</option>
                    <option value="SEA_WAY">SEA WAY</option>
                    <option value="ORIGINAL">ORIGINAL</option>
                    <option value="TELEX">TELEX</option>
                    <option value="SURRENDER">SURRENDER</option>
                    <option value="COURIER">COURIER</option>
                    <option value="EXPRESS">EXPRESS</option>
                  </Field>
                  <ErrorMessage
                    name="typeOfBillOfLading"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>
              </div>

              {/* Shipper Information */}
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h6 className="mb-0">
                    Shipper Name & Address{" "}
                    <span className="text-danger">*</span>
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="shipper.name" className="form-label">
                        Name
                      </label>
                      <Field
                        readyOnly
                        type="text"
                        name="shipper.name"
                        className={`form-control ${
                          touched.shipper?.name && errors.shipper?.name
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter name"
                      />
                      <ErrorMessage
                        name="shipper.name"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="shipper.contactPerson"
                        className="form-label"
                      >
                        Contact Person
                      </label>
                      <Field
                        readyOnly
                        type="text"
                        name="shipper.contactPerson"
                        className="form-control"
                        placeholder="Enter contact person name"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="shipper.phone" className="form-label">
                        Phone
                      </label>
                      <Field
                        readyOnly
                        type="text"
                        name="shipper.phone"
                        className="form-control"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="shipper.email" className="form-label">
                        Email
                      </label>
                      <Field
                        readyOnly
                        type="email"
                        name="shipper.email"
                        className={`form-control ${
                          touched.shipper?.email && errors.shipper?.email
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter email address"
                      />
                      <ErrorMessage
                        name="shipper.email"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <label htmlFor="shipper.address" className="form-label">
                        Full Address
                      </label>
                      <Field
                        as="textarea"
                        name="shipper.address"
                        className="form-control"
                        rows="3"
                        placeholder="Enter complete address"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Consignee Information */}
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h6 className="mb-0">
                    Consignee Name & Address{" "}
                    <span className="text-danger">*</span>
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="consignee.name" className="form-label">
                        Name
                      </label>
                      <Field
                        type="text"
                        name="consignee.name"
                        className={`form-control ${
                          touched.consignee?.name && errors.consignee?.name
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter name"
                      />
                      <ErrorMessage
                        name="consignee.name"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="consignee.contactPerson"
                        className="form-label"
                      >
                        Contact Person
                      </label>
                      <Field
                        type="text"
                        name="consignee.contactPerson"
                        className="form-control"
                        placeholder="Enter contact person name"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="consignee.phone" className="form-label">
                        Phone
                      </label>
                      <Field
                        type="text"
                        name="consignee.phone"
                        className="form-control"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="consignee.email" className="form-label">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="consignee.email"
                        className={`form-control ${
                          touched.consignee?.email && errors.consignee?.email
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter email address"
                      />
                      <ErrorMessage
                        name="consignee.email"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <label htmlFor="consignee.address" className="form-label">
                        Full Address
                      </label>
                      <Field
                        as="textarea"
                        name="consignee.address"
                        className="form-control"
                        rows="3"
                        placeholder="Enter complete address"
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
                      <label htmlFor="notify.name" className="form-label">
                        Name
                      </label>
                      <Field
                        type="text"
                        name="notify.name"
                        className="form-control"
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="notify.contactPerson"
                        className="form-label"
                      >
                        Contact Person
                      </label>
                      <Field
                        type="text"
                        name="notify.contactPerson"
                        className="form-control"
                        placeholder="Enter contact person name"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="notify.phone" className="form-label">
                        Phone
                      </label>
                      <Field
                        type="text"
                        name="notify.phone"
                        className="form-control"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="notify.email" className="form-label">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="notify.email"
                        className={`form-control ${
                          touched.notify?.email && errors.notify?.email
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter email address"
                      />
                      <ErrorMessage
                        name="notify.email"
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <label htmlFor="notify.address" className="form-label">
                        Full Address
                      </label>
                      <Field
                        as="textarea"
                        name="notify.address"
                        className="form-control"
                        rows="3"
                        placeholder="Enter complete address"
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
                      <label htmlFor="vessel" className="form-label">
                        Vessel Name
                      </label>
                      <Field
                        type="text"
                        name="vessel"
                        className="form-control"
                        placeholder="Enter Vessel Name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="voyage" className="form-label">
                        Voyage Number
                      </label>
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
                      <label htmlFor="bookingReference" className="form-label">
                        Booking Reference
                      </label>
                      <Field
                        type="text"
                        name="bookingReference"
                        className="form-control"
                        placeholder="Enter Booking Reference"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="billOfLadingNo" className="form-label">
                        Bill of Lading No
                      </label>
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
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="etdDeparture" className="form-label">
                        ETD (Estimated Time of Departure)
                      </label>
                      <Field
                        type="datetime-local"
                        name="etdDeparture"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="etaArrival" className="form-label">
                        ETA (Estimated Time of Arrival)
                      </label>
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
                        onClick={() =>
                          push({
                            make: "",
                            year: "",
                            color: "",
                            chassisNo: "",
                            length: "",
                            width: "",
                            height: "",
                            m3: "",
                            cc: "",
                          })
                        }
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
                        {values?.vehicles?.map((vehicle, index) => (
                          <div key={index} className="border-bottom pb-3 mb-3">
                            <div className="row mb-2">
                              <div className="col-md-11">
                                <h6 className="text-primary">
                                  Vehicle {index + 1}
                                </h6>
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
                                  {vehicleMakes.map((make) => (
                                    <option key={make} value={make}>
                                      {make}
                                    </option>
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
                                <label className="form-label">
                                  Volume (m³)
                                </label>
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
                        onClick={() =>
                          push({
                            containerNo: "",
                            sealNo: "",
                            size: "",
                            type: "",
                            noOfPackages: "",
                            pkgType: "",
                            cargoWeight: "",
                          })
                        }
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
                        {values?.marksNumbers?.map((mark, index) => (
                          <div key={index} className="border-bottom pb-3 mb-3">
                            <div className="row mb-2">
                              <div className="col-md-11">
                                <h6 className="text-primary">
                                  Container {index + 1}
                                </h6>
                              </div>
                              <div className="col-md-1 text-end">
                                {values?.marksNumbers?.length > 1 && (
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
                                <label className="form-label">
                                  Container No
                                </label>
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
                                  {containerSizes.map((size) => (
                                    <option key={size} value={size}>
                                      {size}
                                    </option>
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
                                <label className="form-label">
                                  No. of Packages
                                </label>
                                <Field
                                  type="number"
                                  name={`marksNumbers.${index}.noOfPackages`}
                                  className="form-control"
                                  placeholder="Packages"
                                />
                              </div>
                              <div className="col-md-3">
                                <label className="form-label">
                                  Package Type
                                </label>
                                <Field
                                  as="select"
                                  name={`marksNumbers.${index}.pkgType`}
                                  className="form-select"
                                >
                                  <option value="">Select Type</option>
                                  {packageTypes.map((type) => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </Field>
                              </div>
                              <div className="col-md-3">
                                <label className="form-label">
                                  Cargo Weight (kg)
                                </label>
                                <Field
                                  type="number"
                                  name={`marksNumbers.${index}.cargoWeight`}
                                  className="form-control"
                                  placeholder="Weight"
                                  step="0.01"
                                />
                              </div>
                              <div className="col-md-3">
                                <label className="form-label">
                                  Gross Weight (kg)
                                </label>
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
                            <i className="fas fa-save me-1"></i> Save Shipping
                            Instructions
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

export default ShippingInstructions;
