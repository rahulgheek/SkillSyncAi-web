import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import { updateBasicInfoSchema, type UpdateBasicInfoInput } from "@/features/userprofile/schemas";
import { createProfile } from "@/features/userprofile/api";
import { Sparkles } from "lucide-react";
import { normalizeError } from "@/lib/api/errors";

export function Onboarding() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateBasicInfoInput>({
    resolver: zodResolver(updateBasicInfoSchema),
  });

  const onSubmit = async (values: UpdateBasicInfoInput) => {
    setSubmitting(true);
    try {
      await createProfile(values);
      toast.success("Profile created successfully!");
      navigate("/profile");
    } catch (err) {
      const e = normalizeError(err);
      toast.error(e.message || "Failed to create profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-border shadow-xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto bg-black h-12 w-12 rounded-2xl flex items-center justify-center shadow-md">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome to SkillSync AI</CardTitle>
            <CardDescription className="text-base mt-2">
              Let's set up your professional profile to get started.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="John Doe" {...register("fullName")} className="bg-gray-50" />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="major">University / Major</Label>
              <Input id="major" placeholder="B.S. Computer Science" {...register("major")} className="bg-gray-50" />
              {errors.major && <p className="text-sm text-destructive">{errors.major.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                type="number"
                placeholder="2026"
                {...register("graduationYear", { valueAsNumber: true })}
                className="bg-gray-50"
              />
              {errors.graduationYear && <p className="text-sm text-destructive">{errors.graduationYear.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea 
                id="bio" 
                placeholder="Passionate about building scalable web applications..."
                className="resize-none bg-gray-50 h-24"
                {...register("bio")}
              />
              {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
            </div>

            <Button type="submit" className="w-full h-11 text-base rounded-lg mt-4" disabled={submitting}>
              {submitting ? "Creating Profile..." : "Complete Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
