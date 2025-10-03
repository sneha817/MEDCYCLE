const OrderRequest = require('../models/OrderRequest');

// @desc    Create a new medicine request from a user
// @route   POST /api/orders/request
exports.createMedicineRequest = async (req, res) => {
    const { medicineName, email, phone, quantity, shopId } = req.body;
    const orderRequest = new OrderRequest({
        medicineName, email, phone, quantity,
        user: req.user._id, // from protectUser middleware
        shop: shopId,
    });
    const createdRequest = await orderRequest.save();

    // After saving, emit a notification to the specific admin's room
    if (createdRequest) {
      req.io.to(shopId).emit('newRequestNotification', { 
        message: `You have a new request for ${medicineName}!` 
      });
    }

    res.status(201).json(createdRequest);
};

// @desc    Get all pending order requests for a shop
// @route   GET /api/orders/requests
exports.getShopOrderRequests = async (req, res) => {
    const orders = await OrderRequest.find({ shop: req.user._id, status: 'Pending' });
    res.json(orders);
};

// @desc    Admin action to accept or reject an order
// @route   PUT /api/orders/:id/action
exports.handleOrderRequest = async (req, res) => {
    const order = await OrderRequest.findById(req.params.id);
    if (order && order.shop.toString() === req.user._id.toString()) {
        order.status = req.body.status; // 'Accepted' or 'Rejected'
        order.actionDate = Date.now();
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found or not authorized' });
    }
};

// @desc    Get donated medicine history for an admin
// @route   GET /api/orders/history/donated
exports.getDonationHistory = async (req, res) => {
    const orders = await OrderRequest.find({ shop: req.user._id, status: { $in: ['Accepted', 'Rejected'] } })
        .populate('user', 'email')
        .sort({ actionDate: -1 });

    const history = orders.map(order => ({
        userName: order.user ? order.user.email : order.email,
        amount: order.quantity,
        date: order.actionDate,
        status: order.status,
    }));
    res.json(history);
};

// @desc    Get order history for a logged-in user
// @route   GET /api/orders/history/my
exports.getUserOrderHistory = async (req, res) => {
    const orders = await OrderRequest.find({ user: req.user._id })
        .populate('shop', 'shopName')
        .sort({ createdAt: -1 });
    res.json(orders);
};