import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { VITE_BACKEND_URI } from '@/env/EnvImport';
import { tokenStorage } from '@/utils/tokenStorage';

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  features: string[];
  tokenLimit: number;
  duration: number;
  isActive: boolean;
  createdAt: string;
}

interface UserSubscription {
  _id: string;
  userId: string;
  planId: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
}

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${VITE_BACKEND_URI}/api/v1/subscription`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = tokenStorage.getToken();
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Subscription', 'UserSubscription'],
  endpoints: (builder) => ({
    getSubscriptions: builder.query<
      { success: boolean; data: SubscriptionPlan[]; total: number },
      { page?: number; limit?: number }
    >({
      query: (params) => ({ url: '/get-subscription', params }),
      providesTags: ['Subscription'],
    }),
    createSubscription: builder.mutation<
      { success: boolean; data: SubscriptionPlan },
      Partial<SubscriptionPlan>
    >({
      query: (body) => ({ url: '/create-subscription', method: 'POST', body }),
      invalidatesTags: ['Subscription'],
    }),
    updateSubscription: builder.mutation<
      { success: boolean; data: SubscriptionPlan },
      { id: string } & Partial<SubscriptionPlan>
    >({
      query: ({ id, ...body }) => ({
        url: `/update-subscription?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
    deleteSubscription: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/delete-subscription?id=${id}`, method: 'DELETE' }),
      invalidatesTags: ['Subscription'],
    }),
    // User-facing
    getUserSubscription: builder.query<
      { success: boolean; data: UserSubscription },
      string
    >({
      query: (subscriptionId) => `/get-user-subscription/${subscriptionId}`,
      providesTags: ['UserSubscription'],
    }),
    createUserSubscription: builder.mutation<
      { success: boolean; data: UserSubscription },
      string
    >({
      query: (planId) => ({ url: `/create-user-subscription/${planId}`, method: 'POST' }),
      invalidatesTags: ['UserSubscription'],
    }),
    cancelUserSubscription: builder.mutation<{ success: boolean }, string>({
      query: (subscriptionId) => ({
        url: `/cancel-user-subscription/${subscriptionId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['UserSubscription'],
    }),
  }),
});

export const {
  useGetSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetUserSubscriptionQuery,
  useCreateUserSubscriptionMutation,
  useCancelUserSubscriptionMutation,
} = subscriptionApi;
