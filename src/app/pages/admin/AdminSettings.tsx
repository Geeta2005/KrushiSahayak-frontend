import {
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";
import { Separator } from "../../components/ui/separator";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function AdminSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    platformName: "KrushiSahayak",
    supportEmail: "support@krushisahayak.com",
    contactPhone: "+1 (555) 123-4567",
    commissionRate: 15,
    notifications: {
      newUserRegistration: true,
      equipmentApproval: true,
      bookingConfirmation: true,
      paymentReceived: true,
    },
    security: {
      minPasswordLength: 8,
      requireEmailVerification: true,
      twoFactorAuth: true,
      sessionTimeout: 60,
    },
    payments: {
      stripeKey: "",
      currency: "USD",
      testMode: false,
    },
    appearance: {
      primaryColor: "#16a34a",
      logoUrl: "",
      faviconUrl: "",
    },
    regional: {
      timezone: "UTC-5",
      language: "en",
      dateFormat: "MM/DD/YYYY",
    },
  });

  const handleSave = async (section: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save settings
      console.log(`Saving ${section} settings:`, settings);
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Platform Settings
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Configure platform-wide settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="general" className="text-xs md:text-sm">
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs md:text-sm">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs md:text-sm">
            Security
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-xs md:text-sm">
            Payments
          </TabsTrigger>
          <TabsTrigger value="appearance" className="text-xs md:text-sm">
            Appearance
          </TabsTrigger>
          <TabsTrigger value="regional" className="text-xs md:text-sm">
            Regional
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                General Settings
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Basic platform configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platformName" className="text-sm md:text-base">
                  Platform Name
                </Label>
                <Input
                  id="platformName"
                  value={settings.platformName}
                  onChange={(e) =>
                    setSettings({ ...settings, platformName: e.target.value })
                  }
                  className="text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail" className="text-sm md:text-base">
                  Support Email
                </Label>
                <Input
                  id="supportEmail"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, supportEmail: e.target.value })
                  }
                  className="text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="text-sm md:text-base">
                  Contact Phone
                </Label>
                <Input
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) =>
                    setSettings({ ...settings, contactPhone: e.target.value })
                  }
                  className="text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="commissionRate"
                  className="text-sm md:text-base"
                >
                  Commission Rate (%)
                </Label>
                <Input
                  id="commissionRate"
                  type="number"
                  value={settings.commissionRate}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      commissionRate: parseInt(e.target.value),
                    })
                  }
                  className="text-sm md:text-base"
                />
              </div>
              <Button
                className="text-sm md:text-base"
                onClick={() => handleSave("general")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Bell className="size-5" />
                Notification Settings
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Configure system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    New User Registration
                  </p>
                  <p className="text-xs text-gray-500">
                    Get notified when new users sign up
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.newUserRegistration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        newUserRegistration: e.target.checked,
                      },
                    })
                  }
                  className="size-4"
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Equipment Listing Approval
                  </p>
                  <p className="text-xs text-gray-500">
                    Notify when equipment needs approval
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.equipmentApproval}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        equipmentApproval: e.target.checked,
                      },
                    })
                  }
                  className="size-4"
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Booking Confirmation
                  </p>
                  <p className="text-xs text-gray-500">
                    Notify on new booking confirmations
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.bookingConfirmation}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        bookingConfirmation: e.target.checked,
                      },
                    })
                  }
                  className="size-4"
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Payment Received
                  </p>
                  <p className="text-xs text-gray-500">
                    Notify when payments are received
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.paymentReceived}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        paymentReceived: e.target.checked,
                      },
                    })
                  }
                  className="size-4"
                />
              </div>
              <Button
                className="text-sm md:text-base"
                onClick={() => handleSave("notifications")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Shield className="size-5" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Platform security configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="minPasswordLength"
                  className="text-sm md:text-base"
                >
                  Minimum Password Length
                </Label>
                <Input
                  id="minPasswordLength"
                  type="number"
                  value={settings.security.minPasswordLength}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        minPasswordLength: parseInt(e.target.value),
                      },
                    })
                  }
                  className="text-sm md:text-base"
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Require Email Verification
                  </p>
                  <p className="text-xs text-gray-500">
                    Users must verify email before access
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.security.requireEmailVerification}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        requireEmailVerification: e.target.checked,
                      },
                    })
                  }
                  className="size-4"
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-gray-500">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        twoFactorAuth: e.target.checked,
                      },
                    })
                  }
                  className="size-4"
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Session Timeout
                  </p>
                  <p className="text-xs text-gray-500">
                    Auto-logout after inactivity
                  </p>
                </div>
                <select
                  className="px-4 py-2 border rounded-md text-sm bg-white"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        sessionTimeout: parseInt(e.target.value),
                      },
                    })
                  }
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="0">Never</option>
                </select>
              </div>
              <Button
                className="text-sm md:text-base"
                onClick={() => handleSave("security")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <CreditCard className="size-5" />
                Payment Settings
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Payment gateway configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripeKey" className="text-sm md:text-base">
                  Stripe API Key
                </Label>
                <Input
                  id="stripeKey"
                  type="password"
                  placeholder="sk_live_..."
                  value={settings.payments.stripeKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payments: {
                        ...settings.payments,
                        stripeKey: e.target.value,
                      },
                    })
                  }
                  className="text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm md:text-base">
                  Default Currency
                </Label>
                <select
                  id="currency"
                  className="w-full px-4 py-2 border rounded-md text-sm bg-white"
                  value={settings.payments.currency}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payments: {
                        ...settings.payments,
                        currency: e.target.value,
                      },
                    })
                  }
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Test Mode</p>
                  <p className="text-xs text-gray-500">
                    Use test payments for development
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.payments.testMode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payments: {
                        ...settings.payments,
                        testMode: e.target.checked,
                      },
                    })
                  }
                  className="size-4"
                />
              </div>
              <Button
                className="text-sm md:text-base"
                onClick={() => handleSave("payments")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Palette className="size-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Customize platform appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor" className="text-sm md:text-base">
                  Primary Color
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.appearance.primaryColor}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        appearance: {
                          ...settings.appearance,
                          primaryColor: e.target.value,
                        },
                      })
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    value={settings.appearance.primaryColor}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        appearance: {
                          ...settings.appearance,
                          primaryColor: e.target.value,
                        },
                      })
                    }
                    className="text-sm md:text-base flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-sm md:text-base">
                  Logo URL
                </Label>
                <Input
                  id="logo"
                  placeholder="https://example.com/logo.png"
                  value={settings.appearance.logoUrl}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appearance: {
                        ...settings.appearance,
                        logoUrl: e.target.value,
                      },
                    })
                  }
                  className="text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon" className="text-sm md:text-base">
                  Favicon URL
                </Label>
                <Input
                  id="favicon"
                  placeholder="https://example.com/favicon.ico"
                  value={settings.appearance.faviconUrl}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appearance: {
                        ...settings.appearance,
                        faviconUrl: e.target.value,
                      },
                    })
                  }
                  className="text-sm md:text-base"
                />
              </div>
              <Button
                className="text-sm md:text-base"
                onClick={() => handleSave("appearance")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Globe className="size-5" />
                Regional Settings
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Regional and localization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-sm md:text-base">
                  Default Timezone
                </Label>
                <select
                  id="timezone"
                  className="w-full px-4 py-2 border rounded-md text-sm bg-white"
                  value={settings.regional.timezone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      regional: {
                        ...settings.regional,
                        timezone: e.target.value,
                      },
                    })
                  }
                >
                  <option value="UTC-5">UTC-5 (Eastern Time)</option>
                  <option value="UTC-6">UTC-6 (Central Time)</option>
                  <option value="UTC-7">UTC-7 (Mountain Time)</option>
                  <option value="UTC-8">UTC-8 (Pacific Time)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm md:text-base">
                  Default Language
                </Label>
                <select
                  id="language"
                  className="w-full px-4 py-2 border rounded-md text-sm bg-white"
                  value={settings.regional.language}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      regional: {
                        ...settings.regional,
                        language: e.target.value,
                      },
                    })
                  }
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat" className="text-sm md:text-base">
                  Date Format
                </Label>
                <select
                  id="dateFormat"
                  className="w-full px-4 py-2 border rounded-md text-sm bg-white"
                  value={settings.regional.dateFormat}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      regional: {
                        ...settings.regional,
                        dateFormat: e.target.value,
                      },
                    })
                  }
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <Button
                className="text-sm md:text-base"
                onClick={() => handleSave("regional")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="size-4 mr-2 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
