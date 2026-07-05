import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { VITE_BACKEND_URI } from '@/env/EnvImport';
import { tokenStorage } from '@/utils/tokenStorage';

interface DashboardStats {
  totalUsers: number;
  totalSubscriptions: number;
  totalAIRequests: number;
  activeUsers: number;
}

interface AdminProfile {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
}

interface AuditLog {
  _id: string;
  action: string;
  type: string;
  admin: string;
  ipAddress?: string;
  status: 'success' | 'failed';
  createdAt: string;
}

interface UserListItem {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  avatar?: string;
}

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${VITE_BACKEND_URI}/api/v1`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = tokenStorage.getToken();
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Dashboard', 'Users', 'AuditLogs'],
  endpoints: (builder) => ({
    getDashboard: builder.query<{ success: boolean; data: DashboardStats }, void>({
      query: () => '/admin/dashboard',
      providesTags: ['Dashboard'],
    }),
    getAdminProfile: builder.query<{ success: boolean; data: AdminProfile }, void>({
      query: () => '/admin/profile',
    }),
    updateAdminProfile: builder.mutation<
      { success: boolean; data: AdminProfile },
      FormData
    >({
      query: (body) => ({
        url: '/admin/update-profile',
        method: 'PUT',
        body,
      }),
    }),
    getAllUsers: builder.query<
      { success: boolean; data: UserListItem[]; total: number },
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: '/user',
        params,
      }),
      providesTags: ['Users'],
    }),
    getAuditLogs: builder.query<
      { success: boolean; data: AuditLog[] },
      { page?: number; type?: string; search?: string }
    >({
      query: (params) => ({ url: '/admin/audit-logs', params }),
      providesTags: ['AuditLogs'],
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useGetAllUsersQuery,
  useGetAuditLogsQuery,
} = adminApi;
