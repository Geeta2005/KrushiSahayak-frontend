import { Link } from "react-router";
import {
  Tractor,
  Shield,
  DollarSign,
  Search,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useEffect } from "react";
import {
  equipmentAPI,
  userAPI,
  rentalAPI,
  getCurrentUserData,
} from "../services/api";

export function Home() {
  const [stats, setStats] = useState({
    equipmentCount: 0,
    userCount: 0,
    rentalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [equipmentRes, usersRes, rentalsRes] = await Promise.all([
          equipmentAPI.getAll(),
          userAPI.getAll(),
          rentalAPI.getAll(),
        ]);
        setStats({
          equipmentCount: equipmentRes.data?.length || 0,
          userCount: usersRes.data?.length || 0,
          rentalCount: rentalsRes.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Get current user role
    const user = getCurrentUserData();
    setCurrentUser(user);

    fetchStats();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="absolute inset-0 overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwZmllbGQlMjBzdW5zZXR8ZW58MXx8fHwxNzc2MDk3MzE0fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Tractor in field"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6">
              KrushiSahayak
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-800 mb-3 md:mb-4">
              Quality farming equipment when you need it
            </p>
            <p className="text-base md:text-lg text-gray-700 mb-8 md:mb-10 max-w-2xl">
              Connect with equipment owners across the country. Rent what you
              need, list what you own.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link to="/explore">
                  Browse Equipment
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
              {currentUser?.role !== "user" && (
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-lg px-8 py-6 bg-white"
                >
                  <Link to="/list-equipment">List Your Equipment</Link>
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-6 md:gap-8">
              <div className="min-w-[120px]">
                {isLoading ? (
                  <Loader2 className="size-6 animate-spin text-green-600" />
                ) : (
                  <div className="text-3xl md:text-4xl font-bold text-green-600">
                    {stats.equipmentCount}+
                  </div>
                )}
                <div className="text-sm md:text-base text-gray-700">
                  Equipment available
                </div>
              </div>
              <div className="min-w-[120px]">
                {isLoading ? (
                  <Loader2 className="size-6 animate-spin text-green-600" />
                ) : (
                  <div className="text-3xl md:text-4xl font-bold text-green-600">
                    {stats.userCount}+
                  </div>
                )}
                <div className="text-sm md:text-base text-gray-700">
                  Happy farmers
                </div>
              </div>
              <div className="min-w-[120px]">
                {isLoading ? (
                  <Loader2 className="size-6 animate-spin text-green-600" />
                ) : (
                  <div className="text-3xl md:text-4xl font-bold text-green-600">
                    {stats.rentalCount}+
                  </div>
                )}
                <div className="text-sm md:text-base text-gray-700">
                  Rentals completed
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Tractor className="size-8 md:size-10 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                Premium Equipment
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Access tractors, harvesters, plows, and irrigation systems from
                trusted owners.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Shield className="size-8 md:size-10 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                Protected Rentals
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Every rental includes coverage and support from booking to
                return.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <DollarSign className="size-8 md:size-10 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                Fair Pricing
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Transparent daily rates with no hidden fees. Pay only for what
                you use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-600 text-white rounded-full flex items-center justify-center mb-4 md:mb-6">
                <span className="text-xl md:text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                Find Equipment
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Search our catalog by category, location, or specific equipment
                needs.
              </p>
            </div>

            <div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-600 text-white rounded-full flex items-center justify-center mb-4 md:mb-6">
                <span className="text-xl md:text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                Book Dates
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Select your rental period and confirm with the owner. Simple and
                secure.
              </p>
            </div>

            <div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-600 text-white rounded-full flex items-center justify-center mb-4 md:mb-6">
                <span className="text-xl md:text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                Get to Work
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Pick up, complete your task, and return. Track everything in
                your rentals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {currentUser?.role !== "user" && (
        <section className="py-16 md:py-24 bg-green-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
              Turn Idle Equipment Into Income
            </h2>
            <p className="text-lg md:text-xl mb-8 md:mb-10 text-green-50">
              List your farming equipment and start earning today.
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6"
            >
              <Link to="/list-equipment">Get Started</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
