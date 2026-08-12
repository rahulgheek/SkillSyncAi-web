import { useState } from "react";
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
import { verifyOtp } from "../api";
import { normalizeError } from "@/lib/api/errors";
import { FadeIn } from "@/components/ui/animated/FadeIn";
import SpecularButton from "@/components/ui/react-bits/SpecularButton";

export function OtpForm({ defaultEmail }: { defaultEmail?: string }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
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
            disabled={submitting}
            className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/25 transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 flex items-center justify-center"
          >
            {submitting ? "Verifying..." : "Verify Account"}
          </button>
        </div>
      </FadeIn>
    </form>
  );
}
