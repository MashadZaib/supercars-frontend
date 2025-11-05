import React, { useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const DynamicCreateModal = ({
  show,
  onHide,
  title,
  fields = [],
  onSubmit,
  initialValues = {},
}) => {
  // ✅ Dynamic Yup validation schema
  const validationSchema = useMemo(() => {
    const shape = {};
    fields.forEach((field) => {
      if (field.required) {
        // basic required rule
        let rule = Yup.string()
          .trim()
          .required(`${field.label || field.name} is required`);

        // detect common field types for smarter validation
        if (field.type === "email") {
          rule = Yup.string()
            .email("Invalid email format")
            .required(`${field.label || field.name} is required`);
        } else if (field.type === "number") {
          rule = Yup.number()
            .typeError(`${field.label || field.name} must be a number`)
            .required(`${field.label || field.name} is required`);
        }

        shape[field.name] = rule;
      }
    });
    return Yup.object().shape(shape);
  }, [fields]);

  // ✅ Manage body scroll + backdrop manually
  useEffect(() => {
    if (show) {
      document.body.classList.add("modal-open");
      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      document.body.appendChild(backdrop);

      return () => {
        document.body.classList.remove("modal-open");
        if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      };
    }
  }, [show]);

  if (!show) return null;

  // ✅ Default initial values
  const formInitialValues = fields.reduce((acc, f) => {
    acc[f.name] = initialValues[f.name] || "";
    return acc;
  }, {});

  return ReactDOM.createPortal(
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title || "Create New Item"}</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>

          {/* ✅ Formik integration */}
          <Formik
            initialValues={formInitialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              onSubmit(values);
              resetForm();
              onHide();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="modal-body">
                  {fields.map((field) => (
                    <div key={field.name} className="mb-3">
                      <label className="form-label">{field.label}</label>

                      {field.type === "textarea" ? (
                        <Field
                          as="textarea"
                          name={field.name}
                          className="form-control"
                          placeholder={field.placeholder || ""}
                          rows={field.rows || 3}
                        />
                      ) : (
                        <Field
                          type={field.type || "text"}
                          name={field.name}
                          className="form-control"
                          placeholder={field.placeholder || ""}
                        />
                      )}

                      <ErrorMessage
                        name={field.name}
                        component="div"
                        className="text-danger small mt-1"
                      />
                    </div>
                  ))}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={onHide}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-1"></i> Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus me-1"></i> Create
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DynamicCreateModal;
