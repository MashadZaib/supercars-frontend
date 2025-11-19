import api from "./axiosInstance";

export const createClient = async (data) => {
  const res = await api.post("/client-info/", data);
  return res.data;
};

export const getClients = async () => {
  const res = await api.get("/client-info/");
  return res.data;
};

export const getClient = async (id) => {
  const res = await api.get(`/client-info/${id}`);
  return res.data;
};

export const updateClient = async (id, data) => {
  const res = await api.put(`/client-info/${id}`, data);
  return res.data;
};

export const deleteClient = async (id) => {
  const res = await api.delete(`/client-info/${id}`);
  return res.data;
};
