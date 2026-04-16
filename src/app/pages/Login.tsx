import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Tractor, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { toast } from "sonner";
import { authAPI } from "../services/api";

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        const userRole = response.user?.role || "user";

        // Redirect admins to admin panel, others to home
        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

        toast.success("Login successful!", {
          description: `Welcome back, ${response.user?.name || "User"}`,
        });
      }
    } catch (error: any) {
      toast.error("Login failed", {
        description: error.message || "Please check your credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Tractor className="size-10 md:size-12 text-green-600" />
            <span className="text-2xl md:text-3xl font-bold text-gray-900">
              FarmRent
            </span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Sign in to access your account
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Enter your email and password to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm md:text-base">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 md:size-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 md:pl-12 text-sm md:text-base"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm md:text-base">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs md:text-sm text-green-600 hover:text-green-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 md:size-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 md:pl-12 pr-10 md:pr-12 text-sm md:text-base"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 md:size-5" />
                    ) : (
                      <Eye className="size-4 md:size-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full text-sm md:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs md:text-sm uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs md:text-sm"
                >
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs md:text-sm"
                >
                  Facebook
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <p className="text-center text-sm md:text-base text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
