import api from "./axiosInstance";

export const createBookingParty = async (data) => {
  const res = await api.post("/booking-parties/", data);
  return res.data;
};

export const getBookingParties = async (searchTerm) => {
  const res = await api.get(`/booking-parties?search=${searchTerm}`);
  return res.data;
};
export const createPort = async (data) => {
  const res = await api.post("/ports/", data);
  return res.data;
};

export const getPorts = async (searchTerm) => {
  const res = await api.get(`/ports?search=${searchTerm}`);
  return res.data;
};
export const createCargoType = async (data) => {
  const res = await api.post("/cargo-types/", data);
  return res.data;
};

export const getCargoTypes = async (searchTerm) => {
  const res = await api.get(`/cargo-types?search=${searchTerm}`);
  return res.data;
};
export const getCargoTypesFull = async (searchTerm) => {
  const res = await api.get(`/cargo-types`);
  return res.data;
};