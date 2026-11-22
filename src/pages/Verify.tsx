import { useSearchParams } from "react-router-dom";
import { OtpForm } from "@/features/auth/components/OtpForm";

export function Verify() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="auth-page">
      <header className="auth-head">
        <p className="auth-eyebrow">Final step</p>
        <h1 className="auth-title">
          Check your <em>inbox.</em>
        </h1>
        <p className="auth-sub">
          {email ? `Enter the code sent to ${email}` : "Enter your code to continue."}
        </p>
      </header>

      <OtpForm defaultEmail={email} />
    </div>
  );
}
