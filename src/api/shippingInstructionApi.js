import api from "./axiosInstance";

export const createShippingInstruction = (data) => api.post("/shipping-instructions/", data);
export const getShippingInstructions = () => api.get("/shipping-instructions/");
export const getShippingInstruction = (id) => api.get(`/shipping-instructions/${id}`);
export const updateShippingInstruction = (id, data) => api.put(`/shipping-instructions/${id}`, data);
export const deleteShippingInstruction = (id) => api.delete(`/shipping-instructions/${id}`);
