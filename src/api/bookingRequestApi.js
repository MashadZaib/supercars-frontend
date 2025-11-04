import api from "./axiosInstance";

export const createBookingRequest = async (data) => {
  const res = await api.post("/booking-requests/", data);
  return res.data;
};

export const getBookingRequests = async () => {
  const res = await api.get("/booking-requests/");
  return res.data;
};

export const getBookingRequest = async (id) => {
  const res = await api.get(`/booking-requests/${id}`);
  return res.data;
};

export const updateBookingRequest = async (id, data) => {
  const res = await api.put(`/booking-requests/${id}`, data);
  return res.data;
};

export const deleteBookingRequest = async (id) => {
  const res = await api.delete(`/booking-requests/${id}`);
  return res.data;
};
