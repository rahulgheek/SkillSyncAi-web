import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { tokenStorage } from "@/lib/token-storage";
import { registerUnauthorizedHandler } from "@/lib/api/interceptors";
import { api } from "@/lib/api/axios";

/**
 * AuthContext.
 *
 * Today: authentication state is derived solely from JWT presence.
 * Future: when `/me` lands, `user` + `refetchUser` become live without
 * changing this contract or refactoring downstream consumers.
 */
export interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { id: string; email: string } | null;
  login: (token: string) => void;
  logout: () => void;
  /** No-op today. Will refetch `/me` once that endpoint exists. */
  refetchUser: () => Promise<void>;
  exchangeOAuth2Code: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  const refetchUser = useCallback(async () => {
    const currentToken = tokenStorage.get();
    if (!currentToken) return;
    try {
      const response = await api.get("/api/v1/profile/me");
      if (response.data && response.data.data && response.data.data.userId) {
        setUser(prev => ({ 
          id: response.data.data.userId, 
          email: prev?.email || response.data.data.email || "" 
        }));
      }
    } catch (e) {
      console.error("Failed to fetch user profile for ID", e);
    }
  }, []);

  // Hydrate token from localStorage on mount (client only).
  useEffect(() => {
    const storedToken = tokenStorage.get();
    setToken(storedToken);
    if (storedToken) {
      try {
        const base64Url = storedToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        if (payload.userId) {
          setUser({ id: payload.userId, email: payload.sub });
        }
      } catch (e) {
        console.error("Failed to parse JWT", e);
      }
      refetchUser(); // Always fetch to guarantee we have userId even if backend wasn't recompiled
    }
    setIsLoading(false);
  }, [refetchUser]);

  const login = useCallback((newToken: string) => {
    tokenStorage.set(newToken);
    setToken(newToken);
    try {
      const base64Url = newToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      if (payload.userId) {
        setUser({ id: payload.userId, email: payload.sub });
      } else {
        // Fallback to fetching profile if backend wasn't recompiled
        refetchUser();
      }
    } catch (e) {
      console.error("Failed to parse JWT on login", e);
      refetchUser();
    }
  }, [refetchUser]);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
  }, []);



  const exchangeOAuth2Code = useCallback(async (code: string) => {
    const response = await fetch(`http://localhost:8080/api/auth/oauth2/exchange?code=${code}`);
    if (!response.ok) {
      throw new Error("Failed to exchange OAuth2 code");
    }
    const data = await response.json();
    if (data.token) {
      login(data.token);
    } else {
      throw new Error("No token received from OAuth2 exchange");
    }
  }, [login]);

  // Wire the axios 401 handler to context so protected 401s sign the user out.
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setToken(null);
      if (typeof window !== "undefined") {
        const current = window.location.pathname + window.location.search;
        const target = `/auth/login?redirect=${encodeURIComponent(current)}`;
        if (!window.location.pathname.startsWith("/auth")) {
          window.location.replace(target);
        }
      }
    });
    return () => registerUnauthorizedHandler(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      user,
      login,
      logout,
      refetchUser,
      exchangeOAuth2Code,
    }),
    [token, isLoading, user, login, logout, refetchUser, exchangeOAuth2Code],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
