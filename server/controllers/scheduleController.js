// controllers/scheduleController.js
const Pickup = require('../models/Pickup');
const Notification = require('../models/Notification');

// @desc    Schedule a new pickup
// @route   POST /api/pickups
// @access  Private
exports.schedulePickup = async (req, res) => {
  const { pickupDate, wasteType } = req.body;

  try {
    const newPickup = new Pickup({
      user: req.user.id,
      pickupDate,
      wasteType,
    });

    const pickup = await newPickup.save();

    // Create a notification for the user
    await Notification.create({
        user: req.user.id,
        title: "Pickup Scheduled",
        message: `Your ${wasteType} waste pickup has been successfully scheduled for ${new Date(pickupDate).toLocaleDateString()}.`,
    });

    res.status(201).json(pickup);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get pickup history for a user
// @route   GET /api/pickups
// @access  Private
exports.getPickupHistory = async (req, res) => {
    try {
        const history = await Pickup.find({ user: req.user.id }).sort({ pickupDate: -1 });
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};