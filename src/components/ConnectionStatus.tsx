import { useState, useEffect } from 'react';
import { api } from '@/lib/api/axios';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

export function ConnectionStatus() {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    let mounted = true;
    
    const checkConnection = async () => {
      try {
        const response = await api.get('/api/auth/login', { validateStatus: () => true });
        
        if (!mounted) return;

        // Render returns 502/503 while spinning up the free instance
        if (response.status === 502 || response.status === 503) {
          setStatus('connecting');
        } else {
          // Any other status (405, 400, 200, etc.) means the Spring Boot app is actually responding
          setStatus('connected');
        }
      } catch (e: any) {
        if (!mounted) return;
        // Network error usually means it's totally unreachable
        if (e.message === 'Network Error' || e.code === 'ERR_NETWORK') {
          setStatus('disconnected');
        } else {
          // If we got some other error but it reached the server, assume it's connecting
          setStatus('connecting');
        }
      }
    };

    checkConnection();
    
    // Check every 5 seconds if disconnected or connecting, otherwise every 30 seconds
    const interval = setInterval(() => {
      checkConnection();
    }, status === 'connected' ? 30000 : 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [status]);

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
      <div className="flex items-center gap-2 text-xs font-medium text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 shadow-sm" title="Waking up Render server...">
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
