const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new admin (shop owner)
// @route   POST /api/admin/register
exports.registerAdmin = async (req, res) => {
    const { shopName, address, gstId, password } = req.body;
    const adminExists = await Admin.findOne({ gstId });
    if (adminExists) return res.status(400).json({ message: 'Admin with this GST ID already exists' });

    let location = {};
    try {
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
        console.log(`[Geocoding] Looking up address: "${address}"`);
        
        const { data } = await axios.get(geocodeUrl, {
            headers: { 'User-Agent': 'MedicineDonationApp/1.0' }
        });

        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            location = { lat: parseFloat(lat), lng: parseFloat(lon) };
            console.log(`[Geocoding] SUCCESS: Found coordinates Lat: ${location.lat}, Lng: ${location.lng}`);
        } else {
            console.warn(`[Geocoding] WARNING: Could not find coordinates for address "${address}". Saving shop without location.`);
        }
    } catch (error) {
        console.error('[Geocoding] CRITICAL ERROR:', error.message);
    }

    const admin = await Admin.create({ shopName, address, gstId, password, location });
    
    if (admin) {
        res.status(201).json({
            _id: admin._id,
            shopName: admin.shopName,
            gstId: admin.gstId,
            token: generateToken(admin._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid admin data' });
    }
};

// @desc    Authenticate admin & get token
// @route   POST /api/admin/login
exports.loginAdmin = async (req, res) => {
    const { gstId, password } = req.body;
    const admin = await Admin.findOne({ gstId });
    if (admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            shopName: admin.shopName,
            gstId: admin.gstId,
            token: generateToken(admin._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid GST ID or password' });
    }
};

// @desc    Update admin profile (settings page)
// @route   PUT /api/admin/profile
exports.updateAdminProfile = async (req, res) => {
    const admin = await Admin.findById(req.user._id);
    if (admin) {
        admin.shopName = req.body.shopName || admin.shopName;
        if (req.body.address && admin.address !== req.body.address) {
            admin.address = req.body.address;
            try {
                const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(req.body.address)}&format=json&limit=1`;
                console.log(`[Geocoding] Updating address: "${req.body.address}"`);

                const { data } = await axios.get(geocodeUrl, { headers: { 'User-Agent': 'MedicineDonationApp/1.0' }});
                
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    admin.location = { lat: parseFloat(lat), lng: parseFloat(lon) };
                    console.log(`[Geocoding] SUCCESS: Found new coordinates Lat: ${admin.location.lat}, Lng: ${admin.location.lng}`);
                } else {
                    console.warn(`[Geocoding] WARNING: Could not find coordinates for updated address. Location not changed.`);
                }
            } catch (error) {
                console.error('[Geocoding] CRITICAL ERROR during update:', error.message);
            }
        }
        const updatedAdmin = await admin.save();
        res.json({
            _id: updatedAdmin._id,
            shopName: updatedAdmin.shopName,
            address: updatedAdmin.address,
        });
    } else {
        res.status(404).json({ message: 'Admin not found' });
    }
};