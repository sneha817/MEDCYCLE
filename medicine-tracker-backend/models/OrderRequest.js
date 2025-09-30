const mongoose = require('mongoose');

const orderRequestSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  shop: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Admin' },
  actionDate: { type: Date },
}, { timestamps: true });

const OrderRequest = mongoose.model('OrderRequest', orderRequestSchema);
module.exports = OrderRequest;