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
export const getCargoTypesFull = async () => {
  const res = await api.get(`/cargo-types`);
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get(`/users`);
  return res.data;
};
export const getContainerSizes = async () => {
  const res = await api.get(`/container-sizes`);
  return res.data;
};

export const createCarrier = async (data) => {
  const res = await api.post("/carriers/", data);
  return res.data;
};

export const getCarriers = async (searchTerm) => {
  const res = await api.get(`/carriers?search=${searchTerm}`);
  return res.data;
};
export const createShipper = async (data) => {
  const res = await api.post("/shippers/", data);
  return res.data;
};

export const getShippers = async (searchTerm) => {
  const res = await api.get(`/shippers?search=${searchTerm}`);
  return res.data;
};
export const createVessel = async (data) => {
  const res = await api.post("/vessels/", data);
  return res.data;
};

export const getVessels = async (searchTerm) => {
  const res = await api.get(`/vessels?search=${searchTerm}`);
  return res.data;
};
export const createHsCode = async (data) => {
  const res = await api.post("/hs-codes/", data);
  return res.data;
};

export const getHsCodes = async (searchTerm) => {
  const res = await api.get(`/hs-codes?search=${searchTerm}`);
  return res.data;
};
export const createCargoDescription = async (data) => {
  const res = await api.post("/cargo-descriptions/", data);
  return res.data;
};

export const getCargoDescription = async (searchTerm) => {
  const res = await api.get(`/cargo-descriptions?search=${searchTerm}`);
  return res.data;
};
export const getRequestTypes = async () => {
  const res = await api.get(`/request-types`);
  return res.data;
};