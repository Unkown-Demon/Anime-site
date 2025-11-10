import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Play, Star, TrendingUp } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: animes, isLoading: isLoadingAnimes } = trpc.anime.list.useQuery({
    limit: 12,
    offset: 0,
    search: searchQuery || undefined,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-anime border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt={APP_TITLE} className="w-8 h-8" />
            <h1 className="text-xl font-bold text-anime-glow">{APP_TITLE}</h1>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {user?.name || "User"}
                </span>
                {user?.role === "admin" && (
                  <Link href="/admin">
                    <Button className="anime-btn text-sm">Admin Panel</Button>
                  </Link>
                )}
                <Link href="/profile">
                  <Button variant="outline" className="text-sm">
                    Profile
                  </Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="anime-btn">Sign In</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6 text-anime-glow">
              Welcome to AnimeStream
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Discover and watch your favorite anime in stunning quality. From classics to the latest releases.
            </p>

            <div className="flex gap-4 justify-center mb-12">
              {!isAuthenticated ? (
                <a href={getLoginUrl()}>
                  <Button className="anime-btn text-lg px-8 py-6">
                    Get Started
                  </Button>
                </a>
              ) : (
                <Link href="/anime">
                  <Button className="anime-btn text-lg px-8 py-6">
                    Browse Anime
                  </Button>
                </Link>
              )}
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-6 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Anime Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-3xl font-bold mb-2">Featured Anime</h3>
              <div className="anime-divider w-24" />
            </div>
            {isAuthenticated && (
              <Link href="/anime">
                <Button variant="outline" className="anime-btn-outline">
                  View All
                </Button>
              </Link>
            )}
          </div>

          {isLoadingAnimes ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : animes && animes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {animes.map((anime) => (
                <Link key={anime.id} href={`/anime/${anime.id}`}>
                  <div className="anime-card group cursor-pointer">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <Button className="anime-btn w-full">Watch Now</Button>
                      </div>

                      {/* Premium Badge */}
                      {anime.isPremiumOnly && (
                        <div className="absolute top-3 right-3">
                          <span className="anime-badge">Premium</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h4 className="font-bold text-foreground line-clamp-2 mb-2">
                        {anime.title}
                      </h4>

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
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No anime found. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-card/50">
          <div className="container">
            <h3 className="text-3xl font-bold text-center mb-12">Why Choose AnimeStream?</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Vast Collection",
                  description: "Access thousands of anime titles from classic to latest releases",
                  icon: "📚",
                },
                {
                  title: "High Quality",
                  description: "Watch in stunning HD quality with crystal clear audio",
                  icon: "🎬",
                },
                {
                  title: "Premium Features",
                  description: "Ad-free experience and exclusive content for premium members",
                  icon: "⭐",
                },
              ].map((feature, idx) => (
                <Card key={idx} className="anime-card p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2024 {APP_TITLE}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
