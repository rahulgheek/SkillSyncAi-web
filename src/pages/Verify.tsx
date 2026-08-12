import { useSearchParams } from "react-router-dom";
import { OtpForm } from "@/features/auth/components/OtpForm";
import { FadeIn } from "@/components/ui/animated/FadeIn";

export function Verify() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="w-full">
      <div className="flex flex-col items-start mb-6">
        <FadeIn delay={0.2}>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1">
            Verify email
          </h1>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="text-sm text-muted-foreground font-medium">
            {email ? `Enter the code sent to ${email}` : "Enter your code to continue."}
          </p>
        </FadeIn>
      </div>

      <OtpForm defaultEmail={email} />
    </div>
  );
}
