import {
  Search,
  MoreVertical,
  Calendar,
  MapPin,
  DollarSign,
  Check,
  X,
  Loader2,
  Trash2,
} from "lucide-react";
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
import { Separator } from "../../components/ui/separator";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useState, useEffect } from "react";
import { rentalAPI, equipmentAPI } from "../../services/api";
import { toast } from "sonner";

export function AdminRentals() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [equipmentMap, setEquipmentMap] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rentalToDelete, setRentalToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await rentalAPI.getAll();
        setRentals(response.data || []);

        // Fetch equipment details for each rental
        const equipmentIds = [
          ...new Set(response.data?.map((r: any) => r.equipmentId) || []),
        ];
        const equipmentDetails = await Promise.all(
          equipmentIds.map((id: string) => equipmentAPI.getById(id)),
        );
        const map: Record<string, any> = {};
        equipmentDetails.forEach((eq, index) => {
          if (eq.data) {
            map[equipmentIds[index]] = eq.data;
          }
        });
        setEquipmentMap(map);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const handleUpdateStatus = async (rentalId: string, status: string) => {
    try {
      await rentalAPI.updateStatus(rentalId, status);
      setRentals(
        rentals.map((r) => (r._id === rentalId ? { ...r, status } : r)),
      );
      toast.success(`Rental ${status} successfully`);
    } catch (error) {
      toast.error("Failed to update rental status");
    }
  };

  const handleDeleteRental = async (rentalId: string) => {
    setRentalToDelete(rentalId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRental = async () => {
    if (!rentalToDelete) return;
    try {
      await rentalAPI.delete(rentalToDelete);
      setRentals(rentals.filter((r) => r._id !== rentalToDelete));
      toast.success("Rental deleted successfully");
    } catch (error) {
      toast.error("Failed to delete rental");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const filteredRentals = rentals.filter((rental) => {
    const equipment = equipmentMap[rental.equipmentId];
    const matchesSearch = equipment?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || rental.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-green-600" />
      </div>
    );
  }

  const stats = {
    total: rentals.length,
    completed: rentals.filter((r) => r.status === "completed").length,
    active: rentals.filter((r) => r.status === "active").length,
    revenue: rentals
      .filter((r) => r.status === "completed")
      .reduce((sum, r) => sum + (r.totalCost || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Rental Management
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Track and manage all equipment rentals
          </p>
        </div>
        <Button className="text-sm md:text-base">Export Report</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-xs text-gray-600">Total Rentals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Check className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completed}
                </p>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Calendar className="size-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active}
                </p>
                <p className="text-xs text-gray-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <DollarSign className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.revenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search rentals..."
                className="pl-10 text-sm md:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border rounded-md text-sm bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rentals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Recent Rentals</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {filteredRentals.length} rentals in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 text-xs md:text-sm font-medium text-gray-600">
                    Equipment
                  </th>
                  <th className="text-left p-4 text-xs md:text-sm font-medium text-gray-600">
                    Renter
                  </th>
                  <th className="text-left p-4 text-xs md:text-sm font-medium text-gray-600">
                    Dates
                  </th>
                  <th className="text-left p-4 text-xs md:text-sm font-medium text-gray-600">
                    Cost
                  </th>
                  <th className="text-left p-4 text-xs md:text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-right p-4 text-xs md:text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRentals.map((rental) => {
                  const equipment = equipmentMap[rental.equipmentId];
                  return (
                    <tr key={rental._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {equipment?.name || "Unknown Equipment"}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <MapPin className="size-3" />
                            {equipment?.location || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-blue-600 text-white text-xs">
                              {rental.user?.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("") || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-900">
                            {rental.user?.name || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p>
                            {new Date(rental.startDate).toLocaleDateString()}
                          </p>
                          <p className="text-gray-500">
                            to {new Date(rental.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                          <DollarSign className="size-4" />
                          {rental.totalCost || 0}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={`text-xs md:text-sm capitalize ${
                            rental.status === "active"
                              ? "bg-green-600"
                              : rental.status === "pending"
                                ? "bg-yellow-600"
                                : rental.status === "completed"
                                  ? "bg-gray-600"
                                  : "bg-red-600"
                          }`}
                        >
                          {rental.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {rental.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-green-600"
                                onClick={() =>
                                  handleUpdateStatus(rental._id, "active")
                                }
                              >
                                <Check className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-red-600"
                                onClick={() =>
                                  handleUpdateStatus(rental._id, "cancelled")
                                }
                              >
                                <X className="size-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
