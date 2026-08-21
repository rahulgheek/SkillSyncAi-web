import { api } from "@/lib/api/axios";

export interface AuthTokenResponse {
  token: string;
  message?: string;
}

export async function registerUser(input: {
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<string> {
  const res = await api.post<string>("/api/auth/register", input);
  return typeof res.data === "string" ? res.data : "OTP sent successfully";
}

export async function verifyOtp(input: { email: string; otp: string }): Promise<string> {
  const res = await api.post<string>("/api/auth/verify", input);
  return typeof res.data === "string" ? res.data : "Account verified successfully";
}

export async function resendOtp(input: { email: string }): Promise<string> {
  const res = await api.post<string>("/api/auth/resend-otp", input);
  return typeof res.data === "string" ? res.data : "OTP resent successfully";
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthTokenResponse> {
  const res = await api.post<AuthTokenResponse>("/api/auth/login", input);
  return res.data;
}

export async function oauthExchange(code: string): Promise<AuthTokenResponse> {
  const res = await api.get<AuthTokenResponse>("/api/auth/oauth2/exchange", {
    params: { code },
  });
  return res.data;
}
