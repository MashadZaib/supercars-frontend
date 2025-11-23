import api from "./axiosInstance";

// Create link (Booking Request ↔ Client Info)
export const createLink = async (data) => {
  const res = await api.post("/booking-request-client-info/", data);
  return res.data;
};

// Get link by id
export const getLink = async (id) => {
  const res = await api.get(`/booking-request-client-info/${id}`);
  return res.data;
};

// Get link by booking_request_id + client_info_id
export const getLinkByIds = async (booking_request_id, client_info_id) => {
  const res = await api.get(
    `/booking-request-client-info/by-ids/${booking_request_id}/${client_info_id}`
  );
  return res.data;
};

// Delete link
export const deleteLink = async (id) => {
  const res = await api.delete(`/booking-request-client-info/${id}`);
  return res.data;
};
