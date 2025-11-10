import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminAnimeUpload() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    episodes: "0",
    status: "upcoming" as const,
    coverImageUrl: "",
    trailerUrl: "",
    releaseYear: new Date().getFullYear().toString(),
    isPremiumOnly: false,
  });

  const uploadMutation = trpc.anime.upload.useMutation({
    onSuccess: () => {
      toast.success("Anime uploaded successfully!");
      setFormData({
        title: "",
        description: "",
        genre: "",
        episodes: "0",
        status: "upcoming",
        coverImageUrl: "",
        trailerUrl: "",
        releaseYear: new Date().getFullYear().toString(),
        isPremiumOnly: false,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload anime");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    uploadMutation.mutate({
      title: formData.title,
      description: formData.description || undefined,
      genre: formData.genre || undefined,
      episodes: parseInt(formData.episodes, 10),
      status: formData.status,
      coverImageUrl: formData.coverImageUrl || undefined,
      trailerUrl: formData.trailerUrl || undefined,
      releaseYear: formData.releaseYear ? parseInt(formData.releaseYear, 10) : undefined,
      isPremiumOnly: formData.isPremiumOnly,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="anime-card p-8">
        <h2 className="text-2xl font-bold mb-6">Upload New Anime</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Anime Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter anime title"
              className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter anime description"
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Genre (comma-separated)
            </label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="e.g. Action, Adventure, Fantasy"
              className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Grid: Episodes, Status, Release Year */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Episodes
              </label>
              <input
                type="number"
                name="episodes"
                value={formData.episodes}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Release Year
              </label>
              <input
                type="number"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              name="coverImageUrl"
              value={formData.coverImageUrl}
              onChange={handleChange}
              placeholder="https://example.com/cover.jpg"
              className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Trailer URL */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Trailer URL (YouTube embed)
            </label>
            <input
              type="url"
              name="trailerUrl"
              value={formData.trailerUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/embed/..."
              className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Premium Only */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPremiumOnly"
              name="isPremiumOnly"
              checked={formData.isPremiumOnly}
              onChange={handleChange}
              className="w-4 h-4 rounded border-border cursor-pointer"
            />
            <label htmlFor="isPremiumOnly" className="text-sm font-semibold cursor-pointer">
              Premium Only Content
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="anime-btn w-full gap-2"
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Anime
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
