import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
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
import { rentalAPI, userAPI } from "../../services/api";

export function AdminRevenue() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await rentalAPI.getAll();
        setRentals(response.data || []);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueData();
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
  const averageOrderValue =
    completedRentals.length > 0 ? totalRevenue / completedRentals.length : 0;
  const commissionEarned = totalRevenue * 0.15; // Assuming 15% commission

  const revenueStats = [
    {
      name: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+15.3%",
      trend: "up" as const,
      period: "All Time",
    },
    {
      name: "Average Order Value",
      value: `$${Math.round(averageOrderValue).toLocaleString()}`,
      change: "+8.2%",
      trend: "up" as const,
      period: "All Time",
    },
    {
      name: "Total Rentals",
      value: completedRentals.length.toString(),
      change: "+23.1%",
      trend: "up" as const,
      period: "Completed",
    },
    {
      name: "Commission Earned",
      value: `$${Math.round(commissionEarned).toLocaleString()}`,
      change: "+12.5%",
      trend: "up" as const,
      period: "All Time",
    },
  ];

  const monthlyRevenue = [
    { month: "Jan", revenue: 85000, commission: 12750 },
    { month: "Feb", revenue: 92000, commission: 13800 },
    { month: "Mar", revenue: 98000, commission: 14700 },
    { month: "Apr", revenue: 105000, commission: 15750 },
    { month: "May", revenue: 115000, commission: 17250 },
    { month: "Jun", revenue: totalRevenue, commission: commissionEarned },
  ];

  const topEarners = completedRentals
    .reduce((acc: any[], rental) => {
      const existing = acc.find((e) => e.userId === rental.user?._id);
      if (existing) {
        existing.earnings += rental.totalCost || 0;
        existing.rentals += 1;
      } else {
        acc.push({
          userId: rental.user?._id,
          name: rental.user?.name || "Unknown",
          earnings: rental.totalCost || 0,
          rentals: 1,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.earnings - a.earnings)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Revenue Overview
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Track platform revenue and earnings
          </p>
        </div>
        <Button className="text-sm md:text-base">
          <Download className="size-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {revenueStats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs md:text-sm text-gray-600">{stat.name}</p>
                {stat.trend === "up" ? (
                  <TrendingUp className="size-4 text-green-600" />
                ) : (
                  <TrendingDown className="size-4 text-red-600" />
                )}
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <span
                  className={`text-xs md:text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-gray-500">{stat.period}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Monthly Revenue</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Revenue and commission trends over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-4">
            {monthlyRevenue.map((item) => (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-green-600 rounded-t"
                  style={{
                    height: `${(item.revenue / Math.max(...monthlyRevenue.map((m) => m.revenue))) * 200}px`,
                  }}
                />
                <div
                  className="w-full bg-blue-600 rounded-t"
                  style={{
                    height: `${(item.commission / Math.max(...monthlyRevenue.map((m) => m.commission))) * 40}px`,
                  }}
                />
                <span className="text-xs text-gray-600">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded" />
              <span className="text-xs md:text-sm text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded" />
              <span className="text-xs md:text-sm text-gray-600">
                Commission
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Earners */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Top Equipment Owners
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Highest earning equipment owners this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEarners.map((earner, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {earner.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {earner.rentals} rentals
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-green-600">
                    ${earner.earnings.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Revenue Breakdown
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Revenue by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Tractors</span>
                  <span className="font-medium">$45,230</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "36%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Harvesters</span>
                  <span className="font-medium">$32,100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "25%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Planters</span>
                  <span className="font-medium">$28,450</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "23%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Sprayers</span>
                  <span className="font-medium">$19,898</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: "16%" }}
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
