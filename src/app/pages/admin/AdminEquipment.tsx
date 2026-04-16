import {
  Search,
  MoreVertical,
  Plus,
  Eye,
  Edit,
  Trash2,
  Loader2,
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
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useState, useEffect } from "react";
import { equipmentAPI } from "../../services/api";
import { toast } from "sonner";

export function AdminEquipment() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await equipmentAPI.getAll();
        setEquipment(response.data || []);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const handleDeleteEquipment = async (equipmentId: string) => {
    setEquipmentToDelete(equipmentId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEquipment = async () => {
    if (!equipmentToDelete) return;
    try {
      await equipmentAPI.delete(equipmentToDelete);
      setEquipment(equipment.filter((eq) => eq._id !== equipmentToDelete));
      toast.success("Equipment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete equipment");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || eq.category === categoryFilter;
    const matchesStatus =
      !statusFilter || (eq.available ? "active" : "inactive") === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
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
            Equipment Management
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Manage all equipment listings on the platform
          </p>
        </div>
        <Button className="text-sm md:text-base">
          <Plus className="size-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search equipment..."
                className="pl-10 text-sm md:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border rounded-md text-sm bg-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Tractors">Tractors</option>
                <option value="Harvesters">Harvesters</option>
                <option value="Planters">Planters</option>
                <option value="Sprayers">Sprayers</option>
              </select>
              <select
                className="px-4 py-2 border rounded-md text-sm bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <Card key={item._id} className="overflow-hidden">
            <div className="aspect-[4/3] relative">
              <ImageWithFallback
                src={item.images?.[0] || ""}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <Badge
                className={`absolute top-3 right-3 text-xs md:text-sm ${
                  item.available ? "bg-green-600" : "bg-gray-600"
                }`}
              >
                {item.available ? "Active" : "Inactive"}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-base md:text-lg mb-1">
                {item.name}
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>{item.category}</span>
                <span>${item.pricePerDay}/day</span>
              </div>
              <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 mb-4">
                <span>Location: {item.location}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs md:text-sm"
                >
                  <Eye className="size-3 md:size-4 mr-1 md:mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  <Edit className="size-3 md:size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteEquipment(item._id)}
                >
                  <Trash2 className="size-3 md:size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Equipment"
        description="Are you sure you want to delete this equipment? This action cannot be undone."
        onConfirm={confirmDeleteEquipment}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
