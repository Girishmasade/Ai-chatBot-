import { env } from "@/src/config/envImport";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

const BACKEND_URL = env.API_URL;

export const apiSlice = createApi({
  reducerPath: "backendApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    credentials: "include", // send cookies (refresh token)
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.auth?.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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