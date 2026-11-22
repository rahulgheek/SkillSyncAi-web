import { Outlet, Link } from "react-router-dom";
import { AuthPoster } from "@/features/auth/components/AuthPoster";
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  ShieldCheckIcon,
} from "@/features/auth/components/AuthIcons";
import "@/features/auth/auth.css";

export function AuthLayout() {
  return (
    <div className="auth-shell">
      <AuthPoster />

      <main className="auth-panel">
        <div className="auth-panel-top">
          <Link to="/" className="auth-back">
            <ArrowLeftIcon />
            Back to home
          </Link>
          <Link to="/contact" className="auth-help">
            Need help?
            <ArrowUpRightIcon />
          </Link>
        </div>

        <div className="auth-form-wrap">
          <Outlet />
        </div>

        <footer className="auth-panel-foot">
          <span className="auth-secure">
            <ShieldCheckIcon />
            Secure sign-in
          </span>
          <nav className="auth-legal" aria-label="Legal">
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms-of-service">Terms</Link>
          </nav>
        </footer>
      </main>
    </div>
  );
}
