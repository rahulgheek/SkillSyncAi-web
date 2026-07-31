import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSocialLinksSchema, UpdateSocialLinksInput, ProfileResponse } from "../schemas";
import { updateSocialLinks } from "../api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, Globe } from "lucide-react";

export function SocialLinksForm({ profile }: { profile: ProfileResponse }) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateSocialLinksInput>({
    resolver: zodResolver(updateSocialLinksSchema),
    defaultValues: {
      linkedinUrl: profile.linkedinUrl || "",
      githubUrl: profile.githubUrl || "",
      portfolioUrl: profile.portfolioUrl || "",
    },
  });

  const mutation = useMutation({
    mutationFn: updateSocialLinks,
    onSuccess: () => {
      toast.success("Social links updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Failed to update social links");
    },
  });

  const onSubmit = (values: UpdateSocialLinksInput) => {
    mutation.mutate(values);
  };

  return (
    <Card className="shadow-lg border-secondary/20">
      <CardHeader className="bg-secondary/5 rounded-t-xl">
        <CardTitle className="text-xl text-secondary-foreground">Social Links</CardTitle>
        <CardDescription>Connect your professional profiles.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-[#0A66C2]" /> LinkedIn
            </Label>
            <Input id="linkedinUrl" type="url" {...register("linkedinUrl")} placeholder="https://linkedin.com/in/..." />
            {errors.linkedinUrl && <p className="text-sm text-destructive">{errors.linkedinUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl" className="flex items-center gap-2">
              <Github className="w-4 h-4" /> GitHub
            </Label>
            <Input id="githubUrl" type="url" {...register("githubUrl")} placeholder="https://github.com/..." />
            {errors.githubUrl && <p className="text-sm text-destructive">{errors.githubUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioUrl" className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" /> Portfolio Website
            </Label>
            <Input id="portfolioUrl" type="url" {...register("portfolioUrl")} placeholder="https://yourwebsite.com" />
            {errors.portfolioUrl && <p className="text-sm text-destructive">{errors.portfolioUrl.message}</p>}
          </div>

          <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            {mutation.isPending ? "Saving..." : "Save Links"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
