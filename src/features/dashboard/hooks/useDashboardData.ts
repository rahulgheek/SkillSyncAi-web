import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getMyApplications,
  getMyInvitations,
  getMyProjects,
  getProjectDetails,
} from "@/features/projects/api";
import { getMyProfile } from "@/features/userprofile/api";
import {
  getUpcomingDeadlines,
  normalizeStatus,
  toEnrolledProject,
  type EnrolledProject,
} from "../utils";

/**
 * Loads and shapes everything the dashboard needs:
 * the profile, projects the student created, projects they joined,
 * pending requests, and upcoming deadlines.
 */
export function useDashboardData() {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

  const projectsQuery = useQuery({
    queryKey: ["myProjects"],
    queryFn: () => getMyProjects(0, 50),
  });

  const applicationsQuery = useQuery({
    queryKey: ["myApplications"],
    queryFn: getMyApplications,
  });

  const invitationsQuery = useQuery({
    queryKey: ["myInvitations"],
    queryFn: getMyInvitations,
  });

  const ownedProjects = useMemo(
    () => projectsQuery.data?.content ?? [],
    [projectsQuery.data],
  );

  const applications = applicationsQuery.data ?? [];
  const invitations = invitationsQuery.data ?? [];

  const enrolledProjectIds = useMemo(() => {
    const ownedIds = new Set(ownedProjects.map((project) => project.id));
    const ids = new Set<string>();

    applications.forEach((application) => {
      if (normalizeStatus(application.status) === "ACCEPTED" && !ownedIds.has(application.projectId)) {
        ids.add(application.projectId);
      }
    });

    invitations.forEach((invitation) => {
      if (normalizeStatus(invitation.status) === "ACCEPTED" && !ownedIds.has(invitation.projectId)) {
        ids.add(invitation.projectId);
      }
    });

    return Array.from(ids);
  }, [applications, invitations, ownedProjects]);

  const enrolledResult = useQueries({
    queries: enrolledProjectIds.map((projectId) => ({
      queryKey: ["project", projectId],
      queryFn: () => getProjectDetails(projectId),
      staleTime: 60_000,
      retry: 1,
    })),
    combine: (results) => ({
      projects: results.flatMap((result) =>
        result.data ? [toEnrolledProject(result.data)] : [],
      ) as EnrolledProject[],
      isLoading: results.some((result) => result.isLoading),
    }),
  });

  const enrolledProjects = enrolledResult.projects;

  const pendingApplications = applications.filter(
    (application) => normalizeStatus(application.status) === "PENDING",
  ).length;

  const pendingInvitations = invitations.filter(
    (invitation) => normalizeStatus(invitation.status) === "PENDING",
  ).length;

  const deadlines = useMemo(
    () => getUpcomingDeadlines(ownedProjects, enrolledProjects),
    [ownedProjects, enrolledProjects],
  );

  return {
    profile: profileQuery.data,
    isProfileLoading: profileQuery.isLoading,
    isProfileError: profileQuery.isError,

    ownedProjects,
    enrolledProjects,
    pendingApplications,
    pendingInvitations,
    deadlines,

    isLoadingProjects: projectsQuery.isLoading,
    isLoadingMemberships:
      applicationsQuery.isLoading ||
      invitationsQuery.isLoading ||
      enrolledResult.isLoading,
  };
}
