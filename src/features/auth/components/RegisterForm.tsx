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
import { FadeIn } from "@/components/ui/animated/FadeIn";
import SpecularButton from "@/components/ui/react-bits/SpecularButton";

export function RegisterForm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <FadeIn delay={0.4}>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-bold text-foreground ml-1">Email Address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="bg-gray-50/50 border-gray-200 text-foreground font-medium placeholder:text-muted-foreground focus-visible:bg-white focus-visible:ring-primary/20 focus-visible:border-primary shadow-sm h-11 rounded-xl transition-all duration-300"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive font-medium ml-1">{errors.email.message}</p>
          )}
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FadeIn delay={0.5}>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-bold text-foreground ml-1">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="bg-gray-50/50 border-gray-200 text-foreground font-medium placeholder:text-muted-foreground focus-visible:bg-white focus-visible:ring-primary/20 focus-visible:border-primary shadow-sm h-11 rounded-xl transition-all duration-300"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive font-medium ml-1">{errors.password.message}</p>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.6}>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-bold text-foreground ml-1">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="bg-gray-50/50 border-gray-200 text-foreground font-medium placeholder:text-muted-foreground focus-visible:bg-white focus-visible:ring-primary/20 focus-visible:border-primary shadow-sm h-11 rounded-xl transition-all duration-300"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive font-medium ml-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.7}>
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/25 transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 flex items-center justify-center"
          >
            {submitting ? "Creating account..." : "Create your account"}
          </button>
        </div>
      </FadeIn>

      <FadeIn delay={0.8}>
        <div className="relative py-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest font-extrabold">
            <span className="bg-white px-4 text-muted-foreground">or continue with</span>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.9}>
        <div className="hover:-translate-y-0.5 active:translate-y-0 transition-transform duration-300">
          <GoogleButton disabled={submitting} />
        </div>
      </FadeIn>

      <FadeIn delay={1.0}>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm font-medium">
          <span className="text-muted-foreground">Already have one?</span>
          <Link to="/login" className="font-extrabold text-primary hover:text-primary/80 transition-colors bg-primary/5 px-4 py-2 rounded-lg">
            Sign in
          </Link>
        </div>
      </FadeIn>
    </form>
  );
}
