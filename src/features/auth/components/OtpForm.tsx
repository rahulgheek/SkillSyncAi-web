import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
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
import { FadeIn } from "@/components/ui/animated/FadeIn";
import SpecularButton from "@/components/ui/react-bits/SpecularButton";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <FadeIn delay={0.4}>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-bold text-foreground ml-1">Email Address</Label>
          <Input
            id="email"
            type="email"
            className="bg-gray-50/50 border-gray-200 text-foreground font-medium placeholder:text-muted-foreground focus-visible:bg-white focus-visible:ring-primary/20 focus-visible:border-primary shadow-sm h-11 rounded-xl transition-all duration-300"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive font-medium ml-1">{errors.email.message}</p>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.5}>
        <div className="space-y-2">
          <Label className="text-sm font-bold text-foreground ml-1">Verification code</Label>
          <div className="pt-1 pb-1 flex justify-center">
            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                  <InputOTPGroup className="gap-2 sm:gap-3">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="bg-gray-50/50 border border-gray-200 text-foreground font-bold text-lg rounded-xl h-12 w-10 sm:h-14 sm:w-12 transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
          </div>
          {errors.otp && <p className="text-xs text-destructive font-medium ml-1">{errors.otp.message}</p>}
        </div>
      </FadeIn>

      <FadeIn delay={0.6}>
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting || resending}
            className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/25 transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 flex items-center justify-center"
          >
            {submitting ? "Verifying..." : "Verify Account"}
          </button>
        </div>
      </FadeIn>

      <FadeIn delay={0.7}>
        <div className="pt-4 flex flex-col items-center justify-center gap-2 text-sm font-medium">
          <span className="text-muted-foreground">Didn't receive the code?</span>
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
            className="font-extrabold text-primary hover:text-primary/80 transition-colors bg-primary/5 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? "Resending..." : cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
          </button>
        </div>
      </FadeIn>
    </form>
  );
}
