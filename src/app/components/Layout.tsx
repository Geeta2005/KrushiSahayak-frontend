import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { KrushiSahayakLogo } from "./KrushiSahayakLogo";
import { useState, useEffect } from "react";
import { isAuthenticated, authAPI, getCurrentUserData } from "../services/api";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsAuth(isAuthenticated());
      if (isAuthenticated()) {
        try {
          const response = await authAPI.getCurrentUser();
          setCurrentUser(response.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to localStorage
          const userData = getUser();
          setCurrentUser(userData);
        }
      }
    };

    fetchUserData();
  }, [location]);

  const handleLogout = async () => {
    await authAPI.logout();
    navigate("/");
    setProfileDropdownOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <KrushiSahayakLogo size="sm" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4 md:gap-6">
              <Link
                to="/"
                className={`text-xs md:text-sm transition-colors ${
                  isActive("/")
                    ? "text-green-600 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Home
              </Link>
              <Link
                to="/explore"
                className={`text-xs md:text-sm transition-colors ${
                  isActive("/explore")
                    ? "text-green-600 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Explore
              </Link>
              {isAuth && currentUser?.role !== "user" && (
                <Link
                  to="/list-equipment"
                  className={`text-xs md:text-sm transition-colors ${
                    isActive("/list-equipment")
                      ? "text-green-600 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  List Equipment
                </Link>
              )}
              {isAuth && (
                <Link
                  to="/my-rentals"
                  className={`text-xs md:text-sm transition-colors ${
                    isActive("/my-rentals")
                      ? "text-green-600 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  My Rentals
                </Link>
              )}
              <div className="flex items-center gap-2 md:gap-3 ml-2">
                {isAuth ? (
                  <>
                    <span className="text-xs md:text-sm text-gray-600">
                      Hello, {currentUser?.name?.split(" ")[0] || "User"}
                    </span>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setProfileDropdownOpen(!profileDropdownOpen)
                        }
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <User className="size-5 md:size-6" />
                      </button>
                      {profileDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <User className="size-4" />
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100 text-left"
                          >
                            <LogOut className="size-4" />
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <Link to="/login">
                    <Button size="sm" className="text-xs md:text-sm">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="size-5 md:size-6 text-gray-600" />
              ) : (
                <Menu className="size-5 md:size-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 md:py-4 border-t">
              <nav className="flex flex-col gap-3 md:gap-4">
                <Link
                  to="/"
                  className={`text-xs md:text-sm transition-colors ${
                    isActive("/")
                      ? "text-green-600 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/explore"
                  className={`text-xs md:text-sm transition-colors ${
                    isActive("/explore")
                      ? "text-green-600 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Explore
                </Link>
                {isAuth && currentUser?.role !== "user" && (
                  <Link
                    to="/list-equipment"
                    className={`text-xs md:text-sm transition-colors ${
                      isActive("/list-equipment")
                        ? "text-green-600 font-medium"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    List Equipment
                  </Link>
                )}
                {isAuth && (
                  <Link
                    to="/my-rentals"
                    className={`text-xs md:text-sm transition-colors ${
                      isActive("/my-rentals")
                        ? "text-green-600 font-medium"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Rentals
                  </Link>
                )}
                <Separator />
                {isAuth ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="size-4" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs md:text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full text-xs md:text-sm">
                      Sign In
                    </Button>
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <div className="flex items-center mb-3 md:mb-4">
                <KrushiSahayakLogo size="sm" variant="light" />
              </div>
              <p className="text-gray-400 text-xs md:text-sm">
                Connecting farmers with quality equipment rentals nationwide.
              </p>
            </div>

            <div>
              <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4">
                For Renters
              </h3>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
                <li>
                  <Link
                    to="/explore"
                    className="hover:text-white transition-colors"
                  >
                    Explore Equipment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-rentals"
                    className="hover:text-white transition-colors"
                  >
                    My Rentals
                  </Link>
                </li>
              </ul>
            </div>

            {currentUser?.role !== "user" && (
              <div>
                <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4">
                  For Owners
                </h3>
                <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
                  <li>
                    <Link
                      to="/list-equipment"
                      className="hover:text-white transition-colors"
                    >
                      List Equipment
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4">
                Account
              </h3>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
                <li>
                  <Link
                    to="/profile"
                    className="hover:text-white transition-colors"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm text-gray-400">
            <p>&copy; 2026 KrushiSahayak. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
