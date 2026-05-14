const express = require('express');
const router = express.Router();
const {
  createFood,
  getAllFood,
  getFoodById,
  claimFood,
  deleteFood,
  getMyListings,
} = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getAllFood);
router.get('/my-listings', protect, getMyListings);
router.get('/:id', getFoodById);
router.post('/', protect, upload.single('image'), createFood);
router.put('/:id/claim', protect, claimFood);
router.delete('/:id', protect, deleteFood);

module.exports = router;
