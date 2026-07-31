import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../token-storage";

/**
 * Paths for which a 401/400 must NOT trigger a global sign-out redirect.
 * These endpoints legitimately return errors during failed auth attempts
 * (bad credentials, wrong OTP, expired exchange code, etc.). The calling
 * form is responsible for surfacing the error inline.
 */
const AUTH_ENDPOINT_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/verify",
  "/api/auth/oauth2/exchange",
];

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;
  return AUTH_ENDPOINT_PATHS.some((p) => url.includes(p));
}

/**
 * Called by the AuthProvider once mounted so the interceptor can trigger
 * a sign-out + redirect without pulling in React state.
 */
let onUnauthorized: (() => void) | null = null;
export function registerUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export function attachInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status;
      const url: string | undefined = error?.config?.url;

      if (status === 401 && !isAuthEndpoint(url)) {
        tokenStorage.clear();
        onUnauthorized?.();
      }
      return Promise.reject(error);
    },
  );
}
