const cron = require("node-cron");
const Food = require("../models/Food");

// Runs every hour — marks listings as expired if expiryDate has passed and still 'available'
const startExpiryCron = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();
      const result = await Food.updateMany(
        { status: "available", expiryDate: { $lt: now } },
        { $set: { status: "expired" } },
      );
      if (result.modifiedCount > 0) {
        console.log(
          `⏰ Expiry cron: marked ${result.modifiedCount} listing(s) as expired`,
        );
      }
    } catch (err) {
      console.error("Expiry cron error:", err.message);
    }
  });

  console.log("✅ Expiry cron job started (runs every hour)");
};

module.exports = { startExpiryCron };
