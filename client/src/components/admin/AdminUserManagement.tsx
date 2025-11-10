import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Shield, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminUserManagement() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const { data: users, isLoading } = trpc.admin.listUsers.useQuery({
    limit: itemsPerPage,
    offset: currentPage * itemsPerPage,
  });

  const promoteAdminMutation = trpc.admin.promoteToAdmin.useMutation({
    onSuccess: () => {
      toast.success("User promoted to admin!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to promote user");
    },
  });

  const demoteAdminMutation = trpc.admin.demoteToUser.useMutation({
    onSuccess: () => {
      toast.success("Admin demoted to user!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to demote admin");
    },
  });

  const grantPremiumMutation = trpc.admin.grantPremium.useMutation({
    onSuccess: () => {
      toast.success("Premium granted!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to grant premium");
    },
  });

  const revokePremiumMutation = trpc.admin.revokePremium.useMutation({
    onSuccess: () => {
      toast.success("Premium revoked!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to revoke premium");
    },
  });

  const handlePromoteToAdmin = (userId: number) => {
    promoteAdminMutation.mutate({ userId });
  };

  const handleDemoteToUser = (userId: number) => {
    demoteAdminMutation.mutate({ userId });
  };

  const handleGrantPremium = (userId: number) => {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    grantPremiumMutation.mutate({ userId, expiryDate });
  };

  const handleRevokePremium = (userId: number) => {
    revokePremiumMutation.mutate({ userId });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : users && users.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">Premium</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border hover:bg-card/50 transition-colors"
                  >
                    <td className="py-3 px-4">{user.name || "Unknown"}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {user.email || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          user.role === "admin"
                            ? "bg-accent/20 text-accent border border-accent/50"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {user.role === "admin" && (
                          <Shield className="w-3 h-3 mr-1" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.isPremium ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-500 border border-yellow-500/50">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Premium
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {user.role === "user" ? (
                          <Button
                            size="sm"
                            className="anime-btn text-xs"
                            onClick={() => handlePromoteToAdmin(user.id)}
                            disabled={promoteAdminMutation.isPending}
                          >
                            Make Admin
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="anime-btn-outline text-xs"
                            onClick={() => handleDemoteToUser(user.id)}
                            disabled={demoteAdminMutation.isPending}
                          >
                            Demote
                          </Button>
                        )}

                        {user.isPremium ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="anime-btn-outline text-xs"
                            onClick={() => handleRevokePremium(user.id)}
                            disabled={revokePremiumMutation.isPending}
                          >
                            Revoke Premium
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="anime-btn text-xs"
                            onClick={() => handleGrantPremium(user.id)}
                            disabled={grantPremiumMutation.isPending}
                          >
                            Grant Premium
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              disabled={!users || users.length < itemsPerPage}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <Card className="anime-card p-8 text-center">
          <p className="text-muted-foreground">No users found.</p>
        </Card>
      )}
    </div>
  );
}
