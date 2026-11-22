import { LoginForm } from "@/features/auth/components/LoginForm";

export function Login() {
  return (
    <div className="auth-page">
      <header className="auth-head">
        <p className="auth-eyebrow">Member access</p>
        <h1 className="auth-title">
          Welcome <em>back.</em>
        </h1>
        <p className="auth-sub">Enter your details to pick up where you left off.</p>
      </header>

      <LoginForm />
    </div>
  );
}
