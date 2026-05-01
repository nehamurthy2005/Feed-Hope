const express = require("express");
const router = express.Router();
const {
  getStats,
  getAllUsers,
  deleteUser,
  getAllFood,
  deleteFood,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/food", getAllFood);
router.delete("/food/:id", deleteFood);

module.exports = router;
