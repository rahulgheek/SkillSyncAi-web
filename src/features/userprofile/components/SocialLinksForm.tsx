import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRepeat, Github, Globe2, Linkedin } from "react-bootstrap-icons";
import {
  updateSocialLinksSchema,
  UpdateSocialLinksInput,
  ProfileResponse,
} from "../schemas";
import { updateSocialLinks } from "../api";

export function SocialLinksForm({ profile }: { profile: ProfileResponse }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateSocialLinksInput>({
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
    <form onSubmit={handleSubmit(onSubmit)} className="dash-form">
      <div className="dash-field">
        <label className="dash-label" htmlFor="social-linkedin">
          <Linkedin size={11} aria-hidden="true" /> LinkedIn
        </label>
        <input
          id="social-linkedin"
          className="dash-input"
          type="url"
          placeholder="https://linkedin.com/in/..."
          {...register("linkedinUrl")}
        />
        {errors.linkedinUrl && (
          <p className="dash-error">{errors.linkedinUrl.message}</p>
        )}
      </div>

      <div className="dash-field">
        <label className="dash-label" htmlFor="social-github">
          <Github size={11} aria-hidden="true" /> GitHub
        </label>
        <input
          id="social-github"
          className="dash-input"
          type="url"
          placeholder="https://github.com/..."
          {...register("githubUrl")}
        />
        {errors.githubUrl && <p className="dash-error">{errors.githubUrl.message}</p>}
      </div>

      <div className="dash-field">
        <label className="dash-label" htmlFor="social-portfolio">
          <Globe2 size={11} aria-hidden="true" /> Portfolio website
        </label>
        <input
          id="social-portfolio"
          className="dash-input"
          type="url"
          placeholder="https://yourwebsite.com"
          {...register("portfolioUrl")}
        />
        {errors.portfolioUrl && (
          <p className="dash-error">{errors.portfolioUrl.message}</p>
        )}
      </div>

      <div className="dash-form-actions">
        <button type="submit" className="dash-btn dash-btn-solid" disabled={mutation.isPending}>
          {mutation.isPending && (
            <ArrowRepeat size={12} className="dash-icon-spin" aria-hidden="true" />
          )}
          Save links
        </button>
      </div>
    </form>
  );
}
