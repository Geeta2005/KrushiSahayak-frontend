import { Link } from "react-router";
import { MapPin, Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Equipment } from "../data/equipment";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface EquipmentCardProps {
  equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <Link to={`/equipment/${equipment.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="aspect-[4/3] relative overflow-hidden">
          <ImageWithFallback
            src={equipment.image}
            alt={equipment.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <Badge
            className={`absolute top-2 md:top-3 right-2 md:right-3 text-xs md:text-sm ${
              equipment.availability === "Available"
                ? "bg-green-600"
                : "bg-gray-600"
            }`}
          >
            {equipment.availability}
          </Badge>
        </div>

        <CardContent className="p-3 md:p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-1">
                {equipment.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                {equipment.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-2 md:mb-3">
            <Star className="size-3 md:size-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs md:text-sm font-medium">
              {equipment.rating}
            </span>
            <span className="text-xs md:text-sm text-gray-500">
              ({equipment.reviews})
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600 mb-2 md:mb-3">
            <MapPin className="size-3 md:size-4" />
            <span className="truncate">{equipment.location}</span>
          </div>

          <div className="pt-2 md:pt-3 border-t">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <span className="text-lg md:text-xl lg:text-2xl font-semibold text-green-600">
                  ${equipment.pricePerDay}
                </span>
                <span className="text-xs md:text-sm text-gray-600 ml-1">
                  /day
                </span>
              </div>
              <span className="text-xs md:text-sm text-gray-600">
                {equipment.owner}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
