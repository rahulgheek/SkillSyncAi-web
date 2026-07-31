import { useState, Fragment } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchProfiles } from "@/features/userprofile/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
            <h1 className="text-3xl font-bold tracking-tight">Discover People</h1>
            <p className="text-muted-foreground mt-1">Search for students, view their public profiles, and connect.</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, major, or bio..."
              className="pl-10 py-6 text-lg rounded-xl shadow-sm border-border"
            />
          </div>
          <Button type="submit" size="lg" className="h-[52px] px-8 rounded-xl bg-primary text-primary-foreground text-lg">
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
                      <Card key={profile.userId} className="overflow-hidden hover:shadow-md transition-shadow group border-border">
                        <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-200" />
                        <CardContent className="pt-0 relative px-6 pb-6">
                          <div className="flex justify-between items-end -mt-10 mb-4">
                            <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
                              <AvatarImage src={profile.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.userId}`} />
                              <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <Button asChild variant="outline" size="sm" className="rounded-full shadow-sm">
                              <Link to={`/profiles/${profile.userId}`}>View Profile</Link>
                            </Button>
                          </div>
                          
                          <h3 className="text-lg font-bold truncate">{profile.fullName}</h3>
                          <p className="text-sm text-primary font-medium mb-3 truncate">{profile.major || "Computer Science"}</p>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                            {profile.bio || "No bio available."}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {profile.location && (
                              <div className="flex items-center gap-1 truncate">
                                <MapPin className="h-3 w-3" /> {profile.location}
                              </div>
                            )}
                            {profile.graduationYear && (
                              <div className="flex items-center gap-1">
                                <GraduationCap className="h-3 w-3" /> Class of {profile.graduationYear}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
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
