import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminLogs() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;

  const { data: logs, isLoading } = trpc.admin.getLogs.useQuery({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case "UPLOAD_ANIME":
        return "bg-blue-500/20 text-blue-500";
      case "UPDATE_ANIME":
        return "bg-cyan-500/20 text-cyan-500";
      case "DELETE_ANIME":
        return "bg-red-500/20 text-red-500";
      case "PROMOTE_TO_ADMIN":
        return "bg-yellow-500/20 text-yellow-500";
      case "DEMOTE_TO_USER":
        return "bg-orange-500/20 text-orange-500";
      case "GRANT_PREMIUM":
        return "bg-green-500/20 text-green-500";
      case "REVOKE_PREMIUM":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatAction = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Activity Logs</h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : logs && logs.length > 0 ? (
        <>
          <div className="space-y-4">
            {logs.map((log) => (
              <Card key={log.id} className="anime-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${getActionColor(
                          log.action
                        )}`}
                      >
                        {formatAction(log.action)}
                      </span>
                      {log.targetType && (
                        <span className="text-sm text-muted-foreground">
                          on {log.targetType}
                          {log.targetId && ` #${log.targetId}`}
                        </span>
                      )}
                    </div>

                    {log.details && (
                      <p className="text-sm text-muted-foreground">
                        {log.details}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-8">
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
              disabled={!logs || logs.length < itemsPerPage}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <Card className="anime-card p-8 text-center">
          <p className="text-muted-foreground">No activity logs yet.</p>
        </Card>
      )}
    </div>
  );
}
