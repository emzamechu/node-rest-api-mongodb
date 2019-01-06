const express = require('express');
const router = express.Router();

const VerifyAuth = require('../middleware/verify-auth');

const OrdersController = require('../controllers/Orders');

//Get all orders
router.get('/', VerifyAuth, OrdersController.get_all_orders);

//add new order
router.post('/',VerifyAuth, OrdersController.add_new_order);

//Get specific order details
router.get('/:id',VerifyAuth, OrdersController.get_order_by_id);

//Delete specific order
router.delete('/:id',VerifyAuth, OrdersController.delete_order);

module.exports = router;