import React from 'react'

const PaginationButtons = ({ onNext, onPrevious, currentTab, totalTabs, isCurrentTabCompleted }) => {
  const tabs = [
    'booking-request',
    'booking-confirmation', 
    'client-info',
    'shipping-instructions',
    'charges',
    'preview-invoice'
  ]
  
  const currentIndex = tabs.findIndex(tab => tab === currentTab)
  const isFirstTab = currentIndex === 0
  const isLastTab = currentIndex === totalTabs - 1

  return (
    <div className="pagination-buttons mt-4">
      <button 
        className="btn btn-light" 
        onClick={onPrevious}
        disabled={isFirstTab}
      >
        <i className="fas fa-arrow-left me-1"></i> Previous
      </button>
      
      <div className="tab-progress">
        <small className="text-muted">
          Step {currentIndex + 1} of {totalTabs}
         
        </small>
      </div>
      
      <button 
        className="btn btn-primary" 
        onClick={onNext}
        disabled={isLastTab || !isCurrentTabCompleted}
      >
        {isLastTab ? 'Finish' : 'Next'} 
        {!isLastTab && <i className="fas fa-arrow-right ms-1"></i>}
      </button>
    </div>
  )
}

export default PaginationButtons