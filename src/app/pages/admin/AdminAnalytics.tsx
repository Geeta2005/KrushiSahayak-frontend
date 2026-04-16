import {
  BarChart3,
  TrendingUp,
  Users,
  Tractor,
  Calendar,
  Loader2,
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
import { useState, useEffect } from "react";
import { userAPI, equipmentAPI, rentalAPI } from "../../services/api";

export function AdminAnalytics() {
  const [users, setUsers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [usersRes, equipmentRes, rentalsRes] = await Promise.all([
          userAPI.getAll(),
          equipmentAPI.getAll(),
          rentalAPI.getAll(),
        ]);
        setUsers(usersRes.data || []);
        setEquipment(equipmentRes.data || []);
        setRentals(rentalsRes.data || []);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-green-600" />
      </div>
    );
  }

  const completedRentals = rentals.filter((r) => r.status === "completed");
  const totalRevenue = completedRentals.reduce(
    (sum, r) => sum + (r.totalCost || 0),
    0,
  );

  const analyticsData = [
    {
      title: "User Growth",
      value: users.length.toString(),
      change: "+12.5%",
      description: "Total registered users",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Equipment Listings",
      value: equipment.length.toString(),
      change: "+8.2%",
      description: "Active equipment on platform",
      icon: Tractor,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Rental Volume",
      value: completedRentals.length.toString(),
      change: "+23.1%",
      description: "Total rentals completed",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+15.3%",
      description: "Revenue from completed rentals",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const categoryPerformance = equipment.reduce((acc: any[], eq) => {
    const existing = acc.find((c) => c.category === eq.category);
    const categoryRentals = completedRentals.filter(
      (r) => r.equipmentId === eq._id,
    );
    const categoryRevenue = categoryRentals.reduce(
      (sum, r) => sum + (r.totalCost || 0),
      0,
    );

    if (existing) {
      existing.listings += 1;
      existing.rentals += categoryRentals.length;
      existing.revenue += categoryRevenue;
    } else {
      acc.push({
        category: eq.category || "Other",
        listings: 1,
        rentals: categoryRentals.length,
        revenue: categoryRevenue,
        growth: Math.floor(Math.random() * 20), // Placeholder for growth
      });
    }
    return acc;
  }, []);

  const geographicData = users
    .reduce((acc: any[], user) => {
      const location = user.location || "Other";
      const existing = acc.find((r) => r.region === location);
      const userRentals = completedRentals.filter(
        (r) => r.user?._id === user._id,
      );
      const userRevenue = userRentals.reduce(
        (sum, r) => sum + (r.totalCost || 0),
        0,
      );

      if (existing) {
        existing.users += 1;
        existing.rentals += userRentals.length;
        existing.revenue += userRevenue;
      } else {
        acc.push({
          region: location,
          users: 1,
          rentals: userRentals.length,
          revenue: userRevenue,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Platform Analytics
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Track performance metrics and insights
          </p>
        </div>
        <Button className="text-sm md:text-base">
          <BarChart3 className="size-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {analyticsData.map((data) => (
          <Card key={data.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-lg ${data.bgColor}`}>
                  <data.icon className={`size-6 ${data.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs md:text-sm text-gray-600">
                    {data.title}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {data.value}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-green-600" />
                <span className="text-xs md:text-sm font-medium text-green-600">
                  {data.change}
                </span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Category Performance
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Performance metrics by equipment category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 text-xs md:text-sm font-medium text-gray-600">
                    Category
                  </th>
                  <th className="text-left p-4 text-xs md:text-sm font-medium text-gray-600">
                    Listings
                  </th>
                  <th className="text-left p-4 text-xs md:text-sm font-medium text-gray-600">
                    Rentals
                  </th>
                  <th className="text-left p-4 text-xs md:text-sm font-medium text-gray-600">
                    Revenue
                  </th>
                  <th className="text-left p-4 text-xs md:text-sm font-medium text-gray-600">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryPerformance.map((cat) => (
                  <tr key={cat.category} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {cat.category}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {cat.listings}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{cat.rentals}</td>
                    <td className="p-4 text-sm font-medium text-green-600">
                      ${cat.revenue.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="text-xs md:text-sm font-medium text-green-600">
                        +{cat.growth}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Geographic Distribution
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              User and rental distribution by region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geographicData.length > 0 ? (
                geographicData.map((region) => (
                  <div key={region.region}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900">
                        {region.region}
                      </span>
                      <span className="text-gray-600">
                        ${region.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${(region.revenue / Math.max(...geographicData.map((r) => r.revenue))) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{region.users} users</span>
                      <span>{region.rentals} rentals</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No geographic data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Engagement Metrics
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              User engagement and activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Daily Active Users</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "68%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    Average Session Duration
                  </span>
                  <span className="font-medium">8m 32s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "54%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Conversion Rate</span>
                  <span className="font-medium">12.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "42%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Return User Rate</span>
                  <span className="font-medium">67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: "67%" }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
