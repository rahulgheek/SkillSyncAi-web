import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterInput } from "../schemas";
import { registerUser } from "../api";
import { normalizeError } from "@/lib/api/errors";
import { GoogleButton } from "./GoogleButton";
import {
  ArrowRightIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  LockIcon,
  MailIcon,
} from "./AuthIcons";

export function RegisterForm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterInput) => {
    setSubmitting(true);
    try {
      const msg = await registerUser(values);
      toast.success(msg || "OTP sent to your email");
      navigate(`/verify?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      const e = normalizeError(err);
      toast.error(e.message || "Registration failed");
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
            aria-describedby={errors.email ? "register-email-error" : undefined}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p id="register-email-error" className="auth-error">
            <ExclamationCircleIcon />
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="auth-field-grid">
        <div className="auth-field">
          <div className="auth-label-row">
            <Label htmlFor="password" className="auth-label">
              Password
            </Label>
            <span className="auth-hint">8+ characters</span>
          </div>
          <div className="auth-control">
            <LockIcon className="auth-control-icon" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              className="auth-input auth-input-password"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "register-password-error" : undefined}
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
            <p id="register-password-error" className="auth-error">
              <ExclamationCircleIcon />
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="auth-field">
          <Label htmlFor="confirmPassword" className="auth-label">
            Confirm password
          </Label>
          <div className="auth-control">
            <LockIcon className="auth-control-icon" />
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repeat password"
              className="auth-input auth-input-password"
              aria-invalid={errors.confirmPassword ? true : undefined}
              aria-describedby={errors.confirmPassword ? "register-confirm-error" : undefined}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              className="auth-eye"
              onClick={() => setShowConfirm((visible) => !visible)}
              aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"}
              aria-pressed={showConfirm}
            >
              {showConfirm ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="register-confirm-error" className="auth-error">
              <ExclamationCircleIcon />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="auth-submit"
      >
        {submitting ? "Creating account..." : "Create account"}
        {!submitting && <ArrowRightIcon />}
      </button>

      <div className="auth-divider">or continue with</div>

      <GoogleButton disabled={submitting} />

      <p className="auth-switch">
        Already have an account?
        <Link to="/login">Sign in</Link>
      </p>
    </form>
  );
}
