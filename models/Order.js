// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total: Number,
  type: { type: String, enum: ['grooming', 'emergency', 'medicine', 'other', 'cart'] }, // Booking/Cart type
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed', 'in-progress', 'shipped'], default: 'pending' },
  details: mongoose.Schema.Types.Mixed // Flexible: for extra data
});

// Fix for OverwriteModelError in dev/reload: don't re-register if model exists
module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
