import { backendServerConfig } from "../server/backendServerConfig";

interface AuthResponse {
  user: object,
  email: string
}

const AUTH = "/api/v1/auth"

export const authApi = backendServerConfig.injectEndpoints({
  endpoints: (b) => ({
    register: b.mutation<AuthResponse, any>({
      query: (user) => ({
        url: `${AUTH}/register`,
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Auth"]
    }),

    login: b.mutation<AuthResponse, {email: string}>({
      query: ({email}) => ({
        url: `${AUTH}/login`,
        method: "POST",
        body: {email},
      }),
      invalidatesTags: ["Auth"]
    }),

    googleLogin: b.mutation<AuthResponse, any>({
      query: () => ({
        url: `${AUTH}/google`,
        method: "GET",
      }),
      invalidatesTags: ["Auth"]
    }),

    githubLogin: b.mutation<AuthResponse, any>({
      query: () => ({
        url: `${AUTH}/github`,
        method: "GET",
      }),
      invalidatesTags: ["Auth"]
    }),

    facebookLogin: b.mutation<AuthResponse, any>({
      query: () => ({
        url: `${AUTH}/facebook`,
        method: "GET",
      }),
      invalidatesTags: ["Auth"]
    }),

    logout: b.mutation<AuthResponse, void>({
      query: () => ({
        url: `${AUTH}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["Auth"]
    })
  })
})

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useGoogleLoginMutation, useGithubLoginMutation, useFacebookLoginMutation } = authApi;