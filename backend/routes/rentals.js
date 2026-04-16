const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
const Equipment = require('../models/Equipment');
const { protect } = require('../middleware/auth');

// @route   GET /api/rentals
// @desc    Get all rentals (filtered by user role)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // If user is not admin, only show their rentals
    if (req.user.role !== 'admin') {
      query.$or = [
        { renter: req.user.id },
        { owner: req.user.id },
      ];
    }

    const rentals = await Rental.find(query)
      .populate('equipment', 'name images pricePerDay location')
      .populate('renter', 'name email phone')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
});

// @route   GET /api/rentals/:id
// @desc    Get single rental by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate('equipment', 'name images pricePerDay location category')
      .populate('renter', 'name email phone location')
      .populate('owner', 'name email phone location');

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found',
      });
    }

    // Check if user is authorized to view this rental
    if (
      rental.renter._id.toString() !== req.user.id &&
      rental.owner._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this rental',
      });
    }

    res.status(200).json({
      success: true,
      data: rental,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
});

// @route   POST /api/rentals
// @desc    Create new rental
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { equipmentId, startDate, endDate, notes } = req.body;

    // Get equipment details
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found',
      });
    }

    // Check availability
    if (!equipment.availability) {
      return res.status(400).json({
        success: false,
        message: 'Equipment is not available for rental',
      });
    }

    // Check if user is trying to rent their own equipment
    if (equipment.owner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot rent your own equipment',
      });
    }

    // Calculate total cost
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalCost = days * equipment.pricePerDay;

    // Check for overlapping rentals
    const overlappingRentals = await Rental.find({
      equipment: equipmentId,
      status: { $in: ['confirmed', 'active'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ],
    });

    if (overlappingRentals.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Equipment is already booked for these dates',
      });
    }

    const rental = await Rental.create({
      equipment: equipmentId,
      renter: req.user.id,
      owner: equipment.owner,
      startDate,
      endDate,
      totalCost,
      notes,
    });

    const populatedRental = await Rental.findById(rental._id)
      .populate('equipment', 'name images pricePerDay location')
      .populate('renter', 'name email')
      .populate('owner', 'name email');

    res.status(201).json({
      success: true,
      message: 'Rental created successfully',
      data: populatedRental,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
});

// @route   PUT /api/rentals/:id/status
// @desc    Update rental status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;

    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found',
      });
    }

    // Only owner or admin can update status
    if (
      rental.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this rental',
      });
    }

    rental.status = status;
    await rental.save();

    res.status(200).json({
      success: true,
      message: 'Rental status updated successfully',
      data: rental,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
});

// @route   DELETE /api/rentals/:id
// @desc    Cancel rental
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found',
      });
    }

    // Only renter can cancel (if pending/confirmed) or admin
    if (
      rental.renter.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this rental',
      });
    }

    if (rental.status === 'active' || rental.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel active or completed rentals',
      });
    }

    rental.status = 'cancelled';
    await rental.save();

    res.status(200).json({
      success: true,
      message: 'Rental cancelled successfully',
      data: rental,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
});

module.exports = router;
