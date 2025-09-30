const express = require('express');
const router = express.Router();
const { registerUser, loginUser, searchShops } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/shops/search', searchShops);

module.exports = router;