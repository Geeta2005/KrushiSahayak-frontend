import { Search, MoreVertical, Shield, Ban, Mail, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { useState, useEffect } from "react";
import { userAPI } from "../../services/api";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { toast } from "sonner";

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await userAPI.getAll();
        setUsers(response.data || []);
      } catch (err: any) {
        toast.error("Failed to fetch users", {
          description: err.message || "Please try again",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await userAPI.delete(userToDelete);
      setUsers(users.filter((u) => u._id !== userToDelete));
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete user", {
        description: error.message || "Please try again",
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus =
      !statusFilter ||
      (user.isVerified ? "active" : "pending") === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Manage platform users and their permissions
          </p>
        </div>
        <Button className="text-sm md:text-base">Add User</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-10 text-sm md:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border rounded-md text-sm bg-white"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="renter">Renter</option>
                <option value="admin">Admin</option>
              </select>
              <select
                className="px-4 py-2 border rounded-md text-sm bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">All Users</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {filteredUsers.length} users registered on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 text-xs md:text-sm font-medium text-gray-600">
                    User
                  </th>
                  <th className="text-left p-4 text-xs md:text-sm font-medium text-gray-600">
                    Role
                  </th>
                  <th className="text-left p-4 text-xs md:text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left p-4 text-xs md:text-sm font-medium text-gray-600">
                    Joined
                  </th>
                  <th className="text-right p-4 text-xs md:text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-green-600 text-white text-xs md:text-sm">
                            {user.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className="text-xs md:text-sm capitalize"
                      >
                        {user.role || "user"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={`text-xs md:text-sm ${
                          user.isVerified ? "bg-green-600" : "bg-yellow-600"
                        }`}
                      >
                        {user.isVerified ? "Active" : "Pending"}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <Ban className="size-4 text-red-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreVertical className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={confirmDeleteUser}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
