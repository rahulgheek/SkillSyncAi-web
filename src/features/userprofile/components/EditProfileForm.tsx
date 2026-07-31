import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import { Switch } from "@/components/ui/switch";
import { updateBasicInfoSchema, UpdateBasicInfoInput, ProfileResponse } from "../schemas";
import { updateBasicInfo } from "../api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EditProfileForm({ profile }: { profile: ProfileResponse }) {
  const queryClient = useQueryClient();

  const { register, control, handleSubmit, formState: { errors } } = useForm<UpdateBasicInfoInput>({
    resolver: zodResolver(updateBasicInfoSchema),
    defaultValues: {
      fullName: profile.fullName || "",
      bio: profile.bio || "",
      major: profile.major || "",
      graduationYear: profile.graduationYear || new Date().getFullYear(),
      isPublic: profile.isPublic ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: updateBasicInfo,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const onSubmit = (values: UpdateBasicInfoInput) => {
    mutation.mutate(values);
  };

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="bg-primary/5 rounded-t-xl">
        <CardTitle className="text-xl text-primary">Basic Information</CardTitle>
        <CardDescription>Update your personal details, privacy, and academic info.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Public Profile</Label>
              <p className="text-sm text-muted-foreground">Make your profile visible in search and to other users.</p>
            </div>
            <Controller
              control={control}
              name="isPublic"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" {...register("bio")} placeholder="Tell us about yourself..." className="min-h-[100px]" />
            {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="major">Major</Label>
              <Input id="major" {...register("major")} placeholder="e.g. Computer Science" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input id="graduationYear" type="number" {...register("graduationYear", { valueAsNumber: true })} />
            </div>
          </div>

          <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
