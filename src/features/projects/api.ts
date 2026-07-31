import { api } from "@/lib/api/axios";

// --- Interfaces ---

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface RequiredSkill {
  skillId: string;
  skillName: string;
  minimumLevel: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  maxTeamSize: number;
  applicationDeadline?: string; // ISO 8601 string
}

export interface CreateProjectRoleRequest {
  title: string;
  description?: string;
  requiredSkills: RequiredSkill[];
  headcount: number;
}

export interface ProjectResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  maxTeamSize: number;
  applicationDeadline: string;
  ownerId: string;
  requiredSkills: RequiredSkill[];
}

export interface OwnerInfo {
  name: string;
  profilePictureUrl?: string;
  department?: string;
  graduationYear?: number;
}

export interface ProjectDetailsResponse {
  id: string;
  ownerId: string;
  collegeId: string;
  title: string;
  description: string;
  status: string;
  requiredSkills: RequiredSkill[];
  maxTeamSize: number;
  currentMemberCount: number;
  applicationDeadline?: string;
  createdAt: string;
  owner?: OwnerInfo;
}

export interface ProjectRoleResponse {
  id: string;
  projectId: string;
  title: string;
  description: string;
  requiredSkills: RequiredSkill[];
  headcount: number;
}

export interface TeamMemberResponse {
  id: string;
  userId: string;
  roleId?: string;
  roleTitle?: string;
  status: string;
  joinedAt: string;
  name: string;
  profilePictureUrl?: string;
  department?: string;
  graduationYear?: number;
  topSkills: string[];
}

// --- API Methods ---

export const createProjectDraft = async (
  data: CreateProjectRequest
): Promise<ProjectResponse> => {
  const response = await api.post<ApiResponse<ProjectResponse>>("/api/v1/projects", data);
  return response.data.data;
};

export const addProjectRole = async (
  projectId: string,
  data: CreateProjectRoleRequest
): Promise<ProjectRoleResponse> => {
  const response = await api.post<ApiResponse<ProjectRoleResponse>>(`/api/v1/projects/${projectId}/roles`, data);
  return response.data.data;
};

export const publishProject = async (
  projectId: string
): Promise<ProjectResponse> => {
  const response = await api.post<ApiResponse<ProjectResponse>>(`/api/v1/projects/${projectId}/publish`);
  return response.data.data;
};

export const deleteProject = async (
  projectId: string
): Promise<void> => {
  await api.delete(`/api/v1/projects/${projectId}`);
};

// --- Page Interface for Spring Data Paginated Responses ---
export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// --- Feed & Application Methods ---

export const getRecruitingFeed = async (page = 0, size = 20): Promise<Page<ProjectResponse>> => {
  const response = await api.get<ApiResponse<Page<ProjectResponse>>>(`/api/v1/projects/feed?page=${page}&size=${size}`);
  return response.data.data;
};

export const getMyProjects = async (page = 0, size = 20): Promise<Page<ProjectResponse>> => {
  const response = await api.get<ApiResponse<Page<ProjectResponse>>>(`/api/v1/projects/me?page=${page}&size=${size}`);
  return response.data.data;
};

export const getProjectDetails = async (projectId: string): Promise<ProjectDetailsResponse> => {
  const response = await api.get<ApiResponse<ProjectDetailsResponse>>(`/api/v1/projects/${projectId}`);
  return response.data.data;
};

export const getProjectRoles = async (projectId: string): Promise<ProjectRoleResponse[]> => {
  const response = await api.get<ApiResponse<ProjectRoleResponse[]>>(`/api/v1/projects/${projectId}/roles`);
  return response.data.data;
};

export const getProjectMembers = async (projectId: string): Promise<TeamMemberResponse[]> => {
  const response = await api.get<ApiResponse<TeamMemberResponse[]>>(`/api/v1/projects/${projectId}/members`);
  return response.data.data;
};

export const removeMember = async (projectId: string, memberUserId: string): Promise<void> => {
  await api.delete<ApiResponse<void>>(`/api/v1/projects/${projectId}/members/${memberUserId}`);
};

export const leaveProject = async (projectId: string): Promise<void> => {
  await api.post<ApiResponse<void>>(`/api/v1/projects/${projectId}/leave`);
};

export const transferOwnership = async (projectId: string, newOwnerId: string): Promise<ProjectResponse> => {
  const response = await api.patch<ApiResponse<ProjectResponse>>(`/api/v1/projects/${projectId}/owner`, { newOwnerId });
  return response.data.data;
};

export interface ApplicationRequest {
  projectId: string;
  projectRoleId?: string;
  coverMessage?: string;
}

export interface ApplicationResponse {
  id: string;
  projectId: string;
  projectRoleId?: string;
  roleTitle?: string;
  userId: string;
  status: string;
  coverMessage: string;
  createdAt: string;
  applicantName: string;
  applicantProfilePictureUrl?: string;
  applicantDepartment?: string;
  applicantGraduationYear?: number;
  applicantTopSkills: string[];
}

