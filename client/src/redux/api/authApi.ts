import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { VITE_BACKEND_URI } from '@/env/EnvImport';
import { tokenStorage } from '@/utils/tokenStorage';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${VITE_BACKEND_URI}/api/v1/auth`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = tokenStorage.getToken();
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      { success: boolean; message: string; data: { token: string } },
      { email: string }
    >({
      query: (body) => ({ url: '/login', method: 'POST', body }),
    }),
    register: builder.mutation<
      { success: boolean; message: string },
      { username: string; email: string }
    >({
      query: (body) => ({ url: '/register', method: 'POST', body }),
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: '/logout', method: 'POST' }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;
