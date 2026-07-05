import { VITE_BACKEND_URI } from "@/env/EnvImport";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BACKEND_URL = VITE_BACKEND_URI

export const backendServerConfig = createApi({
  reducerPath: "backendServerConfig",
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    prepareHeaders: (headers, {getState}: any) => {
      const token = getState() ?.auth ?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({}),
  tagTypes: ["Auth", "User", "Chat", "Model", "Settings", "Error"]
});