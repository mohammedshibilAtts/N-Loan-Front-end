import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || process.env.VITE_API_URL;
// const API_URL = import.meta.env.VITE_API_URL || process.env.VITE_API_URL || "http://localhost:8000/api/";

export const API = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response, // pass through successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Example actions:
      localStorage.removeItem("accessToken");
      window.location.href = "/sign-in"; 
    }

    return Promise.reject(error.response?.data || error);
  }
);

export const apiService = {
  get: async (url: string, params = {}) => {
    const response = await API.get(url, { params });
    return response.data;
  },
  post: async (url: string, data = {}) => {
    const response = await API.post(url, data);
    return response.data;
  },
  postFile: async (url: string, data = {}) => {
    const response = await API.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  put: async (url: string, data = {}) => {
    const response = await API.put(url, data);
    return response.data;
  },
  putFile: async (url: string, data = {}) => {
    const response = await API.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  patch: async (url: string, data = {}) => {
    const response = await API.patch(url, data);
    return response.data;
  },
  delete: async (url: string) => {
    const response = await API.delete(url);
    return response.data;
  },
};
