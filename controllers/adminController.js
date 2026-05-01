const User = require("../models/User");
const Food = require("../models/Food");
const Donation = require("../models/Donation");

// @desc    Get platform-wide stats for admin dashboard
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDonors,
      totalReceivers,
      totalFood,
      availableFood,
      claimedFood,
      completedFood,
      expiredFood,
      totalDonations,
      completedDonations,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "donor" }),
      User.countDocuments({ role: "receiver" }),
      Food.countDocuments(),
      Food.countDocuments({ status: "available" }),
      Food.countDocuments({ status: "claimed" }),
      Food.countDocuments({ status: "completed" }),
      Food.countDocuments({ status: "expired" }),
      Donation.countDocuments(),
      Donation.countDocuments({ status: "completed" }),
    ]);

    // Donations per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const donationsByDay = await Donation.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Food by category
    const foodByCategory = await Food.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Top donors
    const topDonors = await Food.aggregate([
      { $group: { _id: "$donor", totalPosts: { $sum: 1 } } },
      { $sort: { totalPosts: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "donor",
        },
      },
      { $unwind: "$donor" },
      {
        $project: {
          name: "$donor.name",
          email: "$donor.email",
          totalPosts: 1,
        },
      },
    ]);

    res.json({
      users: {
        total: totalUsers,
        donors: totalDonors,
        receivers: totalReceivers,
      },
      food: {
        total: totalFood,
        available: availableFood,
        claimed: claimedFood,
        completed: completedFood,
        expired: expiredFood,
      },
      donations: { total: totalDonations, completed: completedDonations },
      donationsByDay,
      foodByCategory,
      topDonors,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all food listings
// @route   GET /api/admin/food
const getAllFood = async (req, res) => {
  try {
    const foods = await Food.find()
      .populate("donor", "name email")
      .sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete any food listing
// @route   DELETE /api/admin/food/:id
const deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats, getAllUsers, deleteUser, getAllFood, deleteFood };
