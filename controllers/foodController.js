const Food = require("../models/Food");
const Donation = require("../models/Donation");
const { sendClaimEmail } = require("../utils/sendEmail");
const { notifyNearbyReceivers } = require("../utils/nearbyAlert");

// @desc    Post a new food listing
// @route   POST /api/food
const createFood = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      quantity,
      expiryDate,
      address,
      lat,
      lng,
    } = req.body;
    const food = await Food.create({
      donor: req.user._id,
      title,
      description,
      category,
      quantity,
      expiryDate,
      address,
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });
    notifyNearbyReceivers(food).catch(console.error);
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all food — search, filter, sort, paginate
// @route   GET /api/food?search=&category=&status=&sort=&page=&limit=
const getAllFood = async (req, res) => {
  try {
    const { search, category, status, sort, page = 1, limit = 12 } = req.query;
    const filter = {};
    filter.status = status || "available";
    if (category && category !== "all") filter.category = category;
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { address: { $regex: search.trim(), $options: "i" } },
      ];
    }
    const sortMap = {
      expiry: { expiryDate: 1 },
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };
    const sortObj = sortMap[sort] || { createdAt: -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Food.countDocuments(filter);
    const foods = await Food.find(filter)
      .populate("donor", "name email phone address")
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));
    res.json({
      foods,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single food listing
// @route   GET /api/food/:id
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate(
      "donor",
      "name email phone address",
    );
    if (!food)
      return res.status(404).json({ message: "Food listing not found" });
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Claim a food listing
// @route   PUT /api/food/:id/claim
const claimFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate(
      "donor",
      "name email",
    );
    if (!food)
      return res.status(404).json({ message: "Food listing not found" });
    if (food.status !== "available")
      return res.status(400).json({ message: "Food is no longer available" });
    if (food.donor._id.toString() === req.user._id.toString())
      return res
        .status(400)
        .json({ message: "You cannot claim your own listing" });
    food.status = "claimed";
    food.claimedBy = req.user._id;
    food.claimedAt = new Date();
    await food.save();
    await Donation.create({
      food: food._id,
      donor: food.donor._id,
      receiver: req.user._id,
    });
    sendClaimEmail(
      food.donor.email,
      food.donor.name,
      req.user.name,
      food.title,
    ).catch(console.error);
    res.json({ message: "Food claimed successfully", food });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete food listing
// @route   DELETE /api/food/:id
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (
      food.donor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    )
      return res.status(403).json({ message: "Not authorized" });
    await food.deleteOne();
    res.json({ message: "Food listing removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get foods posted by logged in donor
// @route   GET /api/food/my-listings
const getMyListings = async (req, res) => {
  try {
    const foods = await Food.find({ donor: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFood,
  getAllFood,
  getFoodById,
  claimFood,
  deleteFood,
  getMyListings,
};
