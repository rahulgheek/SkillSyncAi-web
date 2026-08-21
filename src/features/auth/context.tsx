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

  const parseUserFromToken = (jwt: string) => {
    try {
      const base64Url = jwt.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return { id: payload.userId || "", email: payload.sub || "" };
    } catch (e) {
      console.error("Failed to parse JWT", e);
      return null;
    }
  };

  const refetchUser = useCallback(async () => {
    const currentToken = tokenStorage.get();
    if (!currentToken) return;
    
    // Always ensure email is preserved from the token!
    const tokenUser = parseUserFromToken(currentToken);
    
    try {
      const response = await api.get("/api/v1/profile/me");
      if (response.data && response.data.data && response.data.data.userId) {
        setUser({ 
          id: response.data.data.userId, 
          email: tokenUser?.email || "" 
        });
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
      const parsedUser = parseUserFromToken(storedToken);
      if (parsedUser) {
        setUser(parsedUser);
      }
      refetchUser(); // Always fetch to guarantee we have userId even if backend wasn't recompiled
    }
    setIsLoading(false);
  }, [refetchUser]);

  const login = useCallback((newToken: string) => {
    tokenStorage.set(newToken);
    setToken(newToken);
    const parsedUser = parseUserFromToken(newToken);
    if (parsedUser && parsedUser.id) {
      setUser(parsedUser);
    } else {
      if (parsedUser) setUser(parsedUser);
      refetchUser();
    }
  }, [refetchUser]);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
  }, []);



  const exchangeOAuth2Code = useCallback(async (code: string) => {
    try {
      const response = await api.get(`/api/auth/oauth2/exchange?code=${code}`);
      const data = response.data;
      if (data.token) {
        login(data.token);
      } else {
        throw new Error("No token received from OAuth2 exchange");
      }
    } catch (err) {
      console.error("Failed to exchange OAuth2 code", err);
      throw err;
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
