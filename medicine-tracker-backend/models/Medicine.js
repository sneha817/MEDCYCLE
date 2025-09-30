const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Admin' },
}, { timestamps: true });

const Medicine = mongoose.model('Medicine', medicineSchema);
module.exports = Medicine;