const express = require('express');
const router = express.Router();
const { createMedicineRequest, getShopOrderRequests, handleOrderRequest, getDonationHistory, getUserOrderHistory } = require('../controllers/orderController');
const { protectAdmin, protectUser } = require('../middleware/authMiddleware');

router.post('/request', protectUser, createMedicineRequest);
router.get('/requests', protectAdmin, getShopOrderRequests);
router.put('/:id/action', protectAdmin, handleOrderRequest);
router.get('/history/donated', protectAdmin, getDonationHistory);
router.get('/history/my', protectUser, getUserOrderHistory);

module.exports = router;