const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Equipment = require("../models/Equipment");
const Rental = require("../models/Rental");
const { protect, authorize } = require("../middleware/auth");

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin or own profile)
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check authorization
    if (user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this user",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin or own profile)
router.put("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check authorization
    if (user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user",
      });
    }

    // Don't allow password update through this endpoint
    delete req.body.password;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   GET /api/users/admin/stats
// @desc    Get admin dashboard stats
// @access  Private (Admin only)
router.get("/admin/stats", protect, authorize("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEquipment = await Equipment.countDocuments();
    const totalRentals = await Rental.countDocuments();

    // Calculate total revenue from completed rentals
    const completedRentals = await Rental.find({ status: "completed" });
    const totalRevenue = completedRentals.reduce(
      (sum, rental) => sum + (rental.totalCost || 0),
      0,
    );

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalEquipment,
        totalRentals,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   GET /api/users/renter/stats
// @desc    Get renter dashboard stats
// @access  Private (Renter)
router.get(
  "/renter/stats",
  protect,
  authorize("renter", "admin"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      // Get user's equipment
      const equipmentListed = await Equipment.countDocuments({ owner: userId });

      // Get user's rentals (both as renter and owner)
      const myRentals = await Rental.countDocuments({ user: userId });

      // Calculate earnings from rentals of user's equipment
      const userEquipment = await Equipment.find({ owner: userId }).select(
        "_id",
      );
      const equipmentIds = userEquipment.map((eq) => eq._id);
      const equipmentRentals = await Rental.find({
        equipmentId: { $in: equipmentIds },
        status: "completed",
      });
      const earnings = equipmentRentals.reduce(
        (sum, rental) => sum + (rental.totalCost || 0),
        0,
      );

      // Calculate average rating (placeholder - would need reviews model)
      const rating = 4.5; // Placeholder

      res.status(200).json({
        success: true,
        data: {
          myRentals,
          equipmentListed,
          earnings,
          rating,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  },
);

module.exports = router;
