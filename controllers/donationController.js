const Donation = require('../models/Donation');
const Food = require('../models/Food');

// @desc    Get donations for logged in user (as donor or receiver)
// @route   GET /api/donations
const getMyDonations = async (req, res) => {
  try {
    const { role } = req.query;
    let filter = {};

    if (role === 'donor') filter.donor = req.user._id;
    else if (role === 'receiver') filter.receiver = req.user._id;
    else filter = { $or: [{ donor: req.user._id }, { receiver: req.user._id }] };

    const donations = await Donation.find(filter)
      .populate('food', 'title image address expiryDate')
      .populate('donor', 'name email phone')
      .populate('receiver', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update donation status
// @route   PUT /api/donations/:id/status
const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    donation.status = status;
    if (status === 'completed') {
      donation.completedAt = new Date();
      await Food.findByIdAndUpdate(donation.food, { status: 'completed' });
    }

    await donation.save();
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all donations (admin only)
// @route   GET /api/donations/all
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('food', 'title')
      .populate('donor', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyDonations, updateDonationStatus, getAllDonations };
