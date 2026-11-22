import { RegisterForm } from "@/features/auth/components/RegisterForm";

export function Register() {
  return (
    <div className="auth-page">
      <header className="auth-head">
        <p className="auth-eyebrow">Join the network</p>
        <h1 className="auth-title">
          Create your <em>account.</em>
        </h1>
        <p className="auth-sub">A profile, your skills, and a team that complements them.</p>
      </header>

      <RegisterForm />
    </div>
  );
}
