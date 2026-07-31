import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../auth/context";
import {
  createProjectDraft,
  addProjectRole,
  publishProject,
  CreateProjectRequest,
  CreateProjectRoleRequest,
} from "../api";
import { searchSkills } from "../../userprofile/api";
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, Loader2 } from "lucide-react";

type WizardStep = "BASIC_INFO" | "DEFINE_ROLES" | "REVIEW";

const CreateProjectWizard: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [step, setStep] = useState<WizardStep>("BASIC_INFO");
  const [projectId, setProjectId] = useState<string | null>(null);

  // Step 1 State
  const [basicInfo, setBasicInfo] = useState<CreateProjectRequest>({
    title: "",
    description: "",
    maxTeamSize: 2,
    applicationDeadline: "",
  });

  // Step 2 State
  const [roles, setRoles] = useState<CreateProjectRoleRequest[]>([]);
  const [currentRole, setCurrentRole] = useState<CreateProjectRoleRequest>({
    title: "",
    description: "",
    headcount: 1,
    requiredSkills: [],
  });

  // Skill Search State
  const [skillQuery, setSkillQuery] = useState("");
  const [skillResults, setSkillResults] = useState<any[]>([]);
  const [isSearchingSkills, setIsSearchingSkills] = useState(false);
  const [selectedProficiency, setSelectedProficiency] = useState("Beginner");

  const createDraftMutation = useMutation({
    mutationFn: (data: CreateProjectRequest) => createProjectDraft(data),
    onSuccess: (data) => {
      setProjectId(data.id);
      setStep("DEFINE_ROLES");
    },
    onError: (err) => {
      console.error("Failed to create draft", err);
      alert("Failed to create draft project. Please try again.");
    }
  });

  const addRoleMutation = useMutation({
    mutationFn: (data: CreateProjectRoleRequest) => addProjectRole(projectId!, data),
  });

  const publishMutation = useMutation({
    mutationFn: () => publishProject(projectId!),
    onSuccess: () => {
      navigate("/dashboard");
    },
    onError: (err: any) => {
      console.error("Failed to publish", err);
      alert(err.response?.data?.message || "Failed to publish project.");
    }
  });

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (basicInfo.title.trim() === "" || basicInfo.maxTeamSize < 2) return;
    
    // Format deadline to ISO if provided
    let data = { ...basicInfo };
    if (data.applicationDeadline) {
      data.applicationDeadline = new Date(data.applicationDeadline).toISOString();
    } else {
      delete data.applicationDeadline;
    }
    
    createDraftMutation.mutate(data);
  };

  const handleSkillSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSkillQuery(q);
    if (q.length < 2) {
      setSkillResults([]);
      return;
    }
    setIsSearchingSkills(true);
    try {
      const res = await searchSkills(q);
      setSkillResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingSkills(false);
    }
  };

  const handleAddSkill = (skill: any) => {
    setCurrentRole({
      ...currentRole,
      requiredSkills: [
        ...currentRole.requiredSkills,
        {
          skillId: skill.id,
          skillName: skill.name,
          minimumLevel: selectedProficiency,
        },
      ],
    });
    setSkillQuery("");
    setSkillResults([]);
  };

  const handleRemoveSkill = (skillId: string) => {
    setCurrentRole({
      ...currentRole,
      requiredSkills: currentRole.requiredSkills.filter((s) => s.skillId !== skillId),
    });
  };

  const handleAddRole = () => {
    if (currentRole.title.trim() === "" || currentRole.headcount < 1) return;
    
    const currentTotalHeadcount = roles.reduce((sum, r) => sum + r.headcount, 0);
    if (currentTotalHeadcount + currentRole.headcount + 1 > basicInfo.maxTeamSize) {
      alert(`Cannot add role. Total roles headcount + 1 (Owner) must not exceed Max Team Size (${basicInfo.maxTeamSize}).`);
      return;
    }

    setRoles([...roles, currentRole]);
    setCurrentRole({
      title: "",
      description: "",
      headcount: 1,
      requiredSkills: [],
    });
  };

  const handleRemoveRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleRolesSubmit = async () => {
    if (roles.length === 0) {
      alert("Please add at least one role to the project.");
      return;
    }
    setStep("REVIEW");
  };

  const handlePublish = async () => {
    if (!projectId) {
      alert("Project ID is missing. Please go back and recreate the draft project.");
      return;
    }
    try {
      // First, add all roles sequentially
      for (const role of roles) {
        await addRoleMutation.mutateAsync(role);
      }
      // Then publish
      publishMutation.mutate();
    } catch (err) {
      console.error("Error during publishing flow", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Create New Project</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 sm:p-8">
        
        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {["Basic Info", "Define Roles", "Review & Publish"].map((label, idx) => {
            const stepName = idx === 0 ? "BASIC_INFO" : idx === 1 ? "DEFINE_ROLES" : "REVIEW";
            const isActive = step === stepName;
            const isCompleted = 
              (idx === 0 && (step === "DEFINE_ROLES" || step === "REVIEW")) ||
              (idx === 1 && step === "REVIEW");
            
            return (
              <div key={label} className="flex flex-col items-center relative z-10 flex-1">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors ${
                    isActive ? "bg-indigo-600 text-white shadow-md ring-4 ring-indigo-100" :
                    isCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
                </div>
                <span className={`text-sm font-medium ${isActive ? "text-indigo-900" : "text-gray-500"}`}>
                  {label}
                </span>
                
                {/* Connector Line */}
                {idx < 2 && (
                  <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-10 ${
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step 1: Basic Info */}
        {step === "BASIC_INFO" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Details</h2>
            <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
                <input
                  type="text"
                  required
                  value={basicInfo.title}
                  onChange={(e) => setBasicInfo({ ...basicInfo, title: e.target.value })}
                  placeholder="e.g. NextGen E-Commerce Platform"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={basicInfo.description}
                  onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                  placeholder="What is this project about? What are the goals?"
                  rows={4}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Team Size *</label>
                  <input
                    type="number"
                    required
                    min={2}
                    value={basicInfo.maxTeamSize}
                    onChange={(e) => setBasicInfo({ ...basicInfo, maxTeamSize: parseInt(e.target.value) || 2 })}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">Includes you (the owner).</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                  <input
                    type="date"
                    value={basicInfo.applicationDeadline}
                    onChange={(e) => setBasicInfo({ ...basicInfo, applicationDeadline: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={createDraftMutation.isPending}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {createDraftMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue to Roles"}
                  {!createDraftMutation.isPending && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Define Roles */}
        {step === "DEFINE_ROLES" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            
            {/* Added Roles List */}
            {roles.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" /> Roles Added ({roles.length})
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {roles.map((role, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200 relative group">
                      <button 
                        onClick={() => handleRemoveRole(idx)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <h4 className="font-semibold text-gray-900">{role.title}</h4>
                      <p className="text-sm text-gray-600 mb-2 mt-1 line-clamp-2">{role.description || "No description"}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {role.requiredSkills.map(s => (
                          <span key={s.skillId} className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
                            {s.skillName} • {s.minimumLevel}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border inline-block">
                        Headcount: {role.headcount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Role Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Define a Role</h2>
              <p className="text-gray-500 mb-6 text-sm">Add roles to your team. Total headcount must fit within your max team size of {basicInfo.maxTeamSize}.</p>
              
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role Title *</label>
                    <input
                      type="text"
                      value={currentRole.title}
                      onChange={(e) => setCurrentRole({ ...currentRole, title: e.target.value })}
                      placeholder="e.g. Frontend Developer"
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Headcount *</label>
                    <input
                      type="number"
                      min={1}
                      value={currentRole.headcount}
                      onChange={(e) => setCurrentRole({ ...currentRole, headcount: parseInt(e.target.value) || 1 })}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role Responsibilities</label>
                  <textarea
                    value={currentRole.description}
                    onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
                    placeholder="What will this person be doing?"
                    rows={2}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                  />
                </div>

                {/* Skills Search */}
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Required Skills</label>
                  
                  {currentRole.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentRole.requiredSkills.map(skill => (
                        <div key={skill.skillId} className="flex items-center bg-white border border-indigo-200 rounded-lg px-3 py-1.5 shadow-sm">
                          <div className="flex flex-col mr-3">
                            <span className="text-sm font-bold text-gray-900">{skill.skillName}</span>
                            <span className="text-xs text-indigo-600 font-medium">{skill.minimumLevel}</span>
                          </div>
                          <button 
                            onClick={() => handleRemoveSkill(skill.skillId)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end gap-3 relative z-20">
                    <div className="flex-1 relative">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Search Skill</label>
                      <input
                        type="text"
                        value={skillQuery}
                        onChange={handleSkillSearch}
                        placeholder="Type to search skills..."
                        className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                      />
                      
                      {/* Search Results Dropdown */}
                      {skillResults.length > 0 && skillQuery.length >= 2 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-50">
                          {skillResults.map(skill => (
                            <button
                              key={skill.id}
                              type="button"
                              onClick={() => handleAddSkill(skill)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 focus:bg-indigo-50 outline-none transition-colors border-b border-gray-100 last:border-0"
                            >
                              <span className="font-medium text-gray-900">{skill.name}</span>
                              <span className="text-xs text-gray-500 ml-2 block">{skill.category}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {isSearchingSkills && (
                        <div className="absolute right-3 top-8">
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="w-40">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Min Level</label>
                      <select
                        value={selectedProficiency}
                        onChange={(e) => setSelectedProficiency(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleAddRole}
                    disabled={currentRole.title.trim() === ""}
                    className="flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" /> Add Role
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep("BASIC_INFO")}
                className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleRolesSubmit}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2"
              >
                Review Project <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === "REVIEW" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">{basicInfo.title}</h2>
                <p className="text-indigo-100 max-w-2xl">{basicInfo.description}</p>
                <div className="flex gap-6 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium">
                    Max Team Size: {basicInfo.maxTeamSize}
                  </div>
                  {basicInfo.applicationDeadline && (
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium">
                      Deadline: {new Date(basicInfo.applicationDeadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Defined Roles ({roles.length})</h3>
                <div className="space-y-6">
                  {roles.map((role, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-4 justify-between bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{role.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {role.requiredSkills.map(s => (
                            <span key={s.skillId} className="inline-flex items-center px-2 py-1 rounded bg-white border border-gray-200 text-gray-700 text-xs font-medium shadow-sm">
                              {s.skillName} <span className="text-indigo-500 ml-1">({s.minimumLevel})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center min-w-[100px]">
                        <span className="text-3xl font-bold text-indigo-600">{role.headcount}</span>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Openings</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setStep("DEFINE_ROLES")}
                className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                disabled={addRoleMutation.isPending || publishMutation.isPending}
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={addRoleMutation.isPending || publishMutation.isPending}
                className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {(addRoleMutation.isPending || publishMutation.isPending) ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Check className="w-6 h-6" /> Publish Project
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default CreateProjectWizard;
