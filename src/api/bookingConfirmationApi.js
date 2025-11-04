import api from "./axiosInstance";

export const createBookingConfirmation = (data) => api.post("/booking-confirmations/", data);
export const getBookingConfirmations = () => api.get("/booking-confirmations/");
export const getBookingConfirmation = (id) => api.get(`/booking-confirmations/${id}`);
export const updateBookingConfirmation = (id, data) => api.put(`/booking-confirmations/${id}`, data);
export const deleteBookingConfirmation = (id) => api.delete(`/booking-confirmations/${id}`);
