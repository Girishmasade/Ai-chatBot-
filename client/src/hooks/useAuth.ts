import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  setCredentials,
  logout as logoutAction,
  updateCurrentUser,
} from "../redux/slice/authSlice";
import {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLogoutMutation,
} from "../redux/api/authApi";
import { useUpdateUserProfileMutation } from "../redux/api/userApi";
import { useLazyGetWalletBalanceQuery } from "../redux/api/tokenApi";
import type { AuthUser } from "../types";

/**
 * Central auth hook that bridges RTK Query backend API calls with Redux
 * global auth state. All auth-related actions should go through this hook.
 *
 * NOTE: The old `User` type (with name, tier, credits, etc.) is still used
 * by some pages that rely on mock data. This hook maps the backend AuthUser
 * to a backwards-compatible shape where needed.
 */
export function useAuth() {
  const dispatch = useDispatch();
  const { currentUser, isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  // ── Backend API mutations ───────────────────────────────────────────
  const [registerMutation, registerState] = useRegisterMutation();
  const [loginMutation, loginState] = useLoginMutation();
  const [verifyOtpMutation, verifyOtpState] = useVerifyOtpMutation();
  const [resendOtpMutation, resendOtpState] = useResendOtpMutation();
  const [logoutMutation] = useLogoutMutation();
  const [updateProfileMutation] = useUpdateUserProfileMutation();
  const [triggerGetWallet] = useLazyGetWalletBalanceQuery();

  // ── Auth actions ────────────────────────────────────────────────────

  /** Register a new account — sends OTP to email */
  const register = useCallback(
    async (username: string, email: string) => {
      const result = await registerMutation({ username, email }).unwrap();
      return result;
    },
    [registerMutation]
  );

  /** Login with email — sends OTP to email */
  const login = useCallback(
    async (email: string) => {
      const result = await loginMutation({ email }).unwrap();
      return result;
    },
    [loginMutation]
  );

  /** Verify OTP — on success, auth state is auto-set via extraReducers */
  const verifyOtp = useCallback(
    async (email: string, otp: string) => {
      const result = await verifyOtpMutation({ email, otp }).unwrap();
      return result;
    },
    [verifyOtpMutation]
  );

  /** Resend OTP to email */
  const resendOtp = useCallback(
    async (email: string) => {
      const result = await resendOtpMutation({ email }).unwrap();
      return result;
    },
    [resendOtpMutation]
  );

  /** Logout — calls backend + clears local state */
  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Even if the backend call fails, clear local state
    }
    dispatch(logoutAction());
  }, [dispatch, logoutMutation]);

  /** Update profile name */
  const updateName = useCallback(
    async (newName: string) => {
      try {
        await updateProfileMutation({ username: newName }).unwrap();
        dispatch(updateCurrentUser({ username: newName }));
      } catch (e) {
        console.error("Update name failed:", e);
        throw e;
      }
    },
    [dispatch, updateProfileMutation]
  );

  /** Refresh credits from token wallet */
  const refreshCredits = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const result = await triggerGetWallet(currentUser.id, true).unwrap();
      if (result?.data?.wallet) {
        // Wallet balance is available — consumers can use useGetWalletBalanceQuery directly
        console.log("Wallet balance refreshed:", result.data.wallet.balance);
      }
    } catch (e) {
      console.error("Failed to refresh credits:", e);
    }
  }, [currentUser?.id, triggerGetWallet]);

  /** Manually set credentials (e.g. from OAuth callback) */
  const setAuth = useCallback(
    (accessToken: string, user: AuthUser) => {
      dispatch(setCredentials({ accessToken, user }));
    },
    [dispatch]
  );

  // ── Backward-compatible user shape ──────────────────────────────────
  // Some pages (Dashboard, Profile, etc.) still expect the old `User` type
  // with fields like `name`, `tier`, `credits`, etc. This maps the AuthUser.
  const compatUser = useMemo(
    () =>
      currentUser
        ? {
            id: currentUser.id,
            name: currentUser.username,
            email: currentUser.email,
            role: (currentUser.role === "admin"
              ? "Administrator"
              : "User") as "User" | "Administrator" | "Developer",
            tier: "free" as const,
            credits: currentUser.role === "admin" ? 0 : 200,
            joined: new Date().toISOString().split("T")[0],
            status: "active" as const,
          }
        : {
            id: "",
            name: "Guest",
            email: "",
            role: "User" as const,
            tier: "free" as const,
            credits: 200,
            joined: "",
            status: "active" as const,
          },
    [currentUser]
  );

  return {
    // State
    isAuthenticated,
    currentUser: compatUser,
    authUser: currentUser, // raw backend user
    accessToken,

    // Auth actions
    register,
    login,
    verifyOtp,
    resendOtp,
    logout,
    setAuth,

    // Profile actions
    updateName,
    refreshCredits,

    // Mutation states (for loading/error indicators)
    registerState,
    loginState,
    verifyOtpState,
    resendOtpState,

    // Legacy compatibility — upgrade just dispatches locally for now
    upgrade: async (tier: "free" | "basic" | "pro" | "enterprise", creditsToAdd: number) => {
      // This will be wired to createUserSubscription when backend plans are seeded
      console.log("Upgrade requested:", tier, creditsToAdd);
    },
  };
}
