import api from "./axiosInstance";

export const createInvoicePreview = (data) => api.post("/invoice-previews/", data);
export const getInvoicePreviews = () => api.get("/invoice-previews/");
export const getInvoicePreview = (id) => api.get(`/invoice-previews/${id}`);
export const updateInvoicePreview = (id, data) => api.put(`/invoice-previews/${id}`, data);
export const deleteInvoicePreview = (id) => api.delete(`/invoice-previews/${id}`);
