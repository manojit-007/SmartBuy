const crypto = require("crypto");
const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    // console.log("Order Created:", order);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

const verifyPayment = async (req, res) => {
  // console.log(req.body);
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Incomplete payment details received.",
        });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    // console.log("Payment Verified Successfully:", req.body);

    res.status(200).json({
      success: true,
      paymentId: razorpay_payment_id,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
};

module.exports = { checkout, verifyPayment };
