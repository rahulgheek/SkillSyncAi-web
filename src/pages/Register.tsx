import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { FadeIn } from "@/components/ui/animated/FadeIn";

export function Register() {
  return (
    <div className="w-full">
      <div className="flex flex-col items-start mb-6">
        <FadeIn delay={0.2}>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1">
            Create an account
          </h1>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="text-sm text-muted-foreground font-medium">
            Join the community and start building.
          </p>
        </FadeIn>
      </div>

      <RegisterForm />
    </div>
  );
}
