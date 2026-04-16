import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { EquipmentCard } from "../components/EquipmentCard";
import { categories } from "../data/equipment";
import { equipmentAPI } from "../services/api";

export function Explore() {
  const [selectedCategory, setSelectedCategory] = useState("All Equipment");
  const [searchQuery, setSearchQuery] = useState("");
  const [equipment, setEquipment] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await equipmentAPI.getAll({
        category:
          selectedCategory === "All Equipment" ? undefined : selectedCategory,
        search: searchQuery || undefined,
      });
      setEquipment(response.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch equipment");
      console.error("Error fetching equipment:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [selectedCategory, searchQuery]);

  return (
    <div>
      {/* Search Header */}
      <section className="bg-white border-b py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
            Explore Equipment
          </h1>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 md:size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tractors, harvesters, plows, irrigation systems..."
                className="pl-10 text-sm md:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="default" className="text-sm md:text-base">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Equipment Listings */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="mb-6 md:mb-8">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="flex flex-wrap justify-start gap-2 h-auto bg-transparent">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-sm md:text-base px-3 md:px-4 py-2"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Results Count */}
          <div className="mb-4 md:mb-6">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <p className="text-sm md:text-base text-gray-600">
                  Loading equipment...
                </p>
              </div>
            ) : error ? (
              <p className="text-sm md:text-base text-red-600">{error}</p>
            ) : (
              <p className="text-sm md:text-base text-gray-600">
                {equipment.length} equipment
                {equipment.length !== 1 ? "s" : ""} available
              </p>
            )}
          </div>

          {/* Equipment Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-lg h-64 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 md:py-16">
              <p className="text-gray-600 text-base md:text-lg mb-4">{error}</p>
              <Button onClick={fetchEquipment}>Try Again</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {equipment.map((item) => (
                <EquipmentCard
                  key={item._id}
                  equipment={{
                    id: item._id,
                    name: item.name,
                    category: item.category,
                    description: item.description,
                    image: item.images?.[0] || "",
                    pricePerDay: item.pricePerDay,
                    location: item.location,
                    rating: item.rating,
                    owner: item.owner?.name || "Unknown",
                  }}
                />
              ))}
            </div>
          )}

          {!isLoading && !error && equipment.length === 0 && (
            <div className="text-center py-12 md:py-16">
              <p className="text-gray-600 text-base md:text-lg">
                No equipment found matching your criteria.
              </p>
              <Button
                variant="link"
                className="mt-4 text-sm md:text-base"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Equipment");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
