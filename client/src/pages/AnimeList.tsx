import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Star, TrendingUp, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { useState, useMemo } from "react";

export default function AnimeList() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;

  const { data: animes, isLoading } = trpc.anime.list.useQuery({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
    search: searchQuery || undefined,
  });

  const { data: favorites } = trpc.user.getFavorites.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const favoriteIds = useMemo(
    () => new Set((favorites ?? []).map((f) => f.animeId)),
    [favorites]
  );

  const addFavoriteMutation = trpc.user.addFavorite.useMutation();
  const removeFavoriteMutation = trpc.user.removeFavorite.useMutation();

  const handleToggleFavorite = (animeId: number, isFavorite: boolean) => {
    if (!isAuthenticated) return;

    if (isFavorite) {
      removeFavoriteMutation.mutate({ animeId });
    } else {
      addFavoriteMutation.mutate({ animeId });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-anime border-b border-border">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="outline" className="anime-btn-outline">
                ← Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-anime-glow">Browse Anime</h1>
            <div className="w-24" />
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search anime by title..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-6 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : animes && animes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {animes.map((anime) => {
                  const isFavorite = favoriteIds.has(anime.id);

                  return (
                    <div key={anime.id} className="anime-card group">
                      {/* Cover Image */}
                      <div className="relative h-64 bg-muted overflow-hidden">
                        {anime.coverImageUrl ? (
                          <img
                            src={anime.coverImageUrl}
                            alt={anime.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
                            <Play className="w-12 h-12 text-accent/50" />
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
                          <Link href={`/anime/${anime.id}`}>
                            <Button className="anime-btn w-full">View Details</Button>
                          </Link>
                          {isAuthenticated && (
                            <Button
                              variant="outline"
                              className="anime-btn-outline w-full"
                              onClick={() => handleToggleFavorite(anime.id, isFavorite)}
                              disabled={
                                addFavoriteMutation.isPending ||
                                removeFavoriteMutation.isPending
                              }
                            >
                              <Heart
                                className={`w-4 h-4 mr-2 ${
                                  isFavorite ? "fill-red-500 text-red-500" : ""
                                }`}
                              />
                              {isFavorite ? "Favorited" : "Add to Favorites"}
                            </Button>
                          )}
                        </div>

                        {/* Badges */}
                        <div className="absolute top-3 right-3 flex gap-2">
                          {anime.isPremiumOnly && (
                            <span className="anime-badge">Premium</span>
                          )}
                          <span className="anime-badge">{anime.status}</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <Link href={`/anime/${anime.id}`}>
                          <h4 className="font-bold text-foreground line-clamp-2 mb-2 hover:text-accent transition-colors">
                            {anime.title}
                          </h4>
                        </Link>

                        {anime.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {anime.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mb-3">
                          {(anime.rating ?? 0) > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm text-muted-foreground">
                                {(((anime.rating ?? 0) / 10).toFixed(1))}
                              </span>
                            </div>
                          )}
                          {(anime.episodes ?? 0) > 0 && (
                            <span className="text-sm text-muted-foreground">
                              {anime.episodes} eps
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <TrendingUp className="w-3 h-3" />
                          <span>{(anime.views ?? 0).toLocaleString()} views</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  className="anime-btn-outline"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <span className="text-muted-foreground">
                  Page {currentPage + 1}
                </span>
                <Button
                  variant="outline"
                  className="anime-btn-outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!animes || animes.length < itemsPerPage}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                {searchQuery
                  ? "No anime found matching your search."
                  : "No anime available yet. Check back soon!"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
