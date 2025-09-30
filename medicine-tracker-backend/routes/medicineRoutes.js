const express = require('express');
const router = express.Router();
const { addMedicine, getShopInventory, getExpiringMedicines } = require('../controllers/medicineController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/', protectAdmin, addMedicine);
router.get('/inventory', protectAdmin, getShopInventory);
router.get('/expiring/:shopId', getExpiringMedicines); // Public access

module.exports = router;