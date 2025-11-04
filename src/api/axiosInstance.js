import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Intercept responses for global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.data?.detail) {
      toast.error(err.response.data.detail);
    } else {
      toast.error("Something went wrong with the server.");
    }
    return Promise.reject(err);
  }
);

export default api;
