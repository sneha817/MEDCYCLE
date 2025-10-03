const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Painkiller', 'Antibiotic', 'Antiseptic', 'Antacid', 'Supplement', 'General']
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Admin'
  },
}, {
  timestamps: true
});

const Medicine = mongoose.model('Medicine', medicineSchema);
module.exports = Medicine;