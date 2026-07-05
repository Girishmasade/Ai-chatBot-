import axios from 'axios';
import { VITE_BACKEND_URI } from '@/env/EnvImport';
import { tokenStorage } from './tokenStorage';

const axiosInstance = axios.create({
  baseURL: `${VITE_BACKEND_URI}/api/v1`,
  withCredentials: true, // send httpOnly refresh token cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach access token ──────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: capture new access token from headers ───────────────
axiosInstance.interceptors.response.use(
  (response) => {
    // Backend sends refreshed access token via x-access-token header
    const newToken = response.headers['x-access-token'];
    if (newToken) {
      tokenStorage.setToken(newToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // The httpOnly cookie will be sent automatically — try once more
      try {
        const retryResponse = await axiosInstance(originalRequest);
        return retryResponse;
      } catch {
        // Silent refresh failed — clear token and redirect to login
        tokenStorage.clearToken();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
