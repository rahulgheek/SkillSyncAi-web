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
import { FadeIn } from "@/components/ui/animated/FadeIn";
import SpecularButton from "@/components/ui/react-bits/SpecularButton";

export function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = { redirect: searchParams.get("redirect") || undefined };
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

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

      <FadeIn delay={0.5}>
        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <Label htmlFor="password" className="text-sm font-bold text-foreground">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:text-primary/80 transition-colors font-bold"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
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
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/25 transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 flex items-center justify-center"
          >
            {submitting ? "Signing in..." : "Sign In to SkillSync"}
          </button>
        </div>
      </FadeIn>

      <FadeIn delay={0.7}>
        <div className="relative py-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest font-extrabold">
            <span className="bg-white px-4 text-muted-foreground">or continue with</span>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.8}>
        <div className="hover:-translate-y-0.5 active:translate-y-0 transition-transform duration-300">
          <GoogleButton disabled={submitting} />
        </div>
      </FadeIn>

      <FadeIn delay={0.9}>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm font-medium">
          <span className="text-muted-foreground">Don't have one?</span>
          <Link to="/register" className="font-extrabold text-primary hover:text-primary/80 transition-colors bg-primary/5 px-4 py-2 rounded-lg">
            Create an account
          </Link>
        </div>
      </FadeIn>
    </form>
  );
}
