import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  User,
  SystemModel,
  SubscriptionRecord,
  AuditLog,
  BrandingConfig,
  CookieConsent,
  AIAsset,
} from "../../types";
import { mockAssets, mockCookieConsents } from "./mockData";

let assets = [...mockAssets];
let consents = [...mockCookieConsents];

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1", // Proxy in vite config handles the rest
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["User", "Asset", "Model", "Subscription", "Log", "Config"],
  endpoints: (builder) => ({
    // ── Users ────────────────────────────────────────────
    getUsers: builder.query<User[], void>({
      query: () => "/admin/users",
      transformResponse: (res: any) => res.data,
      providesTags: ["User"],
    }),
    createUser: builder.mutation<{ success: boolean; user: User }, Partial<User>>({
      query: (body) => ({ url: "/admin/users", method: "POST", body }),
      invalidatesTags: ["User", "Log"],
    }),
    updateUser: builder.mutation<{ success: boolean; user?: User }, Partial<User>>({
      query: (body) => ({ url: `/admin/users/${body.id}`, method: "PUT", body }),
      invalidatesTags: ["User", "Log"],
    }),
    deleteUser: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({ url: `/admin/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["User", "Log"],
    }),

    // ── Models ───────────────────────────────────────────
    getModels: builder.query<SystemModel[], void>({
      query: () => "/admin/models",
      transformResponse: (res: any) => res.data,
      providesTags: ["Model"],
    }),
    toggleModel: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({ url: `/admin/models/${id}/toggle`, method: "PUT" }),
      invalidatesTags: ["Model", "Log"],
    }),

    // ── Subscriptions ────────────────────────────────────
    getSubscriptions: builder.query<SubscriptionRecord[], void>({
      query: () => "/admin/subscriptions",
      transformResponse: (res: any) => res.data,
      providesTags: ["Subscription"],
    }),

    // ── Audit Logs ───────────────────────────────────────
    getLogs: builder.query<AuditLog[], void>({
      query: () => "/admin/logs",
      transformResponse: (res: any) => res.data,
      providesTags: ["Log"],
    }),

    // ── Config / Branding ────────────────────────────────
    getConfig: builder.query<{ branding: BrandingConfig; cookieConsents: CookieConsent[] }, void>({
      query: () => "/admin/config",
      transformResponse: (res: any) => res.data,
      providesTags: ["Config"],
    }),
    updateBranding: builder.mutation<{ success: boolean }, Partial<BrandingConfig>>({
      query: (body) => ({ url: "/admin/config/branding", method: "PUT", body }),
      invalidatesTags: ["Config", "Log"],
    }),

    // ── Unimplemented Mock endpoints ─────────────────────
    logConsent: builder.mutation<{ success: boolean }, { user: string; categories: string[] }>({
      queryFn: ({ user, categories }) => {
        consents.push({ id: `cc-${Date.now()}`, user, consented: true, categories, timestamp: new Date().toLocaleString() });
        return { data: { success: true } };
      },
      invalidatesTags: ["Config"],
    }),
    getAssets: builder.query<AIAsset[], void>({
      queryFn: () => ({ data: [...assets] }),
      providesTags: ["Asset"],
    }),
    deleteAsset: builder.mutation<{ success: boolean }, { id: string }>({
      queryFn: ({ id }) => {
        assets = assets.filter((a) => a.id !== id);
        return { data: { success: true } };
      },
      invalidatesTags: ["Asset"],
    }),
    generateImage: builder.mutation<{ success: boolean; asset?: AIAsset }, { prompt: string; aspectRatio: string }>({
      queryFn: ({ prompt, aspectRatio }) => {
        const dims = aspectRatio === "16:9" ? "1024x576" : "512x512";
        const newAsset: AIAsset = {
          id: `a-${Date.now()}`, type: "image", title: prompt.slice(0, 40), prompt,
          content: `https://placehold.co/${dims}/111111/F59E0B?text=${encodeURIComponent(prompt.slice(0, 20))}`,
          model: "gemini", timestamp: new Date().toLocaleString(),
        };
        assets.unshift(newAsset);
        return { data: { success: true, asset: newAsset } };
      },
      invalidatesTags: ["Asset"],
    }),
  }),
});

export const {
  useGetUsersQuery, useLazyGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation,
  useGetModelsQuery, useToggleModelMutation, useGetSubscriptionsQuery, useGetLogsQuery, useGetConfigQuery,
  useUpdateBrandingMutation, useLogConsentMutation, useGetAssetsQuery, useDeleteAssetMutation, useGenerateImageMutation,
} = apiSlice;
