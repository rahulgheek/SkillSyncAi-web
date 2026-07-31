import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/context";
import { Home, Compass, Map, FolderKanban, MessageSquare, Bell, LogOut, Sparkles, User, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/features/userprofile/api";
import { useNotifications } from "@/features/notifications/context";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export function DashboardLayout() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate(`/login?redirect=${location.pathname}`, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  const navItems = [
    { icon: Home, label: "Dashboard", to: "/dashboard" },
    { icon: Search, label: "Search", to: "/search" },
    { icon: Compass, label: "Discover", to: "/discover" },
    { icon: Map, label: "AI Roadmap", to: "/roadmap" },
    { icon: FolderKanban, label: "Projects", to: "/projects" },
    { icon: MessageSquare, label: "Messages", to: "/messages" },
    { icon: FileText, label: "Notes", to: "/notes" },
    { icon: User, label: "My Profile", to: "/profile" },
  ];

  return (
    <div className="flex min-h-screen bg-background/95">
      {/* Dynamic Background Elements */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="pointer-events-none fixed top-0 right-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-primary/10 blur-[120px]"></div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-20 flex h-full w-64 flex-col border-r border-border/40 bg-card/40 backdrop-blur-xl">
        <div className="flex h-16 items-center px-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600 shadow-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <Link to="/dashboard" className="flex items-center gap-2 px-2 py-4">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">SkillSync AI</span>
            </Link>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary ${isActive ? 'bg-primary/15 text-primary shadow-sm' : 'text-muted-foreground'}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border/40 p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 ml-64 flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-end px-8 backdrop-blur-md border-b border-border/40 bg-background/50">
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => markAllAsRead()} className="text-xs text-primary h-auto py-1">
                      Mark all as read
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id} 
                        className={`flex flex-col items-start p-3 cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`}
                        onClick={() => {
                          if (!notification.isRead) markAsRead(notification.id);
                        }}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className={`text-sm font-semibold ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className={`text-xs ${!notification.isRead ? 'text-foreground/90' : 'text-muted-foreground'} line-clamp-2`}>
                          {notification.message}
                        </p>
                      </DropdownMenuItem>
                    ))
                  )}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {profile && (
            <div className="ml-6 flex items-center gap-3 border-l border-border/40 pl-6">
              <span className="text-sm font-semibold text-foreground">{profile.fullName}</span>
              <Link to="/profile">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/80 to-violet-500 ring-2 ring-background cursor-pointer hover:ring-primary/50 transition-all overflow-hidden flex items-center justify-center">
                  {profile.profilePictureUrl ? (
                    <img src={profile.profilePictureUrl} alt={profile.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-white text-xs font-bold">{profile.fullName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </Link>
            </div>
          )}
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
