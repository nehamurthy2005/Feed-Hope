const User = require("../models/User");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Haversine formula — distance between two lat/lng points in km
const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Called when a new food listing is created
// Finds all receivers with notifyNearby=true whose location is within their alertRadius
const notifyNearbyReceivers = async (food) => {
  try {
    if (!food.location?.lat || !food.location?.lng) return;

    const receivers = await User.find({
      role: "receiver",
      notifyNearby: true,
      "location.lat": { $exists: true },
      "location.lng": { $exists: true },
    });

    const nearby = receivers.filter((u) => {
      const dist = getDistanceKm(
        food.location.lat,
        food.location.lng,
        u.location.lat,
        u.location.lng,
      );
      return dist <= (u.alertRadius || 10);
    });

    if (nearby.length === 0) return;

    const emails = nearby.map((u) => u.email);
    console.log(
      `📍 Notifying ${emails.length} nearby receiver(s) about "${food.title}"`,
    );

    await transporter.sendMail({
      from: `"Waste Food Management" <${process.env.EMAIL_USER}>`,
      bcc: emails,
      subject: `🍱 New food available near you: "${food.title}"`,
      html: `
        <h2>Food available near you!</h2>
        <p><strong>${food.title}</strong> has just been posted near your location.</p>
        <ul>
          <li><strong>Quantity:</strong> ${food.quantity}</li>
          <li><strong>Category:</strong> ${food.category}</li>
          <li><strong>Pickup address:</strong> ${food.address}</li>
          <li><strong>Expires:</strong> ${new Date(food.expiryDate).toLocaleDateString()}</li>
        </ul>
        <p>Log in to claim it before it's gone!</p>
      `,
    });
  } catch (err) {
    console.error("Nearby alert error:", err.message);
  }
};

module.exports = { notifyNearbyReceivers, getDistanceKm };
