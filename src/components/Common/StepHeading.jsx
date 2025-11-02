import React from 'react'

const StepHeading = ({ title, description }) => {
  return (
    <div className="step-heading mb-4">
      <h5 className="mb-3">{title}</h5>
      <p className="text-muted">
        <i className="cfont-color fas fa-info-circle"></i> {description}
      </p>
    </div>
  )
}

export default StepHeading