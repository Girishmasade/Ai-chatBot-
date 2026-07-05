import { backendServerConfig } from "../server/backendServerConfig";

const VERIFY_OTP = "/api/v1/otp";

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

interface OtpResponseUser {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "user";
}

interface OtpResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: OtpResponseUser;
  };
}

export const verifyOtpApi = backendServerConfig.injectEndpoints({
  endpoints: (b) => ({
    verifyOtp: b.mutation<OtpResponse, VerifyOtpRequest>({
      query: (payload) => ({
        url: `${VERIFY_OTP}/verify`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useVerifyOtpMutation } = verifyOtpApi;
