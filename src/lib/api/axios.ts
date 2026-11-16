import axios from "axios";
import { attachInterceptors } from "./interceptors";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

/**
 * Backend origin. Set VITE_API_BASE_URL in the deployment environment; the
 * localhost fallback is only for local development.
 */
export const API_BASE_URL = trimTrailingSlash(
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8080",
);

function toWebSocketUrl(value: string): string {
  const wsUrl = value.replace(/^http:/i, "ws:").replace(/^https:/i, "wss:");
  return wsUrl.endsWith("/ws") ? wsUrl : `${wsUrl}/ws`;
}

/** STOMP endpoint. Set VITE_WS_BASE_URL when it differs from the API origin. */
export const WS_BASE_URL = toWebSocketUrl(
  trimTrailingSlash((import.meta.env.VITE_WS_BASE_URL as string | undefined) ?? API_BASE_URL),
);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

attachInterceptors(api);
