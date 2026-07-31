import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/context";
import { Loader2 } from "lucide-react";

export function OAuth2Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { exchangeOAuth2Code } = useAuth();
  const hasAttempted = useRef(false);
  
  useEffect(() => {
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const code = searchParams.get("code");
    
    if (code) {
      exchangeOAuth2Code(code)
        .then(() => {
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("OAuth2 exchange failed", err);
          navigate("/login?error=oauth2_failed");
        });
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate, exchangeOAuth2Code]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-medium text-foreground">Completing sign in...</h2>
      <p className="text-muted-foreground mt-2">Please wait while we authenticate you.</p>
    </div>
  );
}
