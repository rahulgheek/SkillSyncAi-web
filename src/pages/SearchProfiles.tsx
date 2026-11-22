import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRepeat,
  ArrowRight,
  GeoAlt,
  Mortarboard,
  People,
  Search,
} from "react-bootstrap-icons";
import { searchProfiles } from "@/features/userprofile/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/features/dashboard/utils";

export function SearchProfiles() {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [searchInput, setSearchInput] = useState(urlQuery);
  const [queryTerm, setQueryTerm] = useState(urlQuery);

  useEffect(() => {
    setSearchInput(urlQuery);
    setQueryTerm(urlQuery);
  }, [urlQuery]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["searchProfilesInfinite", queryTerm],
      queryFn: ({ pageParam = 0 }) => searchProfiles(queryTerm, pageParam, 12),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage) return undefined;
        const nextPage = allPages.length;
        return nextPage < (lastPage.totalPages ?? 0) ? nextPage : undefined;
      },
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQueryTerm(searchInput);
  };

  const hasProfiles = data?.pages?.some((page) => page?.content?.length > 0);

  return (
    <div className="dash-page">
      <header className="dash-page-head">
        <div className="dash-page-heading">
          <p className="dash-eyebrow">People</p>
          <h1 className="dash-title">
            Find your next <em>teammate.</em>
          </h1>
          <p className="dash-sub">
            Search students by name, major, or the skills they bring to a build.
          </p>
        </div>
      </header>

      <form className="dash-searchbar" onSubmit={handleSearch} role="search">
        <div className="dash-input-wrap">
          <Search size={14} aria-hidden="true" />
          <input
            className="dash-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, major, or skills..."
            aria-label="Search students"
          />
        </div>
        <button type="submit" className="dash-btn dash-btn-solid">
          <Search size={12} aria-hidden="true" />
          Search
        </button>
      </form>

      {isLoading ? (
        <div className="dash-page-loader" role="status" aria-label="Searching students">
          <span className="dash-spinner" aria-hidden="true" />
          <span>Searching</span>
        </div>
      ) : !hasProfiles ? (
        <div className="dash-empty-inline dash-panel" style={{ minHeight: 280 }}>
          <People size={26} color="#8f8d6e" aria-hidden="true" />
          <h4>No students found</h4>
          <p>Try a different search term or check back later.</p>
        </div>
      ) : (
        <div className="dash-people-grid">
          {data?.pages.map((page, index) => (
            <div key={index} className="contents">
              {page.content.map((person) => (
                <Link
                  key={person.userId}
                  to={`/profiles/${person.userId}`}
                  className="dash-person-card"
                >
                  <div className="dash-person-top">
                    <Avatar className="dash-avatar-lg">
                      <AvatarImage src={person.profilePictureUrl || ""} />
                      <AvatarFallback className="dash-avatar-fallback">
                        {getInitials(person.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div style={{ minWidth: 0 }}>
                      <h3 className="dash-person-name">{person.fullName}</h3>
                      <p className="dash-person-role">
                        {person.currentRole || "Student"}
                      </p>
                    </div>
                  </div>

                  {person.major && (
                    <span className="dash-person-fact">
                      <Mortarboard size={11} aria-hidden="true" />
                      {person.major}
                    </span>
                  )}
                  {person.location && (
                    <span className="dash-person-fact">
                      <GeoAlt size={11} aria-hidden="true" />
                      {person.location}
                    </span>
                  )}

                  {person.bio && <p className="dash-person-bio">{person.bio}</p>}

                  <div className="dash-person-foot">
                    <span>View profile</span>
                    <ArrowRight size={11} aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}

      {hasNextPage && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
          <button
            type="button"
            className="dash-btn dash-btn-ghost"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <ArrowRepeat size={12} className="dash-icon-spin" aria-hidden="true" />
                Loading more
              </>
            ) : (
              "Load more profiles"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
