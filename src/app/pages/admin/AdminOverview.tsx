import {
  Users,
  Tractor,
  Calendar,
  DollarSign,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { userAPI, equipmentAPI, rentalAPI } from "../../services/api";
import { toast } from "sonner";

export function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, equipmentRes, rentalsRes] =
          await Promise.all([
            userAPI.getAdminStats(),
            userAPI.getAll(),
            equipmentAPI.getAll(),
            rentalAPI.getAll(),
          ]);
        setStats(statsRes.data);

        // Build recent activity from real data
        const activities: any[] = [];

        // Recent users
        (usersRes.data || []).slice(0, 3).forEach((user: any) => {
          activities.push({
            id: `user-${user._id}`,
            type: "user",
            description: `New user registered: ${user.name}`,
            user: user.name,
            time: "Recently",
          });
        });

        // Recent equipment
        (equipmentRes.data || []).slice(0, 3).forEach((eq: any) => {
          activities.push({
            id: `equipment-${eq._id}`,
            type: "equipment",
            description: `New equipment listed: ${eq.name}`,
            user: eq.owner?.name || "Unknown",
            time: "Recently",
          });
        });

        // Recent rentals
        (rentalsRes.data || []).slice(0, 3).forEach((rental: any) => {
          activities.push({
            id: `rental-${rental._id}`,
            type: "rental",
            description: `New rental booking`,
            user: rental.user?.name || "Unknown",
            time: "Recently",
          });
        });

        setRecentActivity(activities.slice(0, 5));

        // Pending approvals - equipment pending approval
        const pendingEquipment = (equipmentRes.data || []).filter(
          (eq: any) => eq.status === "pending",
        );
        setPendingApprovals(pendingEquipment);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statsData = stats
    ? [
        {
          name: "Total Users",
          value: stats.totalUsers?.toString() || "0",
          change: "+12.5%",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          name: "Active Equipment",
          value: stats.totalEquipment?.toString() || "0",
          change: "+8.2%",
          icon: Tractor,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          name: "Total Rentals",
          value: stats.totalRentals?.toString() || "0",
          change: "+23.1%",
          icon: Calendar,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
        {
          name: "Total Revenue",
          value: `$${stats.totalRevenue?.toLocaleString() || "0"}`,
          change: "+15.3%",
          icon: DollarSign,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
      ]
    : [];

  const handleApprove = async (id: string) => {
    try {
      await equipmentAPI.updateStatus(id, "active");
      setPendingApprovals(pendingApprovals.filter((p) => p._id !== id));
      toast.success("Equipment approved successfully");
    } catch (error) {
      toast.error("Failed to approve equipment");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await equipmentAPI.delete(id);
      setPendingApprovals(pendingApprovals.filter((p) => p._id !== id));
      toast.success("Equipment rejected successfully");
    } catch (error) {
      toast.error("Failed to reject equipment");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsData.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`size-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-medium text-green-600`}>
                  {stat.change}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600">{stat.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Latest actions across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        by {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
            <Separator className="my-4" />
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/admin/rentals">View All Activity</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/equipment">
                <Tractor className="size-4 mr-2" />
                Add Equipment
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/users">
                <Users className="size-4 mr-2" />
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/rentals">
                <Calendar className="size-4 mr-2" />
                View Rentals
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/revenue">
                <DollarSign className="size-4 mr-2" />
                View Revenue
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Pending Approvals
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Items requiring your attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      New Equipment Listing
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.owner?.name || "Unknown"} wants to list "{item.name}
                      "
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleReject(item._id)}
                    >
                      <X className="size-3 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs"
                      onClick={() => handleApprove(item._id)}
                    >
                      <Check className="size-3 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No pending approvals
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
