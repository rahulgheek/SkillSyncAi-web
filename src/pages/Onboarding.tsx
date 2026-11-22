import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRepeat, Stars } from "react-bootstrap-icons";
import {
  updateBasicInfoSchema,
  type UpdateBasicInfoInput,
} from "@/features/userprofile/schemas";
import { createProfile } from "@/features/userprofile/api";
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
    <div className="dash-page" style={{ maxWidth: 620, marginInline: "auto" }}>
      <div className="dash-onboarding-card">
        <div className="dash-onboarding-head">
          <span className="dash-onboarding-mark">
            <Stars size={16} aria-hidden="true" />
          </span>
          <h1>Welcome to SkillSync</h1>
          <p>
            Set up your student profile so the right teams can find you. You can
            refine everything later.
          </p>
        </div>

        <div className="dash-onboarding-body">
          <form onSubmit={handleSubmit(onSubmit)} className="dash-form">
            <div className="dash-field">
              <label className="dash-label" htmlFor="onboarding-name">
                Full name
              </label>
              <input
                id="onboarding-name"
                className="dash-input"
                placeholder="John Doe"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="dash-error">{errors.fullName.message}</p>
              )}
            </div>

            <div className="dash-field">
              <label className="dash-label" htmlFor="onboarding-major">
                University / major
              </label>
              <input
                id="onboarding-major"
                className="dash-input"
                placeholder="B.S. Computer Science"
                {...register("major")}
              />
              {errors.major && <p className="dash-error">{errors.major.message}</p>}
            </div>

            <div className="dash-field">
              <label className="dash-label" htmlFor="onboarding-year">
                Graduation year
              </label>
              <input
                id="onboarding-year"
                className="dash-input"
                type="number"
                placeholder="2026"
                {...register("graduationYear", { valueAsNumber: true })}
              />
              {errors.graduationYear && (
                <p className="dash-error">{errors.graduationYear.message}</p>
              )}
            </div>

            <div className="dash-field">
              <label className="dash-label" htmlFor="onboarding-bio">
                Bio / about you
              </label>
              <textarea
                id="onboarding-bio"
                className="dash-textarea"
                placeholder="Tell us about your interests, hackathons, and what you love building..."
                {...register("bio")}
              />
              {errors.bio && <p className="dash-error">{errors.bio.message}</p>}
            </div>

            <div className="dash-form-actions">
              <button
                type="submit"
                className="dash-btn dash-btn-solid dash-btn-lg dash-btn-full"
                disabled={submitting}
              >
                {submitting && (
                  <ArrowRepeat size={13} className="dash-icon-spin" aria-hidden="true" />
                )}
                {submitting ? "Saving profile" : "Complete setup"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
