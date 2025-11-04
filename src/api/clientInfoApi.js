import api from "./axiosInstance";

export const createClientInfo = (data) => api.post("/client-info/", data);
export const getClients = () => api.get("/client-info/");
export const getClient = (id) => api.get(`/client-info/${id}`);
export const updateClient = (id, data) => api.put(`/client-info/${id}`, data);
export const deleteClient = (id) => api.delete(`/client-info/${id}`);
