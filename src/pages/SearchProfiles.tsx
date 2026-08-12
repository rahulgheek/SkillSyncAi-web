import { useState, Fragment } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchProfiles } from "@/features/userprofile/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, MapPin, GraduationCap, Users, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SearchProfiles() {
  const [searchInput, setSearchInput] = useState("");
  const [queryTerm, setQueryTerm] = useState("");

  const { 
    data, 
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["searchProfilesInfinite", queryTerm],
    queryFn: ({ pageParam = 0 }) => searchProfiles(queryTerm, pageParam, 12),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.last === true) return undefined;
      return allPages.length;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQueryTerm(searchInput);
  };

  const hasProfiles = data?.pages?.some(page => page?.content?.length > 0);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Discover <span className="font-handwriting text-primary text-5xl md:text-6xl inline-block -rotate-2 -translate-y-1">People</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg font-medium">Search for students, view their public profiles, and connect.</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <Input 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, major, or bio..."
              className="pl-12 py-7 text-lg rounded-2xl shadow-md shadow-gray-200/50 border-gray-100 bg-white focus-visible:ring-primary/20"
            />
          </div>
          <Button type="submit" size="lg" className="h-[58px] px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white text-lg shadow-md shadow-primary/20 font-bold">
            Search
          </Button>
        </form>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {!hasProfiles ? (
                <div className="col-span-full text-center py-12 bg-muted/20 rounded-xl border border-dashed border-muted">
                  <p className="text-muted-foreground">No profiles found matching your search.</p>
                </div>
              ) : (
                data?.pages.map((page, i) => (
                  <Fragment key={i}>
                    {page.content.map(profile => (
                      <div key={profile.userId} className="bg-white rounded-[2rem] overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 shadow-xl shadow-gray-100/50 border border-gray-100 flex flex-col group">
                        <div className="h-24 bg-gradient-to-r from-primary/10 to-accent/10 relative">
                          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                        </div>
                        <div className="pt-0 relative px-6 pb-6 flex-1 flex flex-col">
                          <div className="flex justify-between items-end -mt-10 mb-4 relative z-10">
                            <Avatar className="h-20 w-20 border-4 border-white shadow-md bg-white">
                              <AvatarImage src={profile.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.userId}`} />
                              <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <Button asChild variant="outline" size="sm" className="rounded-xl shadow-sm font-bold border-gray-200 hover:bg-gray-50">
                              <Link to={`/profiles/${profile.userId}`}>View Profile</Link>
                            </Button>
                          </div>
                          
                          <h3 className="text-xl font-black truncate text-foreground">{profile.fullName}</h3>
                          <p className="text-sm text-primary font-bold mb-3 truncate">{profile.major || "Computer Science"}</p>
                          
                          <p className="text-sm text-muted-foreground font-medium line-clamp-2 mb-6 h-10">
                            {profile.bio || "No bio available."}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground mt-auto">
                            {profile.location && (
                              <div className="flex items-center gap-1.5 truncate">
                                <MapPin className="h-3.5 w-3.5 text-primary" /> {profile.location}
                              </div>
                            )}
                            {profile.graduationYear && (
                              <div className="flex items-center gap-1.5">
                                <GraduationCap className="h-3.5 w-3.5 text-accent" /> Class of {profile.graduationYear}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </Fragment>
                ))
              )}
            </div>
            
            {hasNextPage && (
              <div className="flex justify-center mt-8">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => fetchNextPage()} 
                  disabled={isFetchingNextPage}
                  className="rounded-full px-8"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading more...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
