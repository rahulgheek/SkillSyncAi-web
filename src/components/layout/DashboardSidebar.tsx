import { Link, useLocation } from "react-router-dom";
import type { Icon } from "react-bootstrap-icons";
import {
  BoxArrowRight,
  ChatDots,
  ChevronRight,
  Compass,
  Folder2Open,
  Grid1x2,
  JournalText,
  Map,
  People,
  Person,
  Search,
} from "react-bootstrap-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ProfileResponse } from "@/features/userprofile/schemas";
import { getInitials } from "@/features/dashboard/utils";

interface DashboardSidebarProps {
  profile?: ProfileResponse;
  onSignOut: () => void;
  onNavigate?: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: Icon;
  exact?: boolean;
}

const workspaceNav: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: Grid1x2, exact: true },
  { label: "Discover", to: "/discover", icon: Compass },
  { label: "My projects", to: "/projects", icon: Folder2Open },
  { label: "Messages", to: "/messages", icon: ChatDots },
];

const growNav: NavItem[] = [
  { label: "AI roadmap", to: "/roadmap", icon: Map },
  { label: "Notes", to: "/notes", icon: JournalText },
  { label: "Find people", to: "/search", icon: Search },
  { label: "My profile", to: "/profile", icon: Person, exact: true },
];

function isActivePath(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.to;
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

function NavGroup({
  label,
  items,
  pathname,
  onNavigate,
}: {
  label: string;
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <p className="dash-nav-label">{label}</p>
      {items.map((item) => {
        const IconGlyph = item.icon;
        const active = isActivePath(pathname, item);

        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`dash-nav-item${active ? " is-active" : ""}`}
          >
            <IconGlyph size={15} aria-hidden="true" />
            <span>{item.label}</span>
            <span className="dash-nav-dot" aria-hidden="true" />
          </Link>
        );
      })}
    </>
  );
}

export function DashboardSidebar({
  profile,
  onSignOut,
  onNavigate,
}: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const role = [profile?.major, profile?.graduationYear ? `Class of ${profile.graduationYear}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="dash-side-inner">
      <Link to="/dashboard" className="dash-brand" onClick={onNavigate}>
        <span className="dash-brand-mark">
          <People size={15} aria-hidden="true" />
        </span>
        <span className="dash-brand-word">
          SkillSync
          <span className="dash-brand-ai">AI</span>
        </span>
      </Link>

      <nav className="dash-nav" aria-label="Dashboard navigation">
        <NavGroup
          label="Workspace"
          items={workspaceNav}
          pathname={pathname}
          onNavigate={onNavigate}
        />
        <NavGroup
          label="Grow"
          items={growNav}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      </nav>

      <div className="dash-side-footer">
        <Link to="/profile" className="dash-side-profile" onClick={onNavigate}>
          <Avatar className="dash-avatar dash-side-avatar">
            {profile?.profilePictureUrl ? (
              <AvatarImage src={profile.profilePictureUrl} alt={profile.fullName} />
            ) : null}
            <AvatarFallback className="dash-avatar-fallback">
              {getInitials(profile?.fullName)}
            </AvatarFallback>
          </Avatar>

          <span className="dash-side-profile-text">
            <strong>{profile?.fullName ?? "Your profile"}</strong>
            <small>{role || "Student builder"}</small>
          </span>

          <ChevronRight
            className="dash-side-profile-arrow"
            size={12}
            aria-hidden="true"
          />
        </Link>

        <button type="button" className="dash-signout" onClick={onSignOut}>
          <BoxArrowRight size={14} aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}
