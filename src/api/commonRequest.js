import api from "./axiosInstance";

export const createBookingParty = async (data) => {
  const res = await api.post("/booking-parties/", data);
  return res.data;
};

export const getBookingParties = async (searchTerm) => {
  const res = await api.get(`/booking-parties?search=${searchTerm}`);
  return res.data;
};