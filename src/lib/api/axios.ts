import axios from "axios";
import { attachInterceptors } from "./interceptors";

const baseURL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8080";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

attachInterceptors(api);

export { baseURL as API_BASE_URL };
