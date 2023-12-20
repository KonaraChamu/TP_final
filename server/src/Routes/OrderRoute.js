const express = require("express");
const OrdersController = require("../controllers/orderController");

const router = express.Router();

router.post("/", OrdersController.createOrder);
router.get("/kitchen", OrdersController.getKitchenOrders);
router.get("/client", OrdersController.getClientOrders);
router.post("/status/:orderId", OrdersController.updateOrderStatus);

module.exports = router;
