const Medicine = require('../models/Medicine');

// @desc    Add a new medicine
// @route   POST /api/medicines
exports.addMedicine = async (req, res) => {
    // Added 'category' to be read from the request body
    const { name, quantity, expiryDate, category } = req.body;

    const medicine = new Medicine({
        name,
        quantity,
        expiryDate,
        category, // Added 'category' to the new medicine object
        shop: req.user._id,
    });

    const createdMedicine = await medicine.save();
    res.status(201).json(createdMedicine);
};

// @desc    Get total inventory for the logged-in admin
// @route   GET /api/medicines/inventory
exports.getShopInventory = async (req, res) => {
    const medicines = await Medicine.find({ shop: req.user._id });
    res.json(medicines);
};

// @desc    Get medicines expiring in 30 days for a specific shop
// @route   GET /api/medicines/expiring/:shopId
exports.getExpiringMedicines = async (req, res) => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const medicines = await Medicine.find({
        shop: req.params.shopId,
        expiryDate: { $lte: thirtyDaysFromNow, $gte: new Date() },
    });
    res.json(medicines);
};

// @desc    Get medicines expiring in 30 days for a specific shop
// @route   GET /api/medicines/expiring/:shopId
exports.getExpiringMedicines = async (req, res) => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const medicines = await Medicine.find({
        shop: req.params.shopId,
        expiryDate: { $lte: thirtyDaysFromNow, $gte: new Date() },
    });
    res.json(medicines);
};