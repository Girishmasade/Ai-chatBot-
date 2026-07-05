import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { VITE_BACKEND_URI } from '@/env/EnvImport';
import { tokenStorage } from '@/utils/tokenStorage';

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${VITE_BACKEND_URI}/api/v1/user`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = tokenStorage.getToken();
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['UserProfile'],
  endpoints: (builder) => ({
    getUserProfile: builder.query<{ success: boolean; data: UserProfile }, string>({
      query: (userId) => `/get-profile/${userId}`,
      providesTags: ['UserProfile'],
    }),
    updateUserProfile: builder.mutation<
      { success: boolean; data: UserProfile },
      FormData
    >({
      query: (body) => ({ url: '/update-profile', method: 'PUT', body }),
      invalidatesTags: ['UserProfile'],
    }),
    deleteUserProfile: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: '/delete-profile', method: 'DELETE' }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useDeleteUserProfileMutation,
} = userApi;
