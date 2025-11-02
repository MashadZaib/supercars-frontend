import React, { useState } from 'react'
import Wrapper from './components/Layout/Wrapper'
import Navbar from './components/Layout/Navbar'
import BookingRequest from './components/Tabs/BookingRequest'
import BookingConfirmation from './components/Tabs/BookingConfirmation'
import ClientInfo from './components/Tabs/ClientInfo'
import ShippingInstructions from './components/Tabs/ShippingInstructions'
import Charges from './components/Tabs/Charges'
import PreviewInvoice from './components/Tabs/PreviewInvoice'
import DynamicCreateModal from './components/Common/DynamicCreateModal'

import PaginationButtons from './components/Common/PaginationButtons'

function App() {
  const [activeTab, setActiveTab] = useState('booking-request')
  const [showClientModal, setShowClientModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalConfig, setModalConfig] = useState({ title: '', fields: [] })

  const [formData, setFormData] = useState({
    bookingRequest: null,
    bookingConfirmation: null,
    clientInfo: null,
    shippingInstructions: null,
    charges: null
  })
  const [completedTabs, setCompletedTabs] = useState({
    'booking-request': false,
    'booking-confirmation': false,
    'client-info': false,
    'shipping-instructions': false,
    'charges': false
  })

  const tabs = [
    { id: 'booking-request', label: 'Booking Request', component: BookingRequest },
    { id: 'booking-confirmation', label: 'Booking Confirmation', component: BookingConfirmation },
    { id: 'client-info', label: 'Client Information', component: ClientInfo },
    { id: 'shipping-instructions', label: 'Shipping Instructions', component: ShippingInstructions },
    { id: 'charges', label: 'Charges', component: Charges },
    { id: 'preview-invoice', label: 'Preview Invoice', component: PreviewInvoice }
  ]

  const handleTabClick = (tabId) => {
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab)
  const targetTabIndex = tabs.findIndex(tab => tab.id === tabId)

  // ✅ Always allow going to previous or current tabs
  if (targetTabIndex <= currentTabIndex) {
    setActiveTab(tabId)
    return
  }

  // For forward navigation, check completion
  const allPrevCompleted = tabs
    .slice(0, targetTabIndex)
    .every(t => completedTabs[t.id])

  if (allPrevCompleted) {
    setActiveTab(tabId)
  } else {
    alert('Please complete all required fields before proceeding.')
  }
}


  const handleFormSubmit = (tabId, data, isValid) => {
  setFormData(prev => ({
    ...prev,
    [tabId]: { ...(prev[tabId] || {}), ...data },
  }))
  setCompletedTabs(prev => ({ ...prev, [tabId]: !!isValid }))
}

  const handleNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1]
      
      // Check if current tab is completed before moving to next
      if (completedTabs[activeTab]) {
        setActiveTab(nextTab.id)
      } else {
        alert('Please complete all required fields in the current tab before proceeding to the next one.')
      }
    }
  }

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
    if (currentIndex > 0) {
      const prevTab = tabs[currentIndex - 1]
      setActiveTab(prevTab.id)
    }
  }

  const isTabCompleted = (tabId) => {
    return completedTabs[tabId]
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <>
      <Wrapper>
        <Navbar />
        <div className="container-fluid mt-3">
          <ul className="nav nav-tabs" id="invoiceTab" role="tablist">
            {tabs.map((tab, index) => {
              const isCompleted = isTabCompleted(tab.id)
              const isActive = activeTab === tab.id
              const tabIndex = tabs.findIndex(t => t.id === tab.id)
              const currentIndex = tabs.findIndex(t => t.id === activeTab)
              const isClickable = tabIndex <= currentIndex || isCompleted
              
              return (
                <li key={tab.id} className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${isActive ? 'active' : ''} ${isCompleted ? 'completed-tab' : ''} ${!isClickable ? 'disabled-tab' : ''}`}
                    onClick={() => isClickable && handleTabClick(tab.id)}
                    type="button"
                    role="tab"
                    disabled={!isClickable}
                  >
                    {isCompleted && <i className="fas fa-check-circle text-success me-1"></i>}
                    {tab.label}
                    {!isCompleted && activeTab !== tab.id && <i className="fas fa-lock text-muted ms-1"></i>}
                  </button>
                </li>
              )
            })}
          </ul>

        <div className="tab-content" id="invoiceTabContent">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab-pane fade ${activeTab === tab.id ? 'show active' : ''}`}
              role="tabpanel"
            >
              {activeTab === tab.id && (
                <ActiveComponent
                  setShowModal={setShowModal}
                  setModalConfig={setModalConfig}
                  onSubmit={(data, isValid) => handleFormSubmit(tab.id, data, isValid)}
                  initialData={formData[tab.id]}
                  onFormValidityChange={(isValid) => {
                    setCompletedTabs(prev => ({
                      ...prev,
                      [tab.id]: isValid
                    }))
                  }}
                />
              )}
            </div>
          ))}
        </div>



          <PaginationButtons 
            onNext={handleNext}
            onPrevious={handlePrevious}
            currentTab={activeTab}
            totalTabs={tabs.length}
            isCurrentTabCompleted={completedTabs[activeTab]}
          />
        </div>
      </Wrapper>

    <DynamicCreateModal
      show={showModal}
      onHide={() => setShowModal(false)}
      title={modalConfig.title}
      fields={modalConfig.fields}
      onSubmit={(data) => {
        console.log(`Created new from ${modalConfig.title}:`, data)
        setShowModal(false)
      }}
    />
   
    </>
  )
}

export default App