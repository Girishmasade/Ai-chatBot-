import { configureStore, isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import { apiSlice as mockApiSlice } from "./api/apiSlice";
import { apiSlice as backendApiSlice } from "./backendApi/apiBackendConnectivity";
import toast from "react-hot-toast";

/**
 * Helper to extract the single, specific reason why an operation or validation failed.
 * Bypasses generic headlines like "Validation Failed" or "Bad Request" and extracts exact error details.
 */
export function extractDetailedErrorMessage(payload: any, status?: number | string, actionError?: any): string {
  if (!payload) {
    if (status === "FETCH_ERROR") return "Unable to connect to server. Please check if backend is running.";
    if (status === "PARSING_ERROR") return "Received invalid response format from server.";
    if (status === 401) return "Session expired. Please log in again.";
    if (status === 403) return "Access denied. You do not have permission to perform this action.";
    if (status === 404) return "The requested resource was not found.";
    if (status === 429) return "Too many requests. Please wait a moment before retrying.";
    if (typeof status === "number" && status >= 500) return "Server internal error. Please try again later.";
    return actionError?.message || "An unexpected error occurred.";
  }

  const data = payload?.data || payload;

  const formatErrorArray = (arr: any[]): string | null => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const first = arr[0];
    if (typeof first === "string" && first.trim()) return first.trim();
    if (first && typeof first === "object") {
      return first.msg || first.message || first.error || first.detail || null;
    }
    return null;
  };

  // 1. Check array error structures (express-validator or custom error arrays)
  const arrayReason =
    formatErrorArray(data?.errors) ||
    formatErrorArray(data?.error) ||
    formatErrorArray(data?.details);

  if (arrayReason) return arrayReason;

  // 2. Check string in error field
  if (typeof data?.error === "string" && data.error.trim()) {
    return data.error.trim();
  }

  // 3. Check string in message field (ignoring generic "Validation Failed")
  if (typeof data?.message === "string" && data.message.trim()) {
    const msg = data.message.trim();
    const isGeneric = /^(validation\s*failed|validation\s*error|bad\s*request|error\s*occurred|something\s*went\s*wrong)$/i.test(msg);
    if (!isGeneric) {
      return msg;
    }
  }

  // 4. Check details object if string
  if (data?.details && typeof data.details === "string" && data.details.trim()) {
    return data.details.trim();
  }

  if (status === "FETCH_ERROR") return "Unable to connect to server. Please check if backend is running.";
  if (status === 401) return "Session expired or unauthorized. Please log in.";
  if (status === 403) return "Access denied. You do not have permission.";
  if (status === 404) return "Requested endpoint or resource not found.";
  if (status === 429) return "Too many requests. Please wait a moment.";
  if (typeof status === "number" && status >= 500) return "Server error occurred. Please try again later.";

  return data?.message || actionError?.message || "An error occurred while processing your request.";
}

/**
 * Global RTK Query error middleware.
 * Automatically displays a single, detailed error toast notification when any API call fails.
 */
export const rtkQueryErrorLogger: Middleware = () => (next) => (action: any) => {
  if (isRejectedWithValue(action)) {
    const status = action.payload?.status;
    const endpointName = action.meta?.arg?.endpointName;

    // Do not show error toast on landing page or for background branding/config query
    if (
      window.location.pathname === "/" ||
      window.location.pathname === "" ||
      endpointName === "getConfig"
    ) {
      return next(action);
    }

    const message = extractDetailedErrorMessage(action.payload, status, action.error);

    // Single notification toast ID guarantees only 1 error toast is visible at any time!
    toast.error(message, { id: "single-app-error-toast" });
  }

  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [mockApiSlice.reducerPath]: mockApiSlice.reducer,
    [backendApiSlice.reducerPath]: backendApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(mockApiSlice.middleware)
      .concat(backendApiSlice.middleware)
      .concat(rtkQueryErrorLogger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
