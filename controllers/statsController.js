const Food = require("../models/Food");
const User = require("../models/User");
const Donation = require("../models/Donation");

// @desc  Public platform impact stats
// @route GET /api/stats
const getImpactStats = async (req, res) => {
  try {
    const [
      totalDonors,
      totalReceivers,
      totalListings,
      completedDonations,
      availableNow,
      expiredListings,
    ] = await Promise.all([
      User.countDocuments({ role: "donor" }),
      User.countDocuments({ role: "receiver" }),
      Food.countDocuments(),
      Donation.countDocuments({ status: "completed" }),
      Food.countDocuments({ status: "available" }),
      Food.countDocuments({ status: "expired" }),
    ]);

    // Meals saved estimate: 1 donation ≈ 4 meals on average
    const mealsSaved = completedDonations * 4;

    // CO2 saved estimate: 1 meal saved ≈ 2.5 kg CO2
    const co2SavedKg = mealsSaved * 2.5;

    // Donations per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const donationsByMonth = await Donation.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Food saved by category
    const byCategory = await Food.aggregate([
      { $match: { status: { $in: ["claimed", "completed"] } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Recent completed donations (activity feed)
    const recentActivity = await Donation.find({ status: "completed" })
      .populate("food", "title category")
      .populate("donor", "name")
      .populate("receiver", "name")
      .sort({ completedAt: -1 })
      .limit(5);

    res.json({
      totals: {
        donors: totalDonors,
        receivers: totalReceivers,
        listings: totalListings,
        completedDonations,
        availableNow,
        expiredListings,
        mealsSaved,
        co2SavedKg: Math.round(co2SavedKg),
      },
      donationsByMonth,
      byCategory,
      recentActivity,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getImpactStats };
