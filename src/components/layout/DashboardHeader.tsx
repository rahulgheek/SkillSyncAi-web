import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  BoxArrowRight,
  ChevronDown,
  Folder2Open,
  List,
  Map,
  Person,
  PlusLg,
  Search as SearchIcon,
} from "react-bootstrap-icons";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ProfileResponse } from "@/features/userprofile/schemas";
import { getFirstName, getInitials } from "@/features/dashboard/utils";
import { useNotifications } from "@/features/notifications/context";

interface DashboardHeaderProps {
  profile?: ProfileResponse;
  onOpenNav: () => void;
  onSignOut: () => void;
}

export function DashboardHeader({
  profile,
  onOpenNav,
  onSignOut,
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  const handleMarkAsRead = (id: string) => {
    void markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    void markAllAsRead();
  };

  return (
    <header className="dash-header">
      <div className="dash-header-left">
        <button
          type="button"
          className="dash-icon-btn dash-menu-btn"
          onClick={onOpenNav}
          aria-label="Open navigation menu"
        >
          <List size={18} aria-hidden="true" />
        </button>

        <Link to="/dashboard" className="dash-mobile-brand" aria-label="SkillSync dashboard">
          <span className="dash-mobile-brand-word">SkillSync</span>
          <span className="dash-mobile-brand-ai">AI</span>
        </Link>

        <form className="dash-search" role="search" onSubmit={handleSearch}>
          <SearchIcon size={14} aria-hidden="true" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search people, skills, projects..."
            aria-label="Search people, skills and projects"
          />
          <kbd>Enter</kbd>
        </form>
      </div>

      <div className="dash-header-actions">
        <Link to="/projects/new" className="dash-new-btn">
          <PlusLg size={12} aria-hidden="true" />
          <span>New project</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="dash-icon-btn"
              aria-label={
                unreadCount > 0
                  ? `Notifications, ${unreadCount} unread`
                  : "Notifications"
              }
            >
              <Bell size={16} aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="dash-bell-badge">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="dash-menu dash-notif-menu"
          >
            <div className="dash-notif-head">
              <strong>Notifications</strong>
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="dash-notif-mark"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all read
                </button>
              )}
            </div>
            <DropdownMenuSeparator className="dash-menu-sep" />

            <ScrollArea className="dash-notif-scroll">
              {notifications.length === 0 ? (
                <p className="dash-notif-empty">No notifications yet.</p>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`dash-notif-item${notification.isRead ? "" : " is-unread"}`}
                    onSelect={(event) => {
                      event.preventDefault();
                      if (!notification.isRead) handleMarkAsRead(notification.id);
                    }}
                  >
                    <span className="dash-notif-item-top">
                      <span className="dash-notif-title">{notification.title}</span>
                      <span className="dash-notif-time">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </span>
                    <span className="dash-notif-msg">{notification.message}</span>
                  </DropdownMenuItem>
                ))
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="dash-header-divider" aria-hidden="true" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="dash-profile-trigger"
              aria-label="Open account menu"
            >
              <Avatar className="dash-avatar dash-avatar-md">
                {profile?.profilePictureUrl ? (
                  <AvatarImage src={profile.profilePictureUrl} alt={profile.fullName} />
                ) : null}
                <AvatarFallback className="dash-avatar-fallback">
                  {getInitials(profile?.fullName)}
                </AvatarFallback>
              </Avatar>

              <span className="dash-profile-meta">
                <strong>{profile ? getFirstName(profile.fullName) : "Account"}</strong>
                <small>{profile?.major || "Student builder"}</small>
              </span>

              <ChevronDown size={10} aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="dash-menu dash-account-menu"
          >
            <DropdownMenuLabel className="dash-menu-label">
              <strong>{profile?.fullName ?? "Your account"}</strong>
              <small>{profile?.email ?? "SkillSync student"}</small>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="dash-menu-sep" />

            <DropdownMenuItem asChild>
              <Link to="/profile" className="dash-menu-item">
                <Person size={13} aria-hidden="true" />
                My profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/projects" className="dash-menu-item">
                <Folder2Open size={13} aria-hidden="true" />
                My projects
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/roadmap" className="dash-menu-item">
                <Map size={13} aria-hidden="true" />
                AI roadmap
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="dash-menu-sep" />
            <DropdownMenuItem
              className="dash-menu-item dash-menu-danger"
              onSelect={onSignOut}
            >
              <BoxArrowRight size={13} aria-hidden="true" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
