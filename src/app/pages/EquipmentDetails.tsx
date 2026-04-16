import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Star,
  User,
  Check,
  Calendar as CalendarIcon,
  Shield,
  Truck,
  Phone,
  Mail,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar } from "../components/ui/calendar";
import { Separator } from "../components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { EquipmentCard } from "../components/EquipmentCard";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { addDays, differenceInDays } from "date-fns";
import { equipmentAPI, rentalAPI } from "../services/api";

export function EquipmentDetails() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await equipmentAPI.getById(id || "");
        setEquipment(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch equipment");
        console.error("Error fetching equipment:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEquipment();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Loader2 className="size-8 animate-spin mx-auto mb-4" />
        <p>Loading equipment details...</p>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Equipment Not Found</h1>
        <p className="text-gray-600 mb-4">
          {error || "The equipment you're looking for doesn't exist."}
        </p>
        <Link to="/explore">
          <Button>Back to Explore</Button>
        </Link>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select rental dates");
      return;
    }

    try {
      await rentalAPI.create({
        equipmentId: equipment._id,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        notes: "Please confirm availability",
      });
      toast.success(`Booking request sent!`, {
        description: `The owner will contact you shortly to confirm your rental.`,
      });
    } catch (error: any) {
      toast.error("Booking failed", {
        description: error.message || "Please try again",
      });
    }
  };

  const rentalDays =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from) + 1
      : 0;
  const subtotal = equipment.pricePerDay * rentalDays;
  const serviceFee = 25;
  const insuranceFee = subtotal * 0.1;
  const totalPrice = subtotal + serviceFee + insuranceFee;

  // Additional images for gallery (using equipment images or duplicates)
  const images =
    equipment.images && equipment.images.length > 0
      ? equipment.images
      : ["https://via.placeholder.com/800x600?text=No+Image"];

  // Reviews from equipment data
  const reviews = equipment.reviews || [];

  // Rating breakdown based on actual reviews
  const ratingBreakdown = [
    {
      stars: 5,
      count: reviews.filter((r) => r.rating === 5).length,
      percentage:
        reviews.length > 0
          ? Math.round(
              (reviews.filter((r) => r.rating === 5).length / reviews.length) *
                100,
            )
          : 0,
    },
    {
      stars: 4,
      count: reviews.filter((r) => r.rating === 4).length,
      percentage:
        reviews.length > 0
          ? Math.round(
              (reviews.filter((r) => r.rating === 4).length / reviews.length) *
                100,
            )
          : 0,
    },
    {
      stars: 3,
      count: reviews.filter((r) => r.rating === 3).length,
      percentage:
        reviews.length > 0
          ? Math.round(
              (reviews.filter((r) => r.rating === 3).length / reviews.length) *
                100,
            )
          : 0,
    },
    {
      stars: 2,
      count: reviews.filter((r) => r.rating === 2).length,
      percentage:
        reviews.length > 0
          ? Math.round(
              (reviews.filter((r) => r.rating === 2).length / reviews.length) *
                100,
            )
          : 0,
    },
    {
      stars: 1,
      count: reviews.filter((r) => r.rating === 1).length,
      percentage:
        reviews.length > 0
          ? Math.round(
              (reviews.filter((r) => r.rating === 1).length / reviews.length) *
                100,
            )
          : 0,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 md:mb-6"
        >
          <ArrowLeft className="size-4" />
          <span className="text-sm md:text-base">Back to Explore</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="aspect-[16/9] relative">
                <ImageWithFallback
                  src={images[selectedImage]}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-green-600">
                  Available
                </Badge>
              </div>
              <div className="p-4 grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-green-600 ring-2 ring-green-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${equipment.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </Card>

            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl md:text-3xl mb-2">
                      {equipment.name}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm">
                      <Badge
                        variant="outline"
                        className="font-normal text-xs md:text-sm"
                      >
                        {equipment.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="size-3 md:size-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {equipment.rating || 0}
                        </span>
                        <span className="text-gray-600">
                          ({reviews.length} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="size-3 md:size-4" />
                        <span>{equipment.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right sm:text-left">
                    <div className="text-3xl md:text-4xl font-bold text-green-600">
                      ${equipment.pricePerDay}
                    </div>
                    <p className="text-xs md:text-sm text-gray-600">per day</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="text-sm md:text-base">
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="text-sm md:text-base"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-sm md:text-base">
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 md:space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      {equipment.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Key Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                      {equipment.features && equipment.features.length > 0 ? (
                        equipment.features.map(
                          (feature: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg"
                            >
                              <Check className="size-4 md:size-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-xs md:text-sm text-gray-700">
                                {feature}
                              </span>
                            </div>
                          ),
                        )
                      ) : (
                        <p className="text-sm text-gray-500 col-span-2">
                          No features listed
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      What's Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 md:space-y-3">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Shield className="size-4 md:size-5 text-green-600" />
                      <span className="text-xs md:text-sm text-gray-700">
                        Insurance coverage included
                      </span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <Truck className="size-4 md:size-5 text-green-600" />
                      <span className="text-xs md:text-sm text-gray-700">
                        Delivery available (additional fee)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                      <User className="size-4 md:size-5 text-green-600" />
                      <span className="text-xs md:text-sm text-gray-700">
                        24/7 owner support
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Rental Policies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4 text-xs md:text-sm text-gray-700">
                    <div>
                      <h4 className="font-semibold mb-1">
                        Cancellation Policy
                      </h4>
                      <p>
                        Free cancellation up to 48 hours before rental. 50%
                        refund within 48 hours.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-1">Pickup & Return</h4>
                      <p>
                        Equipment must be picked up and returned during business
                        hours (8 AM - 6 PM).
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-1">Security Deposit</h4>
                      <p>
                        Refundable security deposit of $500 required at pickup.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specifications">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Technical Specifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:gap-4">
                      <div className="grid sm:grid-cols-2 gap-x-6 md:gap-x-8 gap-y-2 md:gap-y-3">
                        <div className="flex justify-between py-1 md:py-2 border-b">
                          <span className="text-xs md:text-sm text-gray-600">
                            Category
                          </span>
                          <span className="text-xs md:text-sm font-medium">
                            {equipment.category}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 md:py-2 border-b">
                          <span className="text-xs md:text-sm text-gray-600">
                            Condition
                          </span>
                          <span className="text-xs md:text-sm font-medium">
                            Excellent
                          </span>
                        </div>
                        <div className="flex justify-between py-1 md:py-2 border-b">
                          <span className="text-xs md:text-sm text-gray-600">
                            Year
                          </span>
                          <span className="text-xs md:text-sm font-medium">
                            2023
                          </span>
                        </div>
                        <div className="flex justify-between py-1 md:py-2 border-b">
                          <span className="text-xs md:text-sm text-gray-600">
                            Hours Used
                          </span>
                          <span className="text-xs md:text-sm font-medium">
                            850 hrs
                          </span>
                        </div>
                        <div className="flex justify-between py-1 md:py-2 border-b">
                          <span className="text-xs md:text-sm text-gray-600">
                            Fuel Type
                          </span>
                          <span className="text-xs md:text-sm font-medium">
                            Diesel
                          </span>
                        </div>
                        <div className="flex justify-between py-1 md:py-2 border-b">
                          <span className="text-xs md:text-sm text-gray-600">
                            Weight
                          </span>
                          <span className="text-xs md:text-sm font-medium">
                            8,500 lbs
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4 md:space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Rating Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8 mb-4 md:mb-6">
                      <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">
                          {equipment.rating}
                        </div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`size-3 md:size-4 ${
                                star <= equipment.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs md:text-sm text-gray-600">
                          {equipment.reviews} reviews
                        </p>
                      </div>

                      <div className="flex-1 space-y-2">
                        {ratingBreakdown.map((item) => (
                          <div
                            key={item.stars}
                            className="flex items-center gap-2 md:gap-3"
                          >
                            <span className="text-xs md:text-sm text-gray-600 w-6 md:w-8">
                              {item.stars} ⭐
                            </span>
                            <Progress
                              value={item.percentage}
                              className="flex-1 h-2"
                            />
                            <span className="text-xs md:text-sm text-gray-600 w-6 md:w-8">
                              {item.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3 md:space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review: any) => (
                      <Card key={review._id || review.id}>
                        <CardContent className="pt-4 md:pt-6">
                          <div className="flex items-start gap-3 md:gap-4">
                            <Avatar className="size-10 md:size-12">
                              <AvatarFallback className="bg-green-100 text-green-700 text-xs md:text-sm">
                                {review.user?.name
                                  ? review.user.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm md:text-base font-semibold">
                                  {review.user?.name || "Anonymous"}
                                </h4>
                                <span className="text-xs md:text-sm text-gray-600">
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mb-1 md:mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`size-3 md:size-4 ${
                                      star <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-xs md:text-sm text-gray-700">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-gray-600 py-8">
                      No reviews yet
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Owner Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  Meet the Owner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 md:gap-4">
                  <Avatar className="size-12 md:size-16">
                    <AvatarFallback className="bg-green-600 text-white text-base md:text-xl">
                      {equipment.owner?.name
                        ? equipment.owner.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                        : "O"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base md:text-lg mb-1">
                      {equipment.owner?.name || "Unknown Owner"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mb-2 md:mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="size-3 md:size-4 fill-yellow-400 text-yellow-400" />
                        <span>Verified Owner</span>
                      </div>
                      <span>•</span>
                      <span>{equipment.location}</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4">
                      Farm equipment owner providing quality machinery to local
                      farmers.
                    </p>
                    <div className="flex gap-2 md:gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs md:text-sm"
                      >
                        <Mail className="size-3 md:size-4 mr-1 md:mr-2" />
                        Message
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs md:text-sm"
                      >
                        <Phone className="size-3 md:size-4 mr-1 md:mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-16 md:top-20">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  Book This Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div>
                  <label className="text-xs md:text-sm font-medium mb-2 md:mb-3 block">
                    Select Rental Dates
                  </label>
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border text-xs md:text-sm"
                  />
                </div>

                {rentalDays > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs md:text-sm">
                        <span className="text-gray-600">
                          ${equipment.pricePerDay} x {rentalDays} day
                          {rentalDays > 1 ? "s" : ""}
                        </span>
                        <span className="font-medium">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm">
                        <span className="text-gray-600">Service fee</span>
                        <span className="font-medium">
                          ${serviceFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm">
                        <span className="text-gray-600">Insurance (10%)</span>
                        <span className="font-medium">
                          ${insuranceFee.toFixed(2)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between pt-2">
                        <span className="font-semibold text-base md:text-lg">
                          Total
                        </span>
                        <span className="font-bold text-xl md:text-2xl text-green-600">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <Button
                  className="w-full text-sm md:text-base"
                  size="lg"
                  onClick={handleBooking}
                  disabled={rentalDays === 0}
                >
                  Request Booking
                </Button>

                <div className="space-y-2 text-xs md:text-sm text-gray-600">
                  <div className="flex items-start gap-2 bg-blue-50 p-2 md:p-3 rounded-lg">
                    <CalendarIcon className="size-3 md:size-4 flex-shrink-0 mt-0.5 text-blue-600" />
                    <p>
                      You won't be charged yet. The owner will review and
                      confirm your request.
                    </p>
                  </div>
                  <div className="flex items-start gap-2 bg-green-50 p-2 md:p-3 rounded-lg">
                    <Shield className="size-3 md:size-4 flex-shrink-0 mt-0.5 text-green-600" />
                    <p>
                      All rentals include damage protection and 24/7 support.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
