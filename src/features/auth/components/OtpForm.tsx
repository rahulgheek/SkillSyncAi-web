import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { otpSchema, type OtpInput } from "../schemas";
import { verifyOtp, resendOtp } from "../api";
import { normalizeError } from "@/lib/api/errors";
import {
  ArrowRightIcon,
  ExclamationCircleIcon,
  MailIcon,
} from "./AuthIcons";

export function OtpForm({ defaultEmail }: { defaultEmail?: string }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startCooldown = () => {
    setCooldown(45);
    timerRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { email: defaultEmail ?? "", otp: "" },
  });

  const onSubmit = async (values: OtpInput) => {
    setSubmitting(true);
    try {
      const msg = await verifyOtp(values);
      toast.success(msg || "Account verified");
      navigate("/login");
    } catch (err) {
      const e = normalizeError(err);
      toast.error(e.message || "Verification failed");
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
            aria-describedby={errors.email ? "verify-email-error" : undefined}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p id="verify-email-error" className="auth-error">
            <ExclamationCircleIcon />
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="auth-field">
        <Label className="auth-label">Verification code</Label>
        <Controller
          control={control}
          name="otp"
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
              containerClassName="auth-otp"
              aria-label="Verification code"
              aria-describedby={errors.otp ? "verify-otp-error" : undefined}
            >
              <InputOTPGroup className="auth-otp-group">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} className="auth-otp-slot" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        {errors.otp && (
          <p id="verify-otp-error" className="auth-error">
            <ExclamationCircleIcon />
            {errors.otp.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting || resending}
        aria-busy={submitting}
        className="auth-submit"
      >
        {submitting ? "Verifying..." : "Verify account"}
        {!submitting && <ArrowRightIcon />}
      </button>

      <div className="auth-resend">
        <span>Didn't receive the code?</span>
        <button
          type="button"
          disabled={resending || submitting || cooldown > 0}
          onClick={async () => {
            const email = control._formValues.email;
            if (!email) {
              toast.error("Please enter an email address");
              return;
            }
            setResending(true);
            try {
              const msg = await resendOtp({ email });
              toast.success(msg || "OTP resent successfully");
              startCooldown();
            } catch (err) {
              const e = normalizeError(err);
              toast.error(e.message || "Failed to resend OTP");
            } finally {
              setResending(false);
            }
          }}
        >
          {resending ? "Resending..." : cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
        </button>
      </div>

      <p className="auth-switch">
        Remembered your password?
        <Link to="/login">Back to sign in</Link>
      </p>
    </form>
  );
}
