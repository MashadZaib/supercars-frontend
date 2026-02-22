import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import RequireAuth from './auth/RequireAuth'
import Login from './pages/Login'
import BookingsList from './pages/BookingsList'
import BookingForm from './pages/BookingForm'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Navigate to="/" replace />} />
      <Route path="/" element={<RequireAuth><BookingsList /></RequireAuth>} />
      <Route path="/booking/:bookingId" element={<RequireAuth><BookingForm /></RequireAuth>} />
    </Routes>
  )
}
