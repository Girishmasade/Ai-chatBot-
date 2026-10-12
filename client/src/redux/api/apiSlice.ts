import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { updateAccessToken, logout } from "../slice/authSlice";
import type {
  User,
  SystemModel,
  SubscriptionRecord,
  AuditLog,
  BrandingConfig,
  CookieConsent,
  AIAsset,
  PrivacyPolicy,
  TermsAndCondition,
} from "../../types";

import { env } from "@/src/config/envImport";
import type { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: env.API_URL + "/api/v1",
  credentials: "include",
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
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (refreshToken) headers.set("x-refresh-token", refreshToken);
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

    // Fallback retry
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
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Asset", "Model", "Subscription", "Log", "Config", "TokenWallet", "PrivacyPolicy", "TermsAndCondition"],
  endpoints: (builder) => ({
    // ── Dashboard ─────────────────────────────────────────
    getDashboardStats: builder.query<any, void>({
      query: () => "/admin/dashboard",
      transformResponse: (res: any) => res.data?.data || res.data,
      providesTags: ["Config", "User", "Subscription", "Model"],
    }),

    // ── Users ────────────────────────────────────────────
    getUsers: builder.query<User[], void>({
      query: () => "/admin/users",
      transformResponse: (res: any) => res.data?.data || res.data,
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
      transformResponse: (res: any) => res.data?.data || res.data,
      providesTags: ["Model"],
    }),
    toggleModel: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({ url: `/admin/models/${id}/toggle`, method: "PUT" }),
      invalidatesTags: ["Model", "Log"],
    }),
    createModel: builder.mutation<{ success: boolean; data: SystemModel }, Partial<SystemModel>>({
      query: (body) => ({ url: "/admin/models", method: "POST", body }),
      invalidatesTags: ["Model", "Log"],
    }),
    deleteModel: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({ url: `/admin/models/${id}`, method: "DELETE" }),
      invalidatesTags: ["Model", "Log"],
    }),

    // ── Subscriptions ────────────────────────────────────
    getSubscriptions: builder.query<SubscriptionRecord[], void>({
      query: () => "/admin/subscriptions",
      transformResponse: (res: any) => res.data?.data || res.data,
      providesTags: ["Subscription"],
    }),
    createSubscription: builder.mutation<void, Partial<SubscriptionRecord>>({
      query: (body) => ({ url: "/admin/subscriptions", method: "POST", body }),
      invalidatesTags: ["Subscription", "Log"],
    }),

    // ── Audit Logs ───────────────────────────────────────
    getLogs: builder.query<AuditLog[], void>({
      query: () => "/admin/logs",
      transformResponse: (res: any) => res.data?.data || res.data,
      providesTags: ["Log"],
    }),

    // ── Config / Branding ────────────────────────────────
    getConfig: builder.query<{ branding: BrandingConfig; cookieConsents: CookieConsent[] }, void>({
      query: () => "/admin/config",
      transformResponse: (res: any) => res.data?.data || res.data,
      providesTags: ["Config"],
    }),
    updateBranding: builder.mutation<{ success: boolean }, FormData | Partial<BrandingConfig>>({
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
      transformResponse: (res: any) => res.data?.data || res.data,
      providesTags: ["Asset"],
    }),
    deleteAsset: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({ url: `/admin/assets/${id}`, method: "DELETE" }),
      invalidatesTags: ["Asset"],
    }),
    generateImage: builder.mutation<any, FormData>({
      query: (body) => ({ url: "/ai-request/generate-image", method: "POST", body }),
      invalidatesTags: ["Asset", "TokenWallet"],
    }),
    executeAI: builder.mutation<
      { response?: string; content?: string; model?: string; provider?: string; success?: boolean },
      { service?: string; prompt: string; conversationHistory?: any[]; model?: string }
    >({
      query: (body) => ({
        url: "/ai-request/execute",
        method: "POST",
        body: {
          service: body.service || "ai_chat",
          prompt: body.prompt,
          conversationHistory: body.conversationHistory || [],
          ...(body.model ? { model: body.model } : {}),
        },
      }),
      transformResponse: (res: any) => res.data?.data || res.data || res,
      invalidatesTags: ["Asset", "TokenWallet"],
    }),
    getMyRequests: builder.query<any[], void>({
      query: () => "/ai-request/my-requests",
      transformResponse: (res: any) => res.data?.requests || res.data?.items || res.data?.data || res.data || [],
      providesTags: ["Asset"],
    }),
    getChatSessions: builder.query<any[], void>({
      query: () => "/chat/sessions",
      transformResponse: (res: any) => res.data?.sessions || res.data || [],
      providesTags: ["Asset"],
    }),
    getChatSessionById: builder.query<any, string>({
      query: (sessionId) => `/chat/sessions/${sessionId}`,
      transformResponse: (res: any) => res.data?.session || res.data || res,
      providesTags: ["Asset"],
    }),
    saveChatMessage: builder.mutation<
      any,
      { sessionId?: string; title?: string; service?: string; userMessage: string; aiResponse: string; model?: string; provider?: string }
    >({
      query: (body) => ({
        url: "/chat/sessions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Asset"],
    }),
    deleteChatSession: builder.mutation<{ success: boolean }, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `/chat/sessions/${sessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Asset"],
    }),

    // ── Privacy Policy ─────────────────────────────────────
    getPrivacyPolicy: builder.query<PrivacyPolicy, void>({
      query: () => "/privacy/current",
      transformResponse: (res: any) => res?.data?.policy || res?.data,
      providesTags: ["PrivacyPolicy", "Config"],
    }),
    getAdminPrivacyPolicies: builder.query<PrivacyPolicy[], void>({
      query: () => "/privacy/admin/all",
      transformResponse: (res: any) => res?.data?.policies || res?.data,
      providesTags: ["PrivacyPolicy"],
    }),
    createPrivacyPolicy: builder.mutation<{ success: boolean; policy: PrivacyPolicy }, FormData | Partial<PrivacyPolicy>>({
      query: (body) => ({
        url: "/privacy/admin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PrivacyPolicy", "Config", "Log"],
    }),
    updatePrivacyPolicy: builder.mutation<{ success: boolean; policy: PrivacyPolicy }, { id: string; body: FormData | Partial<PrivacyPolicy> }>({
      query: ({ id, body }) => ({
        url: `/privacy/admin/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PrivacyPolicy", "Config", "Log"],
    }),
    setCurrentPrivacyPolicy: builder.mutation<{ success: boolean; policy: PrivacyPolicy }, { id: string }>({
      query: ({ id }) => ({
        url: `/privacy/admin/${id}/set-current`,
        method: "PATCH",
      }),
      invalidatesTags: ["PrivacyPolicy", "Config", "Log"],
    }),
    deletePrivacyPolicy: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `/privacy/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PrivacyPolicy", "Config", "Log"],
    }),
    seedPrivacyPolicy: builder.mutation<{ success: boolean; policy: PrivacyPolicy }, void>({
      query: () => ({
        url: "/privacy/admin/seed",
        method: "POST",
      }),
      invalidatesTags: ["PrivacyPolicy", "Config", "Log"],
    }),

    // ── Terms & Conditions ─────────────────────────────────
    getTermsAndCondition: builder.query<TermsAndCondition, void>({
      query: () => "/terms/current",
      transformResponse: (res: any) => res?.data?.terms || res?.data,
      providesTags: ["TermsAndCondition", "Config"],
    }),
    getAdminTermsAndConditions: builder.query<TermsAndCondition[], void>({
      query: () => "/terms/admin/all",
      transformResponse: (res: any) => res?.data?.terms || res?.data,
      providesTags: ["TermsAndCondition"],
    }),
    createTermsAndCondition: builder.mutation<{ success: boolean; terms: TermsAndCondition }, FormData | Partial<TermsAndCondition>>({
      query: (body) => ({
        url: "/terms/admin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TermsAndCondition", "Config", "Log"],
    }),
    updateTermsAndCondition: builder.mutation<{ success: boolean; terms: TermsAndCondition }, { id: string; body: FormData | Partial<TermsAndCondition> }>({
      query: ({ id, body }) => ({
        url: `/terms/admin/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["TermsAndCondition", "Config", "Log"],
    }),
    setCurrentTermsAndCondition: builder.mutation<{ success: boolean; terms: TermsAndCondition }, { id: string }>({
      query: ({ id }) => ({
        url: `/terms/admin/${id}/set-current`,
        method: "PATCH",
      }),
      invalidatesTags: ["TermsAndCondition", "Config", "Log"],
    }),
    deleteTermsAndCondition: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `/terms/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TermsAndCondition", "Config", "Log"],
    }),
    seedTermsAndCondition: builder.mutation<{ success: boolean; terms: TermsAndCondition }, void>({
      query: () => ({
        url: "/terms/admin/seed",
        method: "POST",
      }),
      invalidatesTags: ["TermsAndCondition", "Config", "Log"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetModelsQuery,
  useToggleModelMutation,
  useCreateModelMutation,
  useDeleteModelMutation,
  useGetSubscriptionsQuery,
  useGetLogsQuery,
  useGetConfigQuery,
  useUpdateBrandingMutation,
  useLogConsentMutation,
  useGetAssetsQuery,
  useDeleteAssetMutation,
  useGenerateImageMutation,
  useExecuteAIMutation,
  useGetMyRequestsQuery,
  useGetChatSessionsQuery,
  useGetChatSessionByIdQuery,
  useLazyGetChatSessionByIdQuery,
  useSaveChatMessageMutation,
  useDeleteChatSessionMutation,
  useGetPrivacyPolicyQuery,
  useGetAdminPrivacyPoliciesQuery,
  useCreatePrivacyPolicyMutation,
  useUpdatePrivacyPolicyMutation,
  useSetCurrentPrivacyPolicyMutation,
  useDeletePrivacyPolicyMutation,
  useSeedPrivacyPolicyMutation,
  useGetTermsAndConditionQuery,
  useGetAdminTermsAndConditionsQuery,
  useCreateTermsAndConditionMutation,
  useUpdateTermsAndConditionMutation,
  useSetCurrentTermsAndConditionMutation,
  useDeleteTermsAndConditionMutation,
  useSeedTermsAndConditionMutation,
} = apiSlice;
