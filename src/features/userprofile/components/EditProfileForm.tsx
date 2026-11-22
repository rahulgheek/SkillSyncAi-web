import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRepeat } from "react-bootstrap-icons";
import { Switch } from "@/components/ui/switch";
import {
  updateBasicInfoSchema,
  UpdateBasicInfoInput,
  ProfileResponse,
} from "../schemas";
import { updateBasicInfo } from "../api";

export function EditProfileForm({ profile }: { profile: ProfileResponse }) {
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateBasicInfoInput>({
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
    <form onSubmit={handleSubmit(onSubmit)} className="dash-form">
      <div className="dash-switch-row">
        <div>
          <strong>Public profile</strong>
          <p>Make your profile visible in search and to other users.</p>
        </div>
        <Controller
          control={control}
          name="isPublic"
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      <div className="dash-field">
        <label className="dash-label" htmlFor="profile-full-name">
          Full name
        </label>
        <input id="profile-full-name" className="dash-input" {...register("fullName")} />
        {errors.fullName && <p className="dash-error">{errors.fullName.message}</p>}
      </div>

      <div className="dash-field">
        <label className="dash-label" htmlFor="profile-bio">
          Bio
        </label>
        <textarea
          id="profile-bio"
          className="dash-textarea"
          placeholder="Tell us about yourself..."
          {...register("bio")}
        />
        {errors.bio && <p className="dash-error">{errors.bio.message}</p>}
      </div>

      <div className="dash-form-grid">
        <div className="dash-field">
          <label className="dash-label" htmlFor="profile-major">
            Major
          </label>
          <input
            id="profile-major"
            className="dash-input"
            placeholder="e.g. Computer Science"
            {...register("major")}
          />
        </div>
        <div className="dash-field">
          <label className="dash-label" htmlFor="profile-grad-year">
            Graduation year
          </label>
          <input
            id="profile-grad-year"
            className="dash-input"
            type="number"
            {...register("graduationYear", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="dash-form-actions">
        <button type="submit" className="dash-btn dash-btn-solid" disabled={mutation.isPending}>
          {mutation.isPending && (
            <ArrowRepeat size={12} className="dash-icon-spin" aria-hidden="true" />
          )}
          Save changes
        </button>
      </div>
    </form>
  );
}
