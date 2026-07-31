import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Verification code</Label>
        <Controller
          control={control}
          name="otp"
          render={({ field }) => (
            <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        {errors.otp && <p className="text-sm text-destructive">{errors.otp.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Verifying…" : "Verify"}
      </Button>
    </form>
  );
}