export const applyToProject = async (data: ApplicationRequest): Promise<ApplicationResponse> => {
  const response = await api.post<ApiResponse<ApplicationResponse>>(`/api/v1/applications`, data);
  return response.data.data;
};

export const getProjectApplications = async (projectId: string): Promise<ApplicationResponse[]> => {
  const response = await api.get<ApiResponse<ApplicationResponse[]>>(`/api/v1/applications/project/${projectId}`);
  return response.data.data;
};

export const getMyApplications = async (): Promise<ApplicationResponse[]> => {
  const response = await api.get<ApiResponse<ApplicationResponse[]>>(`/api/v1/applications/me`);
  return response.data.data;
};

export const approveApplication = async (requestId: string): Promise<ApplicationResponse> => {
  const response = await api.post<ApiResponse<ApplicationResponse>>(`/api/v1/applications/${requestId}/decide`, { accept: true });
  return response.data.data;
};

export const rejectApplication = async (requestId: string): Promise<ApplicationResponse> => {
  const response = await api.post<ApiResponse<ApplicationResponse>>(`/api/v1/applications/${requestId}/decide`, { accept: false });
  return response.data.data;
};

export const cancelApplication = async (requestId: string): Promise<void> => {
  await api.post<ApiResponse<void>>(`/api/v1/applications/${requestId}/withdraw`);
};

// --- Recommendation Methods ---

export interface RecommendationResponse {
  id: string;
  projectId: string;
  userId: string;
  status: string;
  semanticScore: number;
  finalScore: number;
  confidence: string;
  matchedSkills: string[];
  rationale: string;
  generatedAt: string;
  expiresAt: string;
}

export const getProjectRecommendations = async (projectId: string, page = 0, size = 10): Promise<Page<RecommendationResponse>> => {
  const response = await api.get<ApiResponse<Page<RecommendationResponse>>>(`/api/v1/matching/dashboard/projects/${projectId}/recommendations?page=${page}&size=${size}`);
  return response.data.data;
};

export const generateProjectRecommendations = async (projectId: string): Promise<void> => {
  await api.post<ApiResponse<void>>(`/api/v1/matching/dashboard/projects/${projectId}/generate`);
};

export interface StudentProjectRecommendationResponse {
  id: string;
  projectId: string;
  projectTitle: string;
  projectDescription: string;
  userId: string;
  semanticScore: number;
  finalScore: number;
  confidence: string;
  matchedSkills: string[];
  rationale: string;
  status: string;
  expiresAt: string;
}

export const getStudentRecommendations = async (page = 0, size = 10): Promise<Page<StudentProjectRecommendationResponse>> => {
  const response = await api.get<ApiResponse<Page<StudentProjectRecommendationResponse>>>(`/api/v1/matching/dashboard/me/recommendations?page=${page}&size=${size}`);
  return response.data.data;
};

export const generateStudentRecommendations = async (): Promise<void> => {
  await api.post<ApiResponse<void>>(`/api/v1/matching/dashboard/me/recommendations/generate`);
};

// --- Invitation Methods ---

export interface InvitationRequest {
  projectId: string;
  projectRoleId?: string;
  invitedUserId: string;
  message?: string;
}

export interface InvitationResponse {
  id: string;
  projectId: string;
  projectRoleId?: string;
  roleTitle?: string;
  invitedUserId: string;
  invitedBy: string;
  status: string;
  message: string;
  createdAt: string;
  expiresAt: string;
  respondedAt?: string;
  invitedUserName: string;
  invitedUserProfilePictureUrl?: string;
  invitedUserDepartment?: string;
  invitedUserGraduationYear?: number;
  invitedUserTopSkills: string[];
}

export const inviteStudent = async (data: InvitationRequest): Promise<InvitationResponse> => {
  const response = await api.post<ApiResponse<InvitationResponse>>(`/api/v1/invitations`, data);
  return response.data.data;
};

export const getProjectInvitations = async (projectId: string): Promise<InvitationResponse[]> => {
  const response = await api.get<ApiResponse<InvitationResponse[]>>(`/api/v1/invitations/project/${projectId}`);
  return response.data.data;
};

export const getMyInvitations = async (): Promise<InvitationResponse[]> => {
  const response = await api.get<ApiResponse<InvitationResponse[]>>(`/api/v1/invitations/me`);
  return response.data.data;
};

export const respondToInvitation = async (invitationId: string, accept: boolean): Promise<InvitationResponse> => {
  const response = await api.post<ApiResponse<InvitationResponse>>(`/api/v1/invitations/${invitationId}/respond`, { accept });
  return response.data.data;
};

export const revokeInvitation = async (invitationId: string): Promise<void> => {
  await api.post<ApiResponse<void>>(`/api/v1/invitations/${invitationId}/revoke`);
};
