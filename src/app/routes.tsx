import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Explore } from "./pages/Explore";
import { EquipmentDetails } from "./pages/EquipmentDetails";
import { ListEquipment } from "./pages/ListEquipment";
import { MyRentals } from "./pages/MyRentals";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { AdminLayout } from "./components/AdminLayout";
import { AdminOverview } from "./pages/admin/AdminOverview";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminEquipment } from "./pages/admin/AdminEquipment";
import { AdminRentals } from "./pages/admin/AdminRentals";
import { AdminRevenue } from "./pages/admin/AdminRevenue";
import { AdminAnalytics } from "./pages/admin/AdminAnalytics";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Test } from "./pages/test";

export const router = createBrowserRouter([
  {
    path: "/test",
    Component: Test,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "explore", Component: Explore },
      { path: "equipment/:id", Component: EquipmentDetails },
      {
        path: "list-equipment",
        Component: () => (
          <ProtectedRoute allowedRoles={["renter", "admin"]}>
            <ListEquipment />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-rentals",
        Component: () => (
          <ProtectedRoute>
            <MyRentals />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        Component: () => (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  {
    path: "/admin",
    Component: () => (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: AdminOverview },
      { path: "users", Component: AdminUsers },
      { path: "equipment", Component: AdminEquipment },
      { path: "rentals", Component: AdminRentals },
      { path: "revenue", Component: AdminRevenue },
      { path: "analytics", Component: AdminAnalytics },
      { path: "settings", Component: AdminSettings },
    ],
  },
]);
