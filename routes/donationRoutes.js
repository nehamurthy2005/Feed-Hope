const express = require('express');
const router = express.Router();
const {
  getMyDonations,
  updateDonationStatus,
  getAllDonations,
} = require('../controllers/donationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getMyDonations);
router.get('/all', protect, adminOnly, getAllDonations);
router.put('/:id/status', protect, updateDonationStatus);

module.exports = router;
