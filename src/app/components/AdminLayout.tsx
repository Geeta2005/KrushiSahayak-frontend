import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  Tractor,
  Calendar,
  DollarSign,
  Settings,
  Menu,
  X,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { authAPI } from "../services/api";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname.startsWith(`/admin${path}`);
  };

  const handleLogout = async () => {
    await authAPI.logout();
    navigate("/login");
  };

  const navigationItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Equipment", href: "/admin/equipment", icon: Tractor },
    { name: "Rentals", href: "/admin/rentals", icon: Calendar },
    { name: "Revenue", href: "/admin/revenue", icon: DollarSign },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Top Bar */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-3">
            <Tractor className="size-8 text-green-600" />
            <div>
              <span className="text-lg md:text-xl font-bold text-gray-900">
                FarmRent
              </span>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="size-6" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs md:text-sm"
              asChild
            >
              <Link to="/">View Site</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area - Flex container */}
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 bg-white border-r transform transition-transform duration-200 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-1">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-green-50 text-green-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="size-5" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Info */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-green-600 text-white">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    admin@farmrent.com
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
