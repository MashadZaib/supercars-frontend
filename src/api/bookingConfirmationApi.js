import api from "./axiosInstance";

export const createBookingConfirmation = async (data) => {
  const res = await api.post("/booking-confirmations/", data);
  return res.data;
};

export const getBookingConfirmationsByBooking = async (booking_request_id) => {
  const res = await api.get(`/booking-confirmations/by-booking/${booking_request_id}`);
  return res.data;
};

export const getBookingConfirmation = async (id) => {
  const res = await api.get(`/booking-confirmations/${id}`);
  return res.data;
};

export const updateBookingConfirmation = async (id, data) => {
  const res = await api.put(`/booking-confirmations/${id}`, data);
  return res.data;
};

export const deleteBookingConfirmation = async (id) => {
  const res = await api.delete(`/booking-confirmations/${id}`);
  return res.data;
};
