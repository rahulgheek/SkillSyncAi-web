import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OtpForm } from "@/features/auth/components/OtpForm";

export function Verify() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
        <CardDescription className="text-base">
          {email ? `Enter the verification code sent to ${email}` : "Enter your email and verification code"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OtpForm defaultEmail={email} />
      </CardContent>
    </Card>
  );
}
