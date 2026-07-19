import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  User,
  SystemModel,
  SubscriptionRecord,
  AuditLog,
  BrandingConfig,
  CookieConsent,
  AIAsset,
} from "../../types";
import {
  mockUsers,
  mockModels,
  mockSubscriptions,
  mockLogs,
  mockCookieConsents,
  mockBranding,
  mockAssets,
} from "./mockData";

// ─────────────────────────────────────────────────────────
//  In-memory store  (mutated by queryFn mutations)
//  Swap this entire file's base query to fetchBaseQuery()
//  once the real backend is ready.
// ─────────────────────────────────────────────────────────
let users    = [...mockUsers];
let models   = [...mockModels];
let subs     = [...mockSubscriptions];
let logs     = [...mockLogs];
let consents = [...mockCookieConsents];
let branding = { ...mockBranding };
let assets   = [...mockAssets];

const pushLog = (action: string, details: string) => {
  logs.unshift({
    id: `log-${Date.now()}`,
    action,
    operator: "devcoderm13@gmail.com",
    timestamp: new Date().toLocaleString(),
    details,
  });
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User", "Asset", "Model", "Subscription", "Log", "Config"],
  endpoints: (builder) => ({
    // ── Users ────────────────────────────────────────────
    getUsers: builder.query<User[], void>({
      queryFn: () => ({ data: [...users] }),
      providesTags: ["User"],
    }),
    createUser: builder.mutation<{ success: boolean; user: User }, Partial<User>>({
      queryFn: (body) => {
        const newUser: User = {
          id: `u-${Date.now()}`,
          name: body.name || "New User",
          email: body.email || "new@example.com",
          role: (body.role as User["role"]) || "User",
          tier: (body.tier as User["tier"]) || "free",
          credits: body.credits ?? 100,
          joined: new Date().toISOString().split("T")[0],
          status: "active",
        };
        users.unshift(newUser);
        pushLog("User Created", `Deployed account for ${newUser.email}`);
        return { data: { success: true, user: newUser } };
      },
      invalidatesTags: ["User", "Log"],
    }),
    updateUser: builder.mutation<{ success: boolean; user?: User }, Partial<User>>({
      queryFn: (body) => {
        const idx = users.findIndex((u) => u.id === body.id);
        if (idx === -1) return { error: { status: 404, data: "User not found" } };
        users[idx] = { ...users[idx], ...body } as User;
        pushLog("User Updated", `Modified specs for ${users[idx].email}`);
        return { data: { success: true, user: users[idx] } };
      },
      invalidatesTags: ["User", "Log"],
    }),
    deleteUser: builder.mutation<{ success: boolean }, { id: string }>({
      queryFn: ({ id }) => {
        const target = users.find((u) => u.id === id);
        users = users.filter((u) => u.id !== id);
        pushLog("User Purged", `Deleted ${target?.email ?? id}`);
        return { data: { success: true } };
      },
      invalidatesTags: ["User", "Log"],
    }),

    // ── Models ───────────────────────────────────────────
    getModels: builder.query<SystemModel[], void>({
      queryFn: () => ({ data: [...models] }),
      providesTags: ["Model"],
    }),
    toggleModel: builder.mutation<{ success: boolean }, { id: string }>({
      queryFn: ({ id }) => {
        const m = models.find((x) => x.id === id);
        if (m) {
          m.status = m.status === "active" ? "inactive" : "active";
          pushLog("Model Toggled", `${m.name} → ${m.status}`);
        }
        return { data: { success: true } };
      },
      invalidatesTags: ["Model", "Log"],
    }),

    // ── Subscriptions ────────────────────────────────────
    getSubscriptions: builder.query<SubscriptionRecord[], void>({
      queryFn: () => ({ data: [...subs] }),
      providesTags: ["Subscription"],
    }),

    // ── Audit Logs ───────────────────────────────────────
    getLogs: builder.query<AuditLog[], void>({
      queryFn: () => ({ data: [...logs] }),
      providesTags: ["Log"],
    }),

    // ── Config / Branding ────────────────────────────────
    getConfig: builder.query<{ branding: BrandingConfig; cookieConsents: CookieConsent[] }, void>({
      queryFn: () => ({
        data: { branding: { ...branding }, cookieConsents: [...consents] },
      }),
      providesTags: ["Config"],
    }),
    updateBranding: builder.mutation<{ success: boolean }, Partial<BrandingConfig>>({
      queryFn: (body) => {
        branding = { ...branding, ...body };
        pushLog("Branding Updated", `Saved CMS branding changes`);
        return { data: { success: true } };
      },
      invalidatesTags: ["Config", "Log"],
    }),
    logConsent: builder.mutation<{ success: boolean }, { user: string; categories: string[] }>({
      queryFn: ({ user, categories }) => {
        consents.push({
          id: `cc-${Date.now()}`,
          user,
          consented: true,
          categories,
          timestamp: new Date().toLocaleString(),
        });
        return { data: { success: true } };
      },
      invalidatesTags: ["Config"],
    }),

    // ── Assets ───────────────────────────────────────────
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
        const dims = aspectRatio === "16:9" ? "1024x576"
          : aspectRatio === "9:16" ? "576x1024"
          : aspectRatio === "4:3" ? "800x600"
          : "512x512";
        const newAsset: AIAsset = {
          id: `a-${Date.now()}`,
          type: "image",
          title: prompt.slice(0, 40),
          prompt,
          content: `https://placehold.co/${dims}/111111/F59E0B?text=${encodeURIComponent(prompt.slice(0, 20))}`,
          model: "gemini-2.5-flash-lite-image",
          timestamp: new Date().toLocaleString(),
        };
        assets.unshift(newAsset);
        return { data: { success: true, asset: newAsset } };
      },
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
