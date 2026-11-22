import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "../schemas";
import { login as loginApi } from "../api";
import { useAuth } from "../context";
import { normalizeError } from "@/lib/api/errors";
import { safeRedirect } from "../redirect";
import { GoogleButton } from "./GoogleButton";
import {
  ArrowRightIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  LockIcon,
  MailIcon,
} from "./AuthIcons";

export function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = { redirect: searchParams.get("redirect") || undefined };
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput) => {
    setSubmitting(true);
    try {
      const res = await loginApi(values);
      if (!res.token) throw new Error(res.message || "Login failed");
      login(res.token);
      const to = safeRedirect(search.redirect) ?? "/";
      navigate(to);
    } catch (err) {
      const e = normalizeError(err);
      if (e.message && e.message.toLowerCase().includes("verify")) {
        toast.error("Please verify your email first.");
        navigate(`/verify?email=${encodeURIComponent(values.email)}`);
      } else {
        toast.error(e.message || "Invalid email or password");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <div className="auth-field">
        <Label htmlFor="email" className="auth-label">
          Email address
        </Label>
        <div className="auth-control">
          <MailIcon className="auth-control-icon" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="auth-input"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p id="login-email-error" className="auth-error">
            <ExclamationCircleIcon />
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="auth-field">
        <div className="auth-label-row">
          <Label htmlFor="password" className="auth-label">
            Password
          </Label>
          <Link to="/contact" className="auth-text-link">
            Need help?
          </Link>
        </div>
        <div className="auth-control">
          <LockIcon className="auth-control-icon" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="auth-input auth-input-password"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            {...register("password")}
          />
          <button
            type="button"
            className="auth-eye"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && (
          <p id="login-password-error" className="auth-error">
            <ExclamationCircleIcon />
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="auth-submit"
      >
        {submitting ? "Signing in..." : "Sign in"}
        {!submitting && <ArrowRightIcon />}
      </button>

      <div className="auth-divider">or continue with</div>

      <GoogleButton disabled={submitting} />

      <p className="auth-switch">
        New to SkillSync?
        <Link to="/register">Create an account</Link>
      </p>
    </form>
  );
}
