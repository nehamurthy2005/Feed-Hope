const express = require('express');
const router = express.Router();
const { updateProfile, getAllUsers } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.put('/profile', protect, upload.single('profilePic'), updateProfile);
router.get('/all', protect, adminOnly, getAllUsers);

module.exports = router;
