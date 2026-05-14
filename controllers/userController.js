const User = require("../models/User");

// @desc    Update user profile
// @route   PUT /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.address) user.address = req.body.address;
    if (req.body.password) user.password = req.body.password;
    if (req.file) user.profilePic = `/uploads/${req.file.filename}`;

    // Location (for nearby alerts)
    if (req.body.lat && req.body.lng) {
      user.location = {
        lat: parseFloat(req.body.lat),
        lng: parseFloat(req.body.lng),
      };
    }
    // Alert preferences
    if (req.body.notifyNearby !== undefined) {
      user.notifyNearby =
        req.body.notifyNearby === "true" || req.body.notifyNearby === true;
    }
    if (req.body.alertRadius) {
      user.alertRadius = parseInt(req.body.alertRadius);
    }

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      phone: updated.phone,
      address: updated.address,
      profilePic: updated.profilePic,
      notifyNearby: updated.notifyNearby,
      alertRadius: updated.alertRadius,
      location: updated.location,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/user/all
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile, getAllUsers };
