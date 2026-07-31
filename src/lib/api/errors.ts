import axios, { AxiosError } from "axios";

/**
 * Normalized error shape used across the app. Every module's API layer
 * should throw / surface errors that conform to this so UI code stays
 * consistent.
 */
export interface ApiError {
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
  raw?: unknown;
}

export function normalizeError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const axErr = err as AxiosError<unknown>;
    const status = axErr.response?.status;
    const data = axErr.response?.data as unknown;

    // Backend can return a plain string body (e.g. "OTP sent successfully")
    if (typeof data === "string" && data.trim().length > 0) {
      return { message: data, status, raw: data };
    }

    if (data && typeof data === "object") {
      const obj = data as Record<string, unknown>;
      const message =
        (typeof obj.message === "string" && obj.message) ||
        (typeof obj.error === "string" && obj.error) ||
        axErr.message ||
        "Request failed";

      const fieldErrors: Record<string, string> = {};
      if (obj.errors && typeof obj.errors === "object") {
        for (const [k, v] of Object.entries(obj.errors as Record<string, unknown>)) {
          if (typeof v === "string") fieldErrors[k] = v;
        }
      }

      return {
        message,
        status,
        fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined,
        raw: data,
      };
    }

    return {
      message: axErr.message || "Network error",
      status,
      raw: data,
    };
  }

  if (err instanceof Error) return { message: err.message, raw: err };
  return { message: "Unknown error", raw: err };
}
