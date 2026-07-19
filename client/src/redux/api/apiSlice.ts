import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  User,
  SystemModel,
  SubscriptionRecord,
  AuditLog,
  BrandingConfig,
  CookieConsent,
  AIAsset
} from "../../types";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["User", "Asset", "Model", "Subscription", "Log", "Config"],
  endpoints: (builder) => ({
    // User endpoints
    getUsers: builder.query<User[], void>({
      query: () => "/admin/users",
      providesTags: ["User"],
    }),
    createUser: builder.mutation<{ success: boolean; user?: User }, Partial<User>>({
      query: (body) => ({
        url: "/admin/users/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Log"],
    }),
    updateUser: builder.mutation<{ success: boolean; user?: User }, Partial<User>>({
      query: (body) => ({
        url: "/admin/users/update",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Log"],
    }),
    deleteUser: builder.mutation<{ success: boolean }, { id: string }>({
      query: (body) => ({
        url: "/admin/users/delete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Log"],
    }),

    // Model endpoints
    getModels: builder.query<SystemModel[], void>({
      query: () => "/admin/models",
      providesTags: ["Model"],
    }),
    toggleModel: builder.mutation<{ success: boolean }, { id: string }>({
      query: (body) => ({
        url: "/admin/models/toggle",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Model", "Log"],
    }),

    // Subscription endpoints
    getSubscriptions: builder.query<SubscriptionRecord[], void>({
      query: () => "/admin/subscriptions",
      providesTags: ["Subscription"],
    }),

    // Log endpoints
    getLogs: builder.query<AuditLog[], void>({
      query: () => "/admin/logs",
      providesTags: ["Log"],
    }),

    // Configuration / Branding endpoints
    getConfig: builder.query<{ branding: BrandingConfig; cookieConsents: CookieConsent[] }, void>({
      query: () => "/admin/config",
      providesTags: ["Config"],
    }),
    updateBranding: builder.mutation<{ success: boolean }, Partial<BrandingConfig>>({
      query: (body) => ({
        url: "/admin/config/update-branding",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Config", "Log"],
    }),
    logConsent: builder.mutation<{ success: boolean }, { user: string; categories: string[] }>({
      query: (body) => ({
        url: "/admin/config/consent-log",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Config"],
    }),

    // Asset endpoints
    getAssets: builder.query<AIAsset[], void>({
      query: () => "/assets",
      providesTags: ["Asset"],
    }),
    deleteAsset: builder.mutation<{ success: boolean }, { id: string }>({
      query: (body) => ({
        url: "/assets/delete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Asset"],
    }),
    generateImage: builder.mutation<{ success: boolean; asset?: AIAsset }, { prompt: string; aspectRatio: string }>({
      query: (body) => ({
        url: "/gemini/image",
        method: "POST",
        body,
      }),
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
