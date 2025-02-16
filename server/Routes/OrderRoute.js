const express = require('express');
const { createOrder, GetUserAllOrders, getOrderDetails, getAllOrders, updateOrderStatus, deleteOrder } = require('../Controllers/OrderControllers');
const { verifyUser } = require('../Middleware/VerifyToken');
const OrderRoute = express.Router();

OrderRoute.post('/createOrder',verifyUser,createOrder);
OrderRoute.get('/getOrderDetails/:id',verifyUser, getOrderDetails);
OrderRoute.get('/getUserOrders',verifyUser,GetUserAllOrders);

//admin routes
OrderRoute.get('/getAllOrders',getAllOrders);
OrderRoute.put('/updateOrder/:id',verifyUser,updateOrderStatus);
OrderRoute.delete('/:id',deleteOrder);

module.exports = OrderRoute;