import { env } from "@/src/config/envImport";
import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { updateAccessToken, logout } from "../slice/authSlice";
import type { RootState } from "../store";

const BACKEND_URL = env.API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: BACKEND_URL + "/api/v1",
  credentials: "include", // send cookies (refresh token)
  prepareHeaders: (headers, { getState }) => {
    let token = (getState() as RootState)?.auth?.accessToken;
    let refreshToken = (getState() as RootState)?.auth?.refreshToken;
    if (!token) {
      try {
        const raw = localStorage.getItem("gochat_auth");
        if (raw) {
          const parsed = JSON.parse(raw);
          token = parsed.accessToken;
          refreshToken = parsed.refreshToken;
        }
      } catch (e) {}
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (refreshToken) {
      headers.set("x-refresh-token", refreshToken);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Read any new access token the backend sent back via header
  if (result.meta?.response) {
    const newAccessToken = result.meta.response.headers.get("x-access-token");
    if (newAccessToken) {
      api.dispatch(updateAccessToken(newAccessToken));
    }
  }

  // On 401, re-authenticate using refresh token and retry
  if (result.error && result.error.status === 401) {
    // 1. Call /auth/refresh-token explicitly
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    const refreshedToken =
      refreshResult.meta?.response?.headers.get("x-access-token") ||
      (refreshResult.data as any)?.data?.accessToken ||
      (refreshResult.data as any)?.accessToken;

    if (refreshedToken) {
      api.dispatch(updateAccessToken(refreshedToken));
      // Retry original request with the fresh token
      return await baseQuery(args, api, extraOptions);
    }

    // 2. Fallback retry
    const retryResult = await baseQuery(args, api, extraOptions);

    if (retryResult.meta?.response) {
      const headerToken = retryResult.meta.response.headers.get("x-access-token");
      if (headerToken) {
        api.dispatch(updateAccessToken(headerToken));
      }
    }

    if (retryResult.error && retryResult.error.status === 401) {
      api.dispatch(logout());
    }

    return retryResult;
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "backendApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "Otp",
    "Subscription",
    "UserSubscription",
    "TokenWallet",
    "TokenTransaction",
    "TokenPackage",
    "Admin",
  ] as const,
  endpoints: () => ({}),
});