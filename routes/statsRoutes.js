const express = require("express");
const router = express.Router();
const { getImpactStats } = require("../controllers/statsController");

router.get("/", getImpactStats);

module.exports = router;
