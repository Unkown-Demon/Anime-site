import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Star, TrendingUp, Heart, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link, useRoute } from "wouter";
import { useMemo } from "react";

export default function AnimeDetail() {
  const { user, isAuthenticated } = useAuth();
  const [match, params] = useRoute("/anime/:id");

  const animeId = params?.id ? parseInt(params.id, 10) : null;

  const { data: anime, isLoading } = trpc.anime.detail.useQuery(
    { id: animeId! },
    { enabled: !!animeId }
  );

  const { data: favorites } = trpc.user.getFavorites.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const isFavorite = useMemo(
    () => (favorites ?? []).some((f) => f.animeId === animeId),
    [favorites, animeId]
  );

  const addFavoriteMutation = trpc.user.addFavorite.useMutation();
  const removeFavoriteMutation = trpc.user.removeFavorite.useMutation();

  const handleToggleFavorite = () => {
    if (!isAuthenticated || !animeId) return;

    if (isFavorite) {
      removeFavoriteMutation.mutate({ animeId });
    } else {
      addFavoriteMutation.mutate({ animeId });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Anime Not Found</h1>
        <Link href="/anime">
          <Button className="anime-btn">Back to Anime List</Button>
        </Link>
      </div>
    );
  }

  const isPremiumContent = anime.isPremiumOnly && user && !user.isPremium;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="glass-anime border-b border-border sticky top-0 z-40">
        <div className="container py-4">
          <Link href="/anime">
            <Button variant="outline" className="anime-btn-outline gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to List
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section with Cover */}
      <div className="relative h-96 bg-muted overflow-hidden">
        {anime.coverImageUrl ? (
          <>
            <img
              src={anime.coverImageUrl}
              alt={anime.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
            <Play className="w-24 h-24 text-accent/50" />
          </div>
        )}
      </div>

      {/* Content */}
      <section className="relative -mt-32 z-10 pb-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="anime-card p-8">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{anime.title}</h1>
                    <div className="flex items-center gap-4">
                      {(anime.rating ?? 0) > 0 && (
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          <span className="text-lg">
                            {(((anime.rating ?? 0) / 10).toFixed(1))}
                          </span>
                        </div>
                      )}
                      {(anime.episodes ?? 0) > 0 && (
                        <span className="text-muted-foreground">
                          {anime.episodes} Episodes
                        </span>
                      )}
                      <span className="anime-badge">{anime.status}</span>
                      {anime.isPremiumOnly && (
                        <span className="anime-badge bg-accent/30 text-accent">
                          Premium Only
                        </span>
                      )}
                    </div>
                  </div>

                  {isAuthenticated && (
                    <Button
                      className={`anime-btn-outline gap-2 ${
                        isFavorite ? "bg-red-500/20 text-red-500 border-red-500/50" : ""
                      }`}
                      onClick={handleToggleFavorite}
                      disabled={
                        addFavoriteMutation.isPending ||
                        removeFavoriteMutation.isPending
                      }
                    >
                      <Heart
                        className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                      />
                      {isFavorite ? "Favorited" : "Add to Favorites"}
                    </Button>
                  )}
                </div>

                {/* Description */}
                {anime.description && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-3">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {anime.description}
                    </p>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-b border-border">
                  {anime.releaseYear && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Release Year
                      </p>
                      <p className="font-semibold">{anime.releaseYear}</p>
                    </div>
                  )}
                  {anime.genre && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Genres</p>
                      <p className="font-semibold text-sm">{anime.genre}</p>
                    </div>
                  )}
                  {(anime.views ?? 0) > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Views</p>
                      <p className="font-semibold">
                        {(anime.views ?? 0).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {(anime.episodes ?? 0) > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Episodes</p>
                      <p className="font-semibold">{anime.episodes}</p>
                    </div>
                  )}
                </div>

                {/* Trailer */}
                {anime.trailerUrl && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Trailer</h3>
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <iframe
                        width="100%"
                        height="100%"
                        src={anime.trailerUrl}
                        title="Anime Trailer"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="anime-card p-6 sticky top-24">
                {isPremiumContent ? (
                  <div className="text-center">
                    <div className="text-4xl mb-4">🔒</div>
                    <h3 className="text-xl font-bold mb-2">Premium Content</h3>
                    <p className="text-muted-foreground mb-6">
                      This anime is only available for premium members.
                    </p>
                    <Link href="/profile">
                      <Button className="anime-btn w-full">
                        Upgrade to Premium
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-4">▶️</div>
                    <h3 className="text-xl font-bold mb-2">Ready to Watch?</h3>
                    <p className="text-muted-foreground mb-6">
                      Start watching this anime now in high quality.
                    </p>
                    {isAuthenticated ? (
                      <Button className="anime-btn w-full gap-2">
                        <Play className="w-4 h-4" />
                        Watch Now
                      </Button>
                    ) : (
                      <Link href="/">
                        <Button className="anime-btn w-full">Sign In to Watch</Button>
                      </Link>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="mt-8 pt-8 border-t border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <span className="text-sm text-muted-foreground">
                      {(anime.views ?? 0).toLocaleString()} views
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
