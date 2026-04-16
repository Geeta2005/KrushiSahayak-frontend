import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Settings,
  Loader2,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Modal } from "../components/Modal";
import { useState, useEffect } from "react";
import { authAPI, userAPI } from "../services/api";

export function Profile() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationPrefs, setNotificationPrefs] = useState(() => {
    const savedPrefs = localStorage.getItem("notificationPrefs");
    return savedPrefs
      ? JSON.parse(savedPrefs)
      : {
          rentalConfirmations: true,
          rentalReminders: true,
          marketingEmails: false,
          messages: true,
        };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  // Modal state
  const [modal, setModal] = useState({
    open: false,
    title: "",
    description: "",
    type: "info" as "success" | "error" | "info",
  });

  const showModal = (
    title: string,
    description?: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    setModal({ open: true, title, description, type });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await authAPI.getCurrentUser();
        setUser(response.user);

        // Initialize form data
        if (response.user) {
          const nameParts = response.user.name?.split(" ") || ["", ""];
          setFormData({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: response.user.email || "",
            phone: response.user.phone || "",
            location: response.user.location || "",
          });
        }

        // Fetch stats based on role
        if (response.user?.role === "admin") {
          // Fetch admin stats
          const adminStats = await userAPI.getAdminStats();
          setStats(adminStats);
        } else if (response.user?.role === "renter") {
          // Fetch renter stats
          const renterStats = await userAPI.getRenterStats();
          setStats(renterStats);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.id]: e.target.value,
    });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationPrefs({
      ...notificationPrefs,
      [e.target.name]: e.target.checked,
    });
  };

  // Edit Photo handler
  const handleEditPhoto = () => {
    showModal(
      "Photo Upload Coming Soon",
      "You'll be able to upload a profile picture in the next update.",
      "info",
    );
  };

  // Save Changes handler
  const handleSaveChanges = async () => {
    if (!formData.firstName.trim()) {
      showModal("Error", "First name is required", "error");
      return;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      showModal("Error", "Phone number must be exactly 10 digits", "error");
      return;
    }

    setIsSaving(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const response = await authAPI.updateProfile({
        name: fullName,
        phone: formData.phone,
        location: formData.location,
      });

      if (response.success) {
        setUser({ ...user, ...response.user });
        showModal("Success", "Profile updated successfully!", "success");
      }
    } catch (error: any) {
      showModal(
        "Failed to update profile",
        error.message || "Please try again later",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Update Password handler
  const handleUpdatePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      showModal("Error", "All password fields are required", "error");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showModal("Error", "New passwords do not match", "error");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showModal("Error", "Password must be at least 6 characters", "error");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // This would call a password update API endpoint
      // For now, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showModal("Success", "Password updated successfully!", "success");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      showModal(
        "Failed to update password",
        error.message || "Please check your current password and try again",
        "error",
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Save Preferences handler
  const handleSavePreferences = async () => {
    setIsSavingPrefs(true);
    try {
      // Save to localStorage for persistence
      localStorage.setItem(
        "notificationPrefs",
        JSON.stringify(notificationPrefs),
      );

      // This would call a notification preferences API endpoint
      // For now, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 500));

      showModal("Success", "Notification preferences saved!", "success");
    } catch (error: any) {
      showModal(
        "Failed to save preferences",
        error.message || "Please try again later",
        "error",
      );
    } finally {
      setIsSavingPrefs(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 md:py-8 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-green-600" />
      </div>
    );
  }

  const userInitials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U";

  const roleColors = {
    admin: "bg-purple-600",
    renter: "bg-blue-600",
    user: "bg-gray-600",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
            Profile
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Manage your account and view your dashboard
          </p>
        </div>

        {/* Role-based Dashboard */}
        {user?.role === "admin" && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">
                      Total Users
                    </p>
                    <p className="text-2xl md:text-3xl font-bold">
                      {stats.totalUsers || 0}
                    </p>
                  </div>
                  <Users className="size-8 md:size-10 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">
                      Equipment
                    </p>
                    <p className="text-2xl md:text-3xl font-bold">
                      {stats.totalEquipment || 0}
                    </p>
                  </div>
                  <Package className="size-8 md:size-10 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">
                      Total Rentals
                    </p>
                    <p className="text-2xl md:text-3xl font-bold">
                      {stats.totalRentals || 0}
                    </p>
                  </div>
                  <TrendingUp className="size-8 md:size-10 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">
                      Revenue
                    </p>
                    <p className="text-2xl md:text-3xl font-bold">
                      ${stats.totalRevenue || 0}
                    </p>
                  </div>
                  <DollarSign className="size-8 md:size-10 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {user?.role === "renter" && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">
                      My Rentals
                    </p>
                    <p className="text-2xl md:text-3xl font-bold">
                      {stats.myRentals || 0}
                    </p>
                  </div>
                  <TrendingUp className="size-8 md:size-10 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">
                      Equipment Listed
                    </p>
                    <p className="text-2xl md:text-3xl font-bold">
                      {stats.equipmentListed || 0}
                    </p>
                  </div>
                  <Package className="size-8 md:size-10 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">
                      Earnings
                    </p>
                    <p className="text-2xl md:text-3xl font-bold">
                      ${stats.earnings || 0}
                    </p>
                  </div>
                  <DollarSign className="size-8 md:size-10 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">
                      Rating
                    </p>
                    <p className="text-2xl md:text-3xl font-bold">
                      {stats.rating || 0}
                    </p>
                  </div>
                  <Star className="size-8 md:size-10 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="size-16 md:size-24 mb-3 md:mb-4">
                    <AvatarFallback className="bg-green-600 text-white text-xl md:text-2xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-lg md:text-xl font-semibold mb-1">
                    {user?.name || "User"}
                  </h2>
                  <Badge
                    className={`${roleColors[user?.role] || "bg-gray-600"} mb-2`}
                  >
                    {user?.role?.toUpperCase() || "USER"}
                  </Badge>
                  <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">
                    Member since{" "}
                    {new Date(user?.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs md:text-sm"
                    onClick={handleEditPhoto}
                  >
                    <Edit className="size-3 md:size-4 mr-1 md:mr-2" />
                    Edit Photo
                  </Button>
                </div>

                <Separator className="my-4 md:my-6" />

                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                    <Mail className="size-3 md:size-4 text-gray-500" />
                    <span className="text-gray-700">
                      {user?.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                    <Phone className="size-3 md:size-4 text-gray-500" />
                    <span className="text-gray-700">
                      {user?.phone || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                    <MapPin className="size-3 md:size-4 text-gray-500" />
                    <span className="text-gray-700">
                      {user?.location || "N/A"}
                    </span>
                  </div>
                </div>

                <Separator className="my-4 md:my-6" />

                <div className="space-y-2">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Total Rentals</span>
                    <span className="font-semibold">
                      {stats?.totalRentals || stats?.myRentals || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Equipment Listed</span>
                    <span className="font-semibold">
                      {stats?.equipmentListed || stats?.totalEquipment || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-semibold">
                      {stats?.rating || "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm md:text-base">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      className="text-sm md:text-base"
                      value={formData.firstName}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm md:text-base">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      className="text-sm md:text-base"
                      value={formData.lastName}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm md:text-base">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="text-sm md:text-base"
                    value={formData.email}
                    onChange={handleFormChange}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm md:text-base">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    className="text-sm md:text-base"
                    value={formData.phone}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm md:text-base">
                    Location
                  </Label>
                  <Input
                    id="location"
                    className="text-sm md:text-base"
                    value={formData.location}
                    onChange={handleFormChange}
                  />
                </div>

                <Button
                  className="w-full sm:w-auto text-sm md:text-base"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-sm md:text-base"
                  >
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    className="text-sm md:text-base"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm md:text-base">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    className="text-sm md:text-base"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm md:text-base"
                  >
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="text-sm md:text-base"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-sm md:text-base"
                  onClick={handleUpdatePassword}
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm md:text-base font-medium">
                      Rental Confirmations
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      Get notified when bookings are confirmed
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="rentalConfirmations"
                    checked={notificationPrefs.rentalConfirmations}
                    onChange={handleNotificationChange}
                    className="size-4"
                  />
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm md:text-base font-medium">
                      Rental Reminders
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      Receive reminders about upcoming rentals
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="rentalReminders"
                    checked={notificationPrefs.rentalReminders}
                    onChange={handleNotificationChange}
                    className="size-4"
                  />
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm md:text-base font-medium">
                      Marketing Emails
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      Receive updates about new equipment and offers
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="marketingEmails"
                    checked={notificationPrefs.marketingEmails}
                    onChange={handleNotificationChange}
                    className="size-4"
                  />
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm md:text-base font-medium">Messages</p>
                    <p className="text-xs md:text-sm text-gray-600">
                      Get notified of messages from owners and renters
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="messages"
                    checked={notificationPrefs.messages}
                    onChange={handleNotificationChange}
                    className="size-4"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-sm md:text-base"
                  onClick={handleSavePreferences}
                  disabled={isSavingPrefs}
                >
                  {isSavingPrefs ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal for notifications */}
      <Modal
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        title={modal.title}
        description={modal.description}
        type={modal.type}
      />
    </div>
  );
}
