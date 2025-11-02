import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import StepHeading from "../Common/StepHeading";

const PreviewInvoice = ({ formData }) => {
  const initialValues = {
    billTo: [
      { label: "Company Name", value: "" },
      { label: "Tel", value: "" },
      { label: "Email", value: "" },
    ],
    invoiceInfo: [
      { label: "Reference No", value: "" },
      { label: "Invoice Date", value: "" },
      { label: "Due Date", value: "" },
      { label: "B/L Number", value: "" },
      { label: "Booking Number", value: "" },
    ],
    shippingDetails: [
      {
        vessel: "",
        voyage: "",
        etd: "",
        eta: "",
        portLoad: "",
        portDischarge: "",
      },
    ],
    itemizedCharges: [
      {
        chargeName: "",
        amount: 0,
        qty: 1,
        type: "Taxable",
      },
    ],
    containerDetails: [
      { containerNo: "", sealNo: "", loadingDate: "", vehicleCount: 1 },
    ],
  };

  const calculateTotals = (charges) => {
    const subtotal = charges.reduce(
      (sum, c) => sum + Number(c.amount || 0) * Number(c.qty || 0),
      0
    );
    const dutyFree = charges
      .filter((c) => c.type === "Non-Taxable")
      .reduce((sum, c) => sum + c.amount * c.qty, 0);
    const taxable = subtotal - dutyFree;
    const tax = taxable * 0.12;
    const billing = subtotal + tax;
    const costPerUnit = charges.length > 0 ? billing / charges.length : 0;
    return { subtotal, dutyFree, taxable, tax, billing, costPerUnit };
  };

  return (
    <>
      <StepHeading
        title="Preview Invoice"
        description="Preview, edit, and manage all invoice sections"
      />

      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values) => console.log("Invoice Saved:", values)}
      >
        {({ values }) => {
          const totals = calculateTotals(values.itemizedCharges);

          return (
            <Form>
              <div className="d-flex justify-content-end mb-3">
                <button type="button" className="btn btn-primary me-2">
                  <i className="fas fa-print"></i> Print
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-download"></i> Download PDF
                </button>
              </div>

              <div className="invoice-box">
                <div className="invoice-header d-flex justify-content-between align-items-center">
                  <h1>INVOICE</h1>
                  <i className="fas fa-file-invoice invoice-icon"></i>
                </div>

                {/* === BILL TO SECTION === */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="invoice-info">
                      <h6>Bill To</h6>
                      <FieldArray name="billTo">
                        {({ push, remove }) => (
                          <>
                            {values.billTo.map((b, index) => (
                              <div key={index} className="d-flex mb-1">
                                <Field
                                  name={`billTo.${index}.label`}
                                  className="form-control me-2"
                                  placeholder="Label"
                                />
                                <Field
                                  name={`billTo.${index}.value`}
                                  className="form-control"
                                  placeholder="Value"
                                />
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm ms-2"
                                  onClick={() => remove(index)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => push({ label: "", value: "" })}
                            >
                              + Add Field
                            </button>
                          </>
                        )}
                      </FieldArray>
                    </div>
                  </div>

                  {/* === INVOICE INFO SECTION === */}
                  <div className="col-md-6 text-end">
                    <div className="invoice-info">
                      <h6>Invoice Info</h6>
                      <FieldArray name="invoiceInfo">
                        {({ push, remove }) => (
                          <>
                            {values.invoiceInfo.map((i, index) => (
                              <div key={index} className="d-flex mb-1 justify-content-end">
                                <Field
                                  name={`invoiceInfo.${index}.label`}
                                  className="form-control me-2"
                                  placeholder="Label"
                                />
                                <Field
                                  name={`invoiceInfo.${index}.value`}
                                  className="form-control"
                                  placeholder="Value"
                                />
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm ms-2"
                                  onClick={() => remove(index)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => push({ label: "", value: "" })}
                            >
                              + Add Field
                            </button>
                          </>
                        )}
                      </FieldArray>
                    </div>
                  </div>
                </div>

                {/* === SHIPPING DETAILS === */}
                <h6 className="invoice-section-title mt-4">Shipping Details</h6>
                <FieldArray name="shippingDetails">
                  {({ push, remove }) => (
                    <>
                      <table className="table invoice-table shipping-table">
                        <thead>
                          <tr>
                            <th>Vessel</th>
                            <th>Voyage</th>
                            <th>ETD</th>
                            <th>ETA</th>
                            <th>Port of Loading</th>
                            <th>Port of Discharge</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {values.shippingDetails.map((s, index) => (
                            <tr key={index}>
                              <td>
                                <Field
                                  name={`shippingDetails.${index}.vessel`}
                                  className="form-control"
                                />
                              </td>
                              <td>
                                <Field
                                  name={`shippingDetails.${index}.voyage`}
                                  className="form-control"
                                />
                              </td>
                              <td>
                                <Field
                                  name={`shippingDetails.${index}.etd`}
                                  className="form-control"
                                />
                              </td>
                              <td>
                                <Field
                                  name={`shippingDetails.${index}.eta`}
                                  className="form-control"
                                />
                              </td>
                              <td>
                                <Field
                                  name={`shippingDetails.${index}.portLoad`}
                                  className="form-control"
                                />
                              </td>
                              <td>
                                <Field
                                  name={`shippingDetails.${index}.portDischarge`}
                                  className="form-control"
                                />
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => remove(index)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          push({
                            vessel: "",
                            voyage: "",
                            etd: "",
                            eta: "",
                            portLoad: "",
                            portDischarge: "",
                          })
                        }
                      >
                        + Add Row
                      </button>
                    </>
                  )}
                </FieldArray>

                {/* === ITEMIZED CHARGES === */}
                <h6 className="invoice-section-title mt-4">Itemized Charges</h6>
                <FieldArray name="itemizedCharges">
                  {({ push, remove }) => (
                    <>
                      <table className="table invoice-table itemized-charges-table">
                        <thead>
                          <tr>
                            <th>S.NO.</th>
                            <th>CHARGES NAME</th>
                            <th>AMOUNT</th>
                            <th>QTY</th>
                            <th>TOTAL</th>
                            <th>TYPE</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {values.itemizedCharges.map((c, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <Field
                                  name={`itemizedCharges.${index}.chargeName`}
                                  className="form-control"
                                />
                              </td>
                              <td>
                                <Field
                                  type="number"
                                  name={`itemizedCharges.${index}.amount`}
                                  className="form-control"
                                />
                              </td>
                              <td>
                                <Field
                                  type="number"
                                  name={`itemizedCharges.${index}.qty`}
                                  className="form-control"
                                />
                              </td>
                              <td className="text-end">
                                ¥{(c.amount * c.qty).toFixed(2)}
                              </td>
                              <td>
                                <Field
                                  as="select"
                                  name={`itemizedCharges.${index}.type`}
                                  className="form-select"
                                >
                                  <option value="Taxable">Taxable</option>
                                  <option value="Non-Taxable">Non-Taxable</option>
                                </Field>
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => remove(index)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr><td colSpan="4">SUBTOTAL:</td><td>¥{totals.subtotal.toFixed(2)}</td></tr>
                          <tr><td colSpan="4">TOTAL DUTY FREE AMOUNT:</td><td>¥{totals.dutyFree.toFixed(2)}</td></tr>
                          <tr><td colSpan="4">TOTAL TAXABLE AMOUNT:</td><td>¥{totals.taxable.toFixed(2)}</td></tr>
                          <tr><td colSpan="4">CONSUMPTION TAX (12%):</td><td>¥{totals.tax.toFixed(2)}</td></tr>
                          <tr><td colSpan="4">BILLING AMOUNT:</td><td>¥{totals.billing.toFixed(2)}</td></tr>
                          <tr><td colSpan="4">COST PER UNIT:</td><td>¥{totals.costPerUnit.toFixed(2)}</td></tr>
                        </tfoot>
                      </table>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          push({ chargeName: "", amount: 0, qty: 1, type: "Taxable" })
                        }
                      >
                        + Add Charge
                      </button>
                    </>
                  )}
                </FieldArray>

                {/* === CONTAINER DETAILS === */}
                <h6 className="invoice-section-title mt-4">Container Details</h6>
                <FieldArray name="containerDetails">
                  {({ push, remove }) => (
                    <>
                      <table className="table invoice-table container-details-table">
                        <thead>
                          <tr>
                            <th>CONTAINER NO.</th>
                            <th>SEAL NO.</th>
                            <th>LOADING DATE</th>
                            <th>VEHICLE COUNT</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {values.containerDetails.map((d, index) => (
                            <tr key={index}>
                              <td>
                                <Field
                                  name={`containerDetails.${index}.containerNo`}
                                  className="form-control"
                                />
                              </td>
                              <td>
                                <Field
                                  name={`containerDetails.${index}.sealNo`}
                                  className="form-control"
                                />
                              </td>
                              <td>
                                <Field
                                  name={`containerDetails.${index}.loadingDate`}
                                  type="date"
                                  className="form-control"
                                />
                              </td>
                              <td>
                                <Field
                                  type="number"
                                  name={`containerDetails.${index}.vehicleCount`}
                                  className="form-control"
                                />
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => remove(index)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          push({
                            containerNo: "",
                            sealNo: "",
                            loadingDate: "",
                            vehicleCount: 1,
                          })
                        }
                      >
                        + Add Container
                      </button>
                    </>
                  )}
                </FieldArray>
              </div>

              <div className="text-end mt-4">
                <button type="submit" className="btn btn-success">
                  <i className="fas fa-save me-1"></i> Save Invoice
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default PreviewInvoice;
