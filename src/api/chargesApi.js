import api from "./axiosInstance";

export const createCharge = async (data) => {
  const res = await api.post("/charges/", data);
  return res.data;
};

export const getCharges = async () => {
  const res = await api.get("/charges/");
  return res.data;
};

export const getCharge = async (id) => {
  const res = await api.get(`/charges/${id}`);
  return res.data;
};

export const updateCharge = async (id, data) => {
  const res = await api.put(`/charges/${id}`, data);
  return res.data;
};

export const deleteCharge = async (id) => {
  const res = await api.delete(`/charges/${id}`);
  return res.data;
};
