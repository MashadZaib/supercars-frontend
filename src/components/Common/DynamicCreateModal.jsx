import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const DynamicCreateModal = ({
  show,
  onHide,
  title,
  fields = [],
  onSubmit,
  initialValues = {},
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {};
    fields.forEach((field) => {
      data[field.name] = e.target[field.name].value;
    });
    onSubmit(data);
    onHide();
  };

  // ✅ Manage body scroll locking & backdrop cleanup
  useEffect(() => {
    if (show) {
      document.body.classList.add("modal-open");

      // Add custom backdrop manually
      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      document.body.appendChild(backdrop);

      return () => {
        document.body.classList.remove("modal-open");
        // ✅ Check if still in DOM before removing
        if (backdrop.parentNode) {
          backdrop.parentNode.removeChild(backdrop);
        }
      };
    }
  }, [show]);

  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title || "Create New Item"}</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {fields.map((field) => (
                <div key={field.name} className="mb-3">
                    <label className="form-label">{field.label}</label>
                    {field.type === "textarea" ? (
                    <textarea
                        className="form-control"
                        name={field.name}
                        placeholder={field.placeholder || ""}
                        defaultValue={initialValues[field.name] || ""}
                        required={field.required}
                        rows={field.rows || 3}
                    ></textarea>
                    ) : (
                    <input
                        type={field.type || "text"}
                        className="form-control"
                        name={field.name}
                        placeholder={field.placeholder || ""}
                        defaultValue={initialValues[field.name] || ""}
                        required={field.required}
                    />
                    )}
                </div>
                ))}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DynamicCreateModal;
