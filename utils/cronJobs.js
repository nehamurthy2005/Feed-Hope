const cron = require('node-cron');
const Food = require('../models/Food');

// Runs every hour — marks available listings as 'expired' if past expiry date
const startCronJobs = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const result = await Food.updateMany(
        {
          status: 'available',
          expiryDate: { $lt: new Date() },
        },
        { $set: { status: 'expired' } }
      );
      if (result.modifiedCount > 0) {
        console.log(`⏰ Auto-expired ${result.modifiedCount} food listing(s)`);
      }
    } catch (err) {
      console.error('Cron job error:', err.message);
    }
  });

  console.log('✅ Cron jobs started (auto-expire runs every hour)');
};

module.exports = { startCronJobs };
