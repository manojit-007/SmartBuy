const express = require('express');

const { checkout, verifyPayment } = require("../Controllers/Paymentcontroller");

const paymentRoute = express.Router();

paymentRoute.post('/checkout', checkout);
paymentRoute.post('/paymentverification', verifyPayment);
module.exports = paymentRoute;
