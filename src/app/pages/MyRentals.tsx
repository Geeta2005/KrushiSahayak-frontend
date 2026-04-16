import { Link } from "react-router";
import { Calendar, MapPin, DollarSign, Clock, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { rentalAPI } from "../services/api";

interface Rental {
  _id: string;
  equipmentId: string;
  equipment?: {
    name: string;
    images: string[];
    location: string;
    pricePerDay: number;
    owner?: {
      name: string;
    };
  };
  startDate: string;
  endDate: string;
  totalCost: number;
  status: "pending" | "active" | "completed" | "cancelled";
}

function RentalCard({ rental }: { rental: Rental }) {
  const statusColors = {
    pending: "bg-yellow-600",
    active: "bg-green-600",
    completed: "bg-gray-600",
    cancelled: "bg-red-600",
  };

  const statusLabels = {
    pending: "Pending",
    active: "Active",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const equipmentName = rental.equipment?.name || "Unknown Equipment";
  const equipmentImage =
    rental.equipment?.images?.[0] ||
    "https://via.placeholder.com/400x300?text=No+Image";
  const location = rental.equipment?.location || "Unknown";
  const owner = rental.equipment?.owner?.name || "Unknown Owner";

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="md:w-36 md:w-48 flex-shrink-0">
            <ImageWithFallback
              src={equipmentImage}
              alt={equipmentName}
              className="w-full h-28 md:h-32 lg:h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2 md:mb-3">
              <div>
                <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-1">
                  {equipmentName}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">{owner}</p>
              </div>
              <Badge
                className={`${statusColors[rental.status]} text-xs md:text-sm`}
              >
                {statusLabels[rental.status]}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-600">
                <Calendar className="size-3 md:size-4" />
                <span className="truncate">
                  {new Date(rental.startDate).toLocaleDateString()} -{" "}
                  {new Date(rental.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-600">
                <Clock className="size-3 md:size-4" />
                <span>
                  {calculateDays(rental.startDate, rental.endDate)} days
                </span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-600">
                <MapPin className="size-3 md:size-4" />
                <span className="truncate">{location}</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-600">
                <DollarSign className="size-3 md:size-4" />
                <span className="font-semibold text-green-600">
                  ${rental.totalCost}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs md:text-sm"
                asChild
              >
                <Link to={`/equipment/${rental.equipmentId}`}>
                  View Equipment
                </Link>
              </Button>
              {rental.status === "active" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  Contact Owner
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MyRentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await rentalAPI.getAll();
        setRentals(response.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch rentals");
        console.error("Error fetching rentals:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const activeRentals = rentals.filter((r) => r.status === "active");
  const upcomingRentals = rentals.filter((r) => r.status === "pending");
  const completedRentals = rentals.filter((r) => r.status === "completed");

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
            My Rentals
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Track and manage your equipment rentals
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-green-600" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-8 md:py-12 text-center">
              <p className="text-sm md:text-base text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="active" className="space-y-4 md:space-y-6">
            <TabsList>
              <TabsTrigger value="active" className="text-sm md:text-base">
                Active ({activeRentals.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="text-sm md:text-base">
                Upcoming ({upcomingRentals.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-sm md:text-base">
                Completed ({completedRentals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-3 md:space-y-4">
              {activeRentals.length > 0 ? (
                activeRentals.map((rental) => (
                  <RentalCard key={rental._id} rental={rental} />
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 md:py-12 text-center">
                    <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                      No active rentals
                    </p>
                    <Button className="text-sm md:text-base" asChild>
                      <Link to="/explore">Browse Equipment</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-3 md:space-y-4">
              {upcomingRentals.length > 0 ? (
                upcomingRentals.map((rental) => (
                  <RentalCard key={rental._id} rental={rental} />
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 md:py-12 text-center">
                    <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                      No upcoming rentals
                    </p>
                    <Button className="text-sm md:text-base" asChild>
                      <Link to="/explore">Browse Equipment</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-3 md:space-y-4">
              {completedRentals.length > 0 ? (
                completedRentals.map((rental) => (
                  <RentalCard key={rental._id} rental={rental} />
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 md:py-12 text-center">
                    <p className="text-sm md:text-base text-gray-600">
                      No completed rentals
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
