import { useState } from "react";
import { Upload, DollarSign, MapPin, FileText, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { categories } from "../data/equipment";
import { toast } from "sonner";
import { equipmentAPI } from "../services/api";

export function ListEquipment() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    pricePerDay: "",
    location: "",
    features: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const equipmentData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        pricePerDay: parseFloat(formData.pricePerDay),
        location: formData.location,
        features: formData.features.split("\n").filter((f) => f.trim()),
        images: ["https://via.placeholder.com/800x600?text=Equipment+Image"], // Placeholder for now
      };

      await equipmentAPI.create(equipmentData);
      toast.success("Equipment listed successfully!", {
        description: "Your equipment is now available for rent.",
      });
      // Reset form
      setFormData({
        name: "",
        category: "",
        description: "",
        pricePerDay: "",
        location: "",
        features: "",
      });
    } catch (error: any) {
      toast.error("Failed to list equipment", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
            List Your Equipment
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Turn your idle farming equipment into a revenue stream. Fill out the
            form below to get started.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <Card>
            <CardContent className="pt-4 md:pt-6 text-center">
              <DollarSign className="size-10 md:size-12 text-green-600 mx-auto mb-2 md:mb-3" />
              <h3 className="text-sm md:text-base font-semibold mb-1 md:mb-2">
                Earn Extra Income
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                Make money from equipment that would otherwise sit idle
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 md:pt-6 text-center">
              <MapPin className="size-10 md:size-12 text-green-600 mx-auto mb-2 md:mb-3" />
              <h3 className="text-sm md:text-base font-semibold mb-1 md:mb-2">
                Local Rentals
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                Connect with farmers in your area who need your equipment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 md:pt-6 text-center">
              <FileText className="size-10 md:size-12 text-green-600 mx-auto mb-2 md:mb-3" />
              <h3 className="text-sm md:text-base font-semibold mb-1 md:mb-2">
                Easy Management
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                Simple tools to manage bookings and track earnings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Equipment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Equipment Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm md:text-base">
                  Equipment Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., John Deere 5075E Tractor"
                  className="text-sm md:text-base"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm md:text-base">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat !== "All Equipment")
                      .map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm md:text-base">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your equipment, its condition, and what makes it great..."
                  rows={4}
                  className="text-sm md:text-base"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm md:text-base">
                  Price Per Day ($) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="150"
                  min="1"
                  className="text-sm md:text-base"
                  value={formData.pricePerDay}
                  onChange={(e) => handleChange("pricePerDay", e.target.value)}
                  required
                />
                <p className="text-xs md:text-sm text-gray-500">
                  Set a competitive daily rental rate
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm md:text-base">
                  Location *
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Iowa, USA"
                  className="text-sm md:text-base"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  required
                />
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label htmlFor="features" className="text-sm md:text-base">
                  Key Features
                </Label>
                <Textarea
                  id="features"
                  placeholder="List key features, one per line (e.g., 75 HP engine, 4WD capability, Air-conditioned cab)"
                  rows={3}
                  className="text-sm md:text-base"
                  value={formData.features}
                  onChange={(e) => handleChange("features", e.target.value)}
                />
              </div>

              {/* Photos Upload */}
              <div className="space-y-2">
                <Label htmlFor="photos" className="text-sm md:text-base">
                  Equipment Photos
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
                  <Upload className="size-10 md:size-12 text-gray-400 mx-auto mb-2 md:mb-3" />
                  <p className="text-xs md:text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 10MB (Max 5 photos)
                  </p>
                  <Input
                    id="photos"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 md:pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-sm md:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Listing Equipment...
                    </>
                  ) : (
                    "List Equipment"
                  )}
                </Button>
                <p className="text-xs md:text-sm text-gray-500 text-center mt-2 md:mt-3">
                  By listing your equipment, you agree to our terms and
                  conditions
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mt-8 md:mt-12 space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3 md:space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-sm md:text-base font-semibold">
                  How do I get paid?
                </h3>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs md:text-sm text-gray-600">
                  Payments are processed securely through our platform. You'll
                  receive payment within 24 hours after the rental period ends.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-sm md:text-base font-semibold">
                  Is my equipment insured?
                </h3>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs md:text-sm text-gray-600">
                  Yes, all rentals include comprehensive insurance coverage for
                  damage and theft during the rental period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <h3 className="text-sm md:text-base font-semibold">
                  Can I set my own rental terms?
                </h3>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs md:text-sm text-gray-600">
                  Absolutely! You control the pricing, availability, and minimum
                  rental periods for your equipment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
