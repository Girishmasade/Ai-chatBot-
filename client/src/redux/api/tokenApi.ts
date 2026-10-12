import { apiSlice } from "../backendApi/apiBackendConnectivity";
import type {
  ApiResponse,
  TokenWallet,
  TokenTransaction,
  TokenPackage,
} from "../../types";

export const tokenApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── GET /api/v1/token-wallet/:userId ──────────────────────────────
    getWalletBalance: builder.query<ApiResponse<{ wallet: TokenWallet }>, string>({
      query: (userId) => `/token-wallet/${userId}`,
      providesTags: (_result, _error, userId) => [
        { type: "TokenWallet", id: userId },
        "TokenWallet",
      ],
    }),

    // ── GET /api/v1/token-transaction/me ──────────────────────────────
    getMyTransactions: builder.query<
      ApiResponse<{ transactions: TokenTransaction[] }>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/token-transaction/me",
        params: params || undefined,
      }),
      providesTags: ["TokenTransaction"],
    }),

    // ── GET /api/v1/token-transaction/:transactionId ─────────────────
    getTransactionById: builder.query<
      ApiResponse<{ transaction: TokenTransaction }>,
      string
    >({
      query: (transactionId) => `/token-transaction/${transactionId}`,
      providesTags: (_result, _error, transactionId) => [
        { type: "TokenTransaction", id: transactionId },
      ],
    }),

    // ── GET /api/v1/token-package/active ──────────────────────────────
    getActiveTokenPackages: builder.query<
      ApiResponse<{ packages?: TokenPackage[]; cache?: TokenPackage[] }>,
      void
    >({
      query: () => "/token-package/active",
      providesTags: ["TokenPackage"],
    }),

    // ── GET /api/v1/token-package/get-all-token ──────────────────────
    getAllTokenPackages: builder.query<
      ApiResponse<{ result?: { items?: TokenPackage[]; total?: number }; packages?: TokenPackage[] }>,
      void
    >({
      query: () => "/token-package/get-all-token",
      providesTags: ["TokenPackage"],
    }),

    // ── POST /api/v1/token-package/create-token ─────────────────────
    createTokenPackage: builder.mutation<
      ApiResponse<{ tokenPackageCreate: TokenPackage }>,
      {
        name: string;
        description: string;
        tokenAmount: number;
        price: number;
        currency?: string;
        status?: string;
        isPopular?: boolean;
        sortOrder?: number;
      }
    >({
      query: (body) => ({
        url: "/token-package/create-token",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TokenPackage"],
    }),

    // ── PUT /api/v1/token-package/update/:tokenId/token ─────────────
    updateTokenPackage: builder.mutation<
      ApiResponse<{ tokenPackage: TokenPackage }>,
      { tokenId: string; [key: string]: any }
    >({
      query: ({ tokenId, ...body }) => ({
        url: `/token-package/update/${tokenId}/token`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["TokenPackage"],
    }),

    // ── PATCH /api/v1/token-package/toggle/:tokenId/token ───────────
    toggleTokenPackageStatus: builder.mutation<
      ApiResponse<{ tokenPackage: TokenPackage }>,
      { tokenId: string; status: "active" | "inactive" }
    >({
      query: ({ tokenId, status }) => ({
        url: `/token-package/toggle/${tokenId}/token`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["TokenPackage"],
    }),

    // ── DELETE /api/v1/token-package/delete/:tokenId/token ──────────
    deleteTokenPackage: builder.mutation<ApiResponse<any>, string>({
      query: (tokenId) => ({
        url: `/token-package/delete/${tokenId}/token`,
        method: "DELETE",
      }),
      invalidatesTags: ["TokenPackage"],
    }),
  }),
});

export const {
  useGetWalletBalanceQuery,
  useLazyGetWalletBalanceQuery,
  useGetMyTransactionsQuery,
  useLazyGetMyTransactionsQuery,
  useGetTransactionByIdQuery,
  useGetActiveTokenPackagesQuery,
  useGetAllTokenPackagesQuery,
  useCreateTokenPackageMutation,
  useUpdateTokenPackageMutation,
  useToggleTokenPackageStatusMutation,
  useDeleteTokenPackageMutation,
} = tokenApi;
