import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/api/axios';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

const PING_TIMEOUT_MS = 8000;
const RETRY_DELAY_MS = 30000;

/**
 * Connection indicator.
 *
 * It deliberately stops polling once the server is reachable. The old version
 * pinged every 30 seconds forever and the request carried the JWT, which made
 * the backend query Neon on every ping and prevented scale-to-zero.
 */
export function ConnectionStatus() {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    let cancelled = false;
    let connected = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let inflight: AbortController | null = null;

    const checkConnection = async () => {
      if (cancelled || connected) return;

      inflight?.abort();
      inflight = new AbortController();
      const timeout = setTimeout(() => inflight?.abort(), PING_TIMEOUT_MS);

      try {
        // Plain fetch: no Authorization header, so the backend's JWT filter
        // (and its database lookup) never runs for this request.
        const response = await fetch(`${API_BASE_URL}/api/auth/ping?t=${Date.now()}`, {
          method: 'GET',
          cache: 'no-store',
          signal: inflight.signal,
        });

        if (cancelled) return;

        // 502/503 means the edge proxy is up but the app is still starting.
        if (response.status === 502 || response.status === 503) {
          connected = false;
          setStatus('connecting');
        } else {
          connected = true;
          setStatus('connected');
        }
      } catch {
        if (cancelled) return;
        connected = false;
        setStatus('disconnected');
      } finally {
        clearTimeout(timeout);
        if (!cancelled && !connected) {
          retryTimer = setTimeout(checkConnection, RETRY_DELAY_MS);
        }
      }
    };

    const recheck = () => {
      if (cancelled || connected) return;
      if (retryTimer) clearTimeout(retryTimer);
      void checkConnection();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') recheck();
    };

    const onOffline = () => {
      if (!cancelled) {
        connected = false;
        setStatus('disconnected');
      }
    };

    void checkConnection();
    window.addEventListener('online', recheck);
    window.addEventListener('offline', onOffline);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      inflight?.abort();
      window.removeEventListener('online', recheck);
      window.removeEventListener('offline', onOffline);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  if (status === 'connected') {
    return (
      <div className="flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-sm" title="Server is awake and connected">
        <Wifi className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Connected</span>
      </div>
    );
  }

  if (status === 'connecting') {
    return (
      <div className="flex items-center gap-2 text-xs font-medium text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 shadow-sm" title="Waking up the server...">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="hidden sm:inline">Waking Server...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs font-medium text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20 shadow-sm" title="Server is sleeping">
      <WifiOff className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Server Offline</span>
    </div>
  );
}
