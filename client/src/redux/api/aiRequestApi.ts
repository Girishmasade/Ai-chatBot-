import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { VITE_BACKEND_URI } from '@/env/EnvImport';
import { tokenStorage } from '@/utils/tokenStorage';

interface AIRequest {
  _id: string;
  userId: string;
  service: string;
  provider: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  tokensUsed: number;
  prompt?: string;
  response?: string;
  createdAt: string;
}

interface UsageStats {
  byService: Record<string, number>;
  byProvider: Record<string, number>;
  byStatus: Record<string, number>;
  totalRequests: number;
  totalTokensUsed: number;
}

export const aiRequestApi = createApi({
  reducerPath: 'aiRequestApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${VITE_BACKEND_URI}/api/v1/ai-request`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = tokenStorage.getToken();
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['AIRequest'],
  endpoints: (builder) => ({
    // User endpoints
    executeAIRequest: builder.mutation<
      { success: boolean; data: AIRequest },
      { service: string; prompt: string; model?: string }
    >({
      query: (body) => ({ url: '/execute', method: 'POST', body }),
      invalidatesTags: ['AIRequest'],
    }),
    getMyAIRequests: builder.query<
      { success: boolean; data: AIRequest[]; total: number },
      { page?: number; limit?: number; status?: string }
    >({
      query: (params) => ({ url: '/my-requests', params }),
      providesTags: ['AIRequest'],
    }),
    getAIRequestById: builder.query<{ success: boolean; data: AIRequest }, string>({
      query: (requestId) => `/get/${requestId}`,
    }),
    cancelAIRequest: builder.mutation<{ success: boolean }, string>({
      query: (requestId) => ({ url: `/cancel/${requestId}`, method: 'PATCH' }),
      invalidatesTags: ['AIRequest'],
    }),
    // Admin endpoints
    getAllAIRequests: builder.query<
      { success: boolean; data: AIRequest[]; total: number },
      { page?: number; limit?: number; status?: string; service?: string }
    >({
      query: (params) => ({ url: '/admin/all', params }),
      providesTags: ['AIRequest'],
    }),
    getUsageStats: builder.query<{ success: boolean; data: UsageStats }, void>({
      query: () => '/admin/stats',
    }),
    deleteAIRequest: builder.mutation<{ success: boolean }, string>({
      query: (requestId) => ({ url: `/admin/delete/${requestId}`, method: 'DELETE' }),
      invalidatesTags: ['AIRequest'],
    }),
  }),
});

export const {
  useExecuteAIRequestMutation,
  useGetMyAIRequestsQuery,
  useGetAIRequestByIdQuery,
  useCancelAIRequestMutation,
  useGetAllAIRequestsQuery,
  useGetUsageStatsQuery,
  useDeleteAIRequestMutation,
} = aiRequestApi;
