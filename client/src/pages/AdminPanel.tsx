import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Users, LogOut, BarChart3 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import AdminAnimeUpload from "@/components/admin/AdminAnimeUpload";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import AdminLogs from "@/components/admin/AdminLogs";

type AdminTab = "upload" | "users" | "logs";

export default function AdminPanel() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("upload");

  // Check if user is admin
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You need admin privileges to access this page.
        </p>
        <Link href="/">
          <Button className="anime-btn">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-anime border-b border-border sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-anime-glow">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
              Manage anime and users
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.name || "Admin"}
            </span>
            <Button
              variant="outline"
              className="anime-btn-outline gap-2"
              onClick={() => {
                logout();
                setLocation("/");
              }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="glass-anime border-b border-border sticky top-16 z-40">
        <div className="container flex gap-8">
          <button
            onClick={() => setActiveTab("upload")}
            className={`py-4 px-2 font-semibold transition-colors border-b-2 ${
              activeTab === "upload"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload Anime
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`py-4 px-2 font-semibold transition-colors border-b-2 ${
              activeTab === "users"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            User Management
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`py-4 px-2 font-semibold transition-colors border-b-2 ${
              activeTab === "logs"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Activity Logs
          </button>
        </div>
      </div>

      {/* Content */}
      <section className="py-8">
        <div className="container">
          {activeTab === "upload" && <AdminAnimeUpload />}
          {activeTab === "users" && <AdminUserManagement />}
          {activeTab === "logs" && <AdminLogs />}
        </div>
      </section>
    </div>
  );
}
