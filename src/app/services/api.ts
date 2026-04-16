// API Configuration
// In production (Vercel), use full URL from env variable
// In development, use relative /api path (proxied to localhost:5000)
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Set token in localStorage
const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

// Remove token from localStorage
const removeToken = (): void => {
  localStorage.removeItem("token");
};

// Get user from localStorage
const getUser = (): any => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Set user in localStorage
const setUser = (user: any): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Remove user from localStorage
const removeUser = (): void => {
  localStorage.removeItem("user");
};

// Generic API request function
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<any> => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: string;
  }) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.success) {
      setToken(response.token);
      setUser(response.user);
    }

    return response;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success) {
      setToken(response.token);
      setUser(response.user);
    }

    return response;
  },

  logout: async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      removeToken();
      removeUser();
    }
  },

  getCurrentUser: async () => {
    return await apiRequest("/auth/me");
  },

  updateProfile: async (userData: {
    name?: string;
    phone?: string;
    location?: string;
    avatar?: string;
  }) => {
    const response = await apiRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });

    if (response.success) {
      setUser(response.user);
    }

    return response;
  },
};

// Equipment API
export const equipmentAPI = {
  getAll: async (params?: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) => {
    const queryString = new URLSearchParams(params as any).toString();
    return await apiRequest(
      `/equipment${queryString ? `?${queryString}` : ""}`,
    );
  },

  getById: async (id: string) => {
    return await apiRequest(`/equipment/${id}`);
  },

  create: async (equipmentData: any) => {
    return await apiRequest("/equipment", {
      method: "POST",
      body: JSON.stringify(equipmentData),
    });
  },

  update: async (id: string, equipmentData: any) => {
    return await apiRequest(`/equipment/${id}`, {
      method: "PUT",
      body: JSON.stringify(equipmentData),
    });
  },

  delete: async (id: string) => {
    return await apiRequest(`/equipment/${id}`, {
      method: "DELETE",
    });
  },

  updateStatus: async (id: string, status: string) => {
    return await apiRequest(`/equipment/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  addReview: async (
    id: string,
    reviewData: { rating: number; comment: string },
  ) => {
    return await apiRequest(`/equipment/${id}/reviews`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  },
};

// Rental API
export const rentalAPI = {
  getAll: async () => {
    return await apiRequest("/rentals");
  },

  getById: async (id: string) => {
    return await apiRequest(`/rentals/${id}`);
  },

  create: async (rentalData: {
    equipmentId: string;
    startDate: string;
    endDate: string;
    notes?: string;
  }) => {
    return await apiRequest("/rentals", {
      method: "POST",
      body: JSON.stringify(rentalData),
    });
  },

  updateStatus: async (id: string, status: string) => {
    return await apiRequest(`/rentals/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  cancel: async (id: string) => {
    return await apiRequest(`/rentals/${id}`, {
      method: "DELETE",
    });
  },
};

// User API (Admin)
export const userAPI = {
  getAll: async () => {
    return await apiRequest("/users");
  },

  getById: async (id: string) => {
    return await apiRequest(`/users/${id}`);
  },

  update: async (id: string, userData: any) => {
    return await apiRequest(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  delete: async (id: string) => {
    return await apiRequest(`/users/${id}`, {
      method: "DELETE",
    });
  },

  getAdminStats: async () => {
    return await apiRequest("/users/admin/stats");
  },

  getRenterStats: async () => {
    return await apiRequest("/users/renter/stats");
  },
};

// Helper functions for auth state
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getCurrentUserData = (): any => {
  return getUser();
};

export default {
  apiRequest,
  authAPI,
  equipmentAPI,
  rentalAPI,
  userAPI,
  isAuthenticated,
  getCurrentUserData,
  getToken,
  setToken,
  removeToken,
};
