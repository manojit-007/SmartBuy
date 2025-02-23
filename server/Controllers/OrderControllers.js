const CatchAsyncError = require("../Middleware/CatchAsyncError");
const Order = require("../Models/OrderModel");
const Product = require("../Models/ProductModel");
const SendEmail = require("../Utils/SendEmail");

const createOrder = CatchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  // const email = req.email;
  const email = req.email;
  const { shippingInfo, orderItems, paymentInfo } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items provided" });
  }

  // Calculate prices
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  // const taxPrice = (itemsPrice * 0.05).toFixed(2); // Example: 5% tax
  const taxPrice = parseFloat((itemsPrice * 0.05).toFixed(2));

  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping for orders above $100
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // Create the order in the database
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    user: userId,
    paidAt: paymentInfo?.status === "Paid" ? Date.now() : null,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // Prepare the email content
  const orderDetails = orderItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">
            <img src="${item.image}" alt="${
        item.name
      }" style="width: 100px; height: auto;"/>
          </td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            item.quantity
          }</td>
          <td style="padding: 8px; border: 1px solid #ddd;">$${(
            item.quantity * item.price
          ).toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  const message = `
    <h2>Thank you for your order, ${userId}!</h2>
    <p>Order Details:</p>
    <table style="width: 100%; border-collapse: collapse; text-align: left;">
      <thead>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd;">Image</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Name</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${orderDetails}
      </tbody>
    </table>
    <p><strong>Items Price:</strong> $${itemsPrice.toFixed(2)}</p>
    <p><strong>Tax:</strong> $${taxPrice.toFixed(2)}</p>
    <p><strong>Shipping:</strong> $${shippingPrice.toFixed(2)}</p>
    <p><strong>Total:</strong> $${totalPrice.toFixed(2)}</p>
    <p><strong>Shipping Address:</strong></p>
    <p>${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${
    shippingInfo.country
  } - ${shippingInfo.pinCode}</p>
    <p><strong>Phone:</strong> ${shippingInfo.phoneNo}</p>
    <p>Thank you for shopping with us!</p>
  `;

  try {
    SendEmail({
      email: email,
      subject: `Order Confirmation - WanderShop`,
      message,
      isHtml: true,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).json({
      success: false,
      message: "Order created, but email could not be sent",
      order,
    });
  }
  res.status(201).json({
    success: true,
    message: `Order created successfully`,
    order,
  });
});

const GetUserAllOrders = CatchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  if (orders.length > 0) {
    res.status(200).json({
      success: true,
      orders,
      OrderCount: orders.length,
    });
  } else {
    res.status(404).json({
      message: "No orders found for this user",
      success: false,
    });
  }
});

const getOrderDetails = CatchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const role = req.role;
  const userId = req.userId; 

  try {
    // Fetch the order with the user's details populated
    const order = await Order.findById(id).populate("user", "username email _id");

    // Check if the role is admin OR the userId matches the order's userId
    if (role !== "admin" && userId.toString() !== order.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Only admin or the user who created the order can access this route.",
      });
    }

    // If the order exists, return it
    if (order) {
      res.status(200).json({
        success: true,
        message: "Order fetched successfully",
        order,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
  } catch (error) {
    console.error(`Error fetching order details: ${error.message}`);
    next(new ErrorHandler("Internal Server Error", 500));
  }
});
;

//admin

const getAllOrders = CatchAsyncError(async(req,res,next)=>{
  const role = req.role;
  if(role!== "admin"){
    return res.status(403).json({
      message: "Forbidden. Only admin can access this route",
      success: false,
    });
  }
  const orders = await Order.find().sort({createdAt: -1});

  let totalAmount = 0;

  orders.forEach(order => {
    totalAmount += order.totalPrice;
  });

  if(orders.length > 0){
    res.status(200).json({
      success: true,
      orders,
      totalAmount,
      OrderCount: orders.length,
    });
  }else{
    res.status(404).json({
      message: "No orders found",
      success: false,
    });
  }
});

const updateOrderStatus = CatchAsyncError(async (req, res, next) => {
  const role = req.role;
  if (role !== "admin") {
    return res.status(403).json({
      message: "Forbidden. Only admin can access this route.",
      success: false,
    });
  }
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      message: "Order not found.",
      success: false,
    });
  }
  if (order.orderStatus === "Delivered") {
    return res.status(400).json({
      message: "Order is already delivered.",
      success: false,
    });
  }
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  if(order.orderStatus === "Shipped" && req.body.status === "Shipped") {
    return res.status(400).json({
      message: "Order is already shipped.",
      success: false,
    });
  }
  if (order.orderStatus !== "Delivered" && req.body.status === "Shipped") {
    const updateStocks = async (id, quantity) => {
      const product = await Product.findById(id);
      console.log("Initial",product._id, product.quantity);
      if (!product) {
        throw new Error(`Product with ID ${id} not found.`);
      }
      product.quantity -= quantity;
      if (product.quantity < 0) {
        throw new Error(`Insufficient stock for product ${product.name}.`);
      }
      await product.save();
      console.log("Final",product._id, product.quantity);
    };
    for (const item of order.orderItems) {
      await updateStocks(item.product, item.quantity);
    }
  }
  order.orderStatus = req.body.status;
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    message: `Order status updated to '${req.body.status}'.`,
    success: true,
    order,
  });
});

const deleteOrder = CatchAsyncError(async(req,res,next)=>{
  const role = req.role;
  if(role!== "admin"){
    return res.status(403).json({
      message: "Forbidden. Only admin can access this route",
      success: false,
    });
  }
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id);
  if(!order){
    return res.status(404).json({
      message: "Order not found",
      success: false,
    });
  }
  res.status(200).json({
    message: "Order deleted successfully",
    success: true,
  });
})



module.exports = {
  createOrder,
  GetUserAllOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
};
