import axios from "axios";

// Base URL for the JSON Server backend.
// Run `npm run server` to start json-server on this port.
export const BASE_URL = "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Central response/error interceptor so every service gets consistent errors.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
