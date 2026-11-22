import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowRepeat,
  PlusLg,
  Search,
  XLg,
} from "react-bootstrap-icons";
import { ProfileResponse } from "../schemas";
import { searchSkills, addSkill, removeSkill, Skill } from "../api";

export function SkillsManager({
  profile,
  isOwnProfile = true,
}: {
  profile: ProfileResponse;
  isOwnProfile?: boolean;
}) {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Skill[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [level, setLevel] = useState<string>("BEGINNER");

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2 && !selectedSkill) {
        setIsSearching(true);
        try {
          const res = await searchSkills(query);
          setResults(res);
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, selectedSkill]);

  const addMutation = useMutation({
    mutationFn: addSkill,
    onSuccess: () => {
      toast.success("Skill added successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setSelectedSkill(null);
      setQuery("");
      setLevel("BEGINNER");
    },
    onError: () => {
      toast.error("Failed to add skill");
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeSkill,
    onSuccess: () => {
      toast.success("Skill removed");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Failed to remove skill");
    },
  });

  const handleAddSkill = () => {
    if (!selectedSkill) {
      toast.error("Please select a skill from the dropdown");
      return;
    }
    addMutation.mutate({ skillId: selectedSkill.id, level });
  };

  return (
    <div className="dash-stack">
      <div className="dash-spread">
        <div>
          <h2 className="dash-mini-title">
            {isOwnProfile ? "Your skills" : "Skills"}
          </h2>
          <p className="dash-mini-sub">
            {isOwnProfile
              ? "Add the skills you are proficient in and let AI match you to projects."
              : `Skills that ${profile.fullName} is proficient in.`}
          </p>
        </div>
        <span className="dash-badge dash-badge-soft">
          {profile.skills?.length || 0} listed
        </span>
      </div>

      {isOwnProfile && (
        <div className="dash-searchbar" style={{ alignItems: "flex-start" }}>
          <div className="dash-input-wrap">
            <Search size={12} aria-hidden="true" />
            <input
              className="dash-input"
              placeholder="Search for a skill (e.g. React, Java)..."
              value={selectedSkill ? selectedSkill.name : query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (selectedSkill) setSelectedSkill(null);
              }}
              aria-label="Search skills"
            />
            {isSearching && (
              <span className="dash-input-action">
                <ArrowRepeat size={12} className="dash-icon-spin" aria-hidden="true" />
              </span>
            )}
            {selectedSkill && (
              <button
                type="button"
                className="dash-input-action"
                aria-label="Clear selected skill"
                onClick={() => {
                  setSelectedSkill(null);
                  setQuery("");
                }}
              >
                <XLg size={10} aria-hidden="true" />
              </button>
            )}

            {results.length > 0 && !selectedSkill && (
              <div className="dash-suggest">
                {results.map((skill) => (
                  <button
                    type="button"
                    key={skill.id}
                    onClick={() => {
                      setSelectedSkill(skill);
                      setResults([]);
                    }}
                  >
                    {skill.name}
                    <small>{skill.category}</small>
                  </button>
                ))}
              </div>
            )}
          </div>

          <select
            className="dash-select"
            style={{ maxWidth: 168 }}
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            aria-label="Skill proficiency"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>

          <button
            type="button"
            className="dash-btn dash-btn-solid"
            onClick={handleAddSkill}
            disabled={!selectedSkill || addMutation.isPending}
          >
            {addMutation.isPending ? (
              <ArrowRepeat size={12} className="dash-icon-spin" aria-hidden="true" />
            ) : (
              <PlusLg size={12} aria-hidden="true" />
            )}
            Add skill
          </button>
        </div>
      )}

      {(!profile.skills || profile.skills.length === 0) && (
        <div className="dash-empty-inline dash-panel-soft">
          <p>
            No skills added yet. Add a few to boost your profile and sharpen your
            project matches.
          </p>
        </div>
      )}

      <div className="dash-tag-row">
        {profile.skills?.map((skill) => (
          <span key={skill.studentSkillId} className="dash-tag">
            {skill.name}
            <span style={{ opacity: 0.62, letterSpacing: "0.02em" }}>
              {skill.level}
            </span>
            {isOwnProfile && (
              <button
                type="button"
                className="dash-tag-remove"
                aria-label={`Remove ${skill.name}`}
                onClick={() => {
                  if (skill.studentSkillId) {
                    removeMutation.mutate(skill.studentSkillId);
                  }
                }}
                disabled={removeMutation.isPending || !skill.studentSkillId}
              >
                <XLg size={9} aria-hidden="true" />
              </button>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
