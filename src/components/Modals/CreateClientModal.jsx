import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

const CreateClientModal = ({ show, onHide }) => {
  useEffect(() => {
    if (show) {
      document.body.classList.add('modal-open')
      const backdrop = document.createElement('div')
      backdrop.className = 'modal-backdrop fade show'
      document.body.appendChild(backdrop)
    } else {
      document.body.classList.remove('modal-open')
      const backdrops = document.querySelectorAll('.modal-backdrop')
      backdrops.forEach(b => b.remove())
    }
    return () => {
      document.body.classList.remove('modal-open')
      const backdrops = document.querySelectorAll('.modal-backdrop')
      backdrops.forEach(b => b.remove())
    }
  }, [show])

  if (!show) return null
  return ReactDOM.createPortal(
    <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Client</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="modalCompanyName" className="form-label">Company Name</label>
                <input type="text" className="form-control" id="modalCompanyName" placeholder="Enter company name" />
              </div>
              <div className="mb-3">
                <label htmlFor="modalTaxId" className="form-label">Tax ID</label>
                <input type="text" className="form-control" id="modalTaxId" placeholder="Enter tax ID" />
              </div>
              <div className="mb-3">
                <label htmlFor="modalBillingAddress" className="form-label">Billing Address</label>
                <input type="text" className="form-control" id="modalBillingAddress" placeholder="Enter complete address" />
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="modalContactPerson" className="form-label">Contact Person</label>
                  <input type="text" className="form-control" id="modalContactPerson" placeholder="Enter contact name" />
                </div>
                <div className="col-md-6">
                  <label htmlFor="modalPhone" className="form-label">Phone</label>
                  <input type="text" className="form-control" id="modalPhone" placeholder="Enter phone number" />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="modalEmail" className="form-label">Email</label>
                <input type="email" className="form-control" id="modalEmail" placeholder="Enter email address" />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>Cancel</button>
            <button type="button" className="btn btn-primary">Create Client</button>
          </div>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show"></div>}
    </div>,
     document.body // ✅ render at root level
  )
}

export default CreateClientModal