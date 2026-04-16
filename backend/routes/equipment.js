const express = require("express");
const router = express.Router();
const Equipment = require("../models/Equipment");
const { protect, authorize } = require("../middleware/auth");

// @route   GET /api/equipment
// @desc    Get all equipment
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, location, minPrice, maxPrice, search } = req.query;

    let query = { availability: true };

    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: "i" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    const equipment = await Equipment.find(query)
      .populate("owner", "name email phone location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: equipment.length,
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   GET /api/equipment/:id
// @desc    Get single equipment by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate(
      "owner",
      "name email phone location",
    );

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   POST /api/equipment
// @desc    Create new equipment
// @access  Private (Owner/Admin)
router.post("/", protect, authorize("owner", "admin"), async (req, res) => {
  try {
    const equipment = await Equipment.create({
      ...req.body,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Equipment created successfully",
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   PUT /api/equipment/:id
// @desc    Update equipment
// @access  Private (Owner/Admin)
router.put("/:id", protect, authorize("owner", "admin"), async (req, res) => {
  try {
    let equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    // Check ownership
    if (
      equipment.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this equipment",
      });
    }

    equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Equipment updated successfully",
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   DELETE /api/equipment/:id
// @desc    Delete equipment
// @access  Private (Owner/Admin)
router.delete(
  "/:id",
  protect,
  authorize("owner", "admin"),
  async (req, res) => {
    try {
      const equipment = await Equipment.findById(req.params.id);

      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: "Equipment not found",
        });
      }

      // Check ownership
      if (
        equipment.owner.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this equipment",
        });
      }

      await equipment.deleteOne();

      res.status(200).json({
        success: true,
        message: "Equipment deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  },
);

// @route   PATCH /api/equipment/:id/status
// @desc    Update equipment status
// @access  Private (Admin)
router.patch("/:id/status", protect, authorize("admin"), async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["pending", "active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Equipment status updated successfully",
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

// @route   POST /api/equipment/:id/reviews
// @desc    Add review to equipment
// @access  Private
router.post("/:id/reviews", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = equipment.reviews.find(
      (review) => review.user.toString() === req.user.id,
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this equipment",
      });
    }

    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment,
    };

    equipment.reviews.push(review);
    equipment.calculateRating();
    await equipment.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});

module.exports = router;
