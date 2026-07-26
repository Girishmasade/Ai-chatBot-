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

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
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
    createSubscription: builder.mutation<void, Partial<SubscriptionRecord>>({
      query: (body) => ({ url: "/admin/subscriptions", method: "POST", body }),
      invalidatesTags: ["Subscription", "Log"],
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

    // ── Cookie Consents ──────────────────────────────────
    logConsent: builder.mutation<{ success: boolean }, { user: string; categories: string[] }>({
      query: (body) => ({ url: "/admin/cookie-consent", method: "POST", body }),
      invalidatesTags: ["Config"],
    }),

    // ── User AI Assets ───────────────────────────────────
    getAssets: builder.query<AIAsset[], void>({
      query: () => "/admin/assets",
      transformResponse: (res: any) => res.data,
      providesTags: ["Asset"],
    }),
    deleteAsset: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({ url: `/admin/assets/${id}`, method: "DELETE" }),
      invalidatesTags: ["Asset"],
    }),
    generateImage: builder.mutation<{ success: boolean; asset?: AIAsset }, { prompt: string; aspectRatio: string }>({
      query: (body) => ({ url: "/ai-request/generate-image", method: "POST", body }),
      invalidatesTags: ["Asset"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetModelsQuery,
  useToggleModelMutation,
  useGetSubscriptionsQuery,
  useGetLogsQuery,
  useGetConfigQuery,
  useUpdateBrandingMutation,
  useLogConsentMutation,
  useGetAssetsQuery,
  useDeleteAssetMutation,
  useGenerateImageMutation,
} = apiSlice;
