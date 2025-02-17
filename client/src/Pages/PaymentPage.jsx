import apiClient from "@/ApiClient/ApiClient";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PaymentPage = () => {
  const [address, setAddress] = useState(null);
  const [cartItems, setCartItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const savedFormData = localStorage.getItem("order");
    const savedCartItems = localStorage.getItem("cart");
    setAddress(savedFormData ? JSON.parse(savedFormData) : null);
    setCartItems(savedCartItems ? JSON.parse(savedCartItems) : null);
  }, []);
  // console.log(cartItems);

  const checkout = async (amount) => {
    try {
      const { data } = await apiClient.post("/payment/checkout", { amount });
      // console.log(data);
      const options = {
        // key: import.meta.env.VITE_RAZORPAY_KEY,
        order_id: data.id,
        amount: data.amount,
        currency: "INR",
        name: "SmartBuy",
        description: "Payment Gateway Integration",
        image: "https://avatars.githubusercontent.com/u/159749926?v=4",
        callback_url: "/payment/paymentverification",
        prefill: {
          name: "Mono",
          email: "customer@example.com",
          contact: "9876543210",
        },
        notes: {
          address: "Customer Address",
        },
        theme: {
          color: "#121212",
        },
        handler: async function (response) {
          try {
            // Verify the payment
            const verificationData = await apiClient.post(
              "/payment/paymentverification",
              response,
              {
                headers: { "Content-Type": "application/json" },
              }
            );
            console.log(verificationData);

            // Payment verification success
            const { razorpay_payment_id } = response;

            // Store payment ID and update payment status
            const orderData = {
              shippingInfo: { ...address.shippingInfo },
              orderItems: cartItems.map((item) => ({
                product: item._id,
                name: item.name,
                quantity: item.quantity,
                image: item.image.url,
                price: item.price,
              })),
              paymentInfo: {
                id: razorpay_payment_id,
                status: "Paid",
              },
            };

            // Create the order
            const orderResponse = await apiClient.post(
              "/order/createOrder",
              orderData
            );
            if (orderResponse.data.success) {
              toast.success("Order placed successfully!");
              localStorage.removeItem("cart");
              navigate(`/order/${orderResponse.data.order._id}`);
            }
          } catch (error) {
            console.log(
              "Payment Verification Failed:",
              error.response?.data || error
            );
            toast.error("Failed to verify payment. Please try again.");
          }
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log("Checkout Error:", error);
      toast.error("Payment process failed. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please log in to proceed.");
      return navigate("/login");
    }

    if (!address || !cartItems || cartItems.length === 0) {
      toast.error(
        "Incomplete order details. Please verify your cart and address."
      );
      return;
    }

    try {
      setLoading(true);
      const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const totalAmount = (subtotal * 1.05).toFixed(2); // Adding 5% GST
      console.log(totalAmount);
      await checkout(totalAmount);
    } catch (error) {
      console.error("Order creation failed:", error.response?.data || error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <header className="w-full text-center mb-6">
        <h1 className="font-bold text-3xl text-gray-800">Payment</h1>
        <p className="text-gray-600">Securely complete your purchase</p>
      </header>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <form className="space-y-4">
          <Button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className={`w-full py-2 px-4 ${
              loading ? "bg-gray-400" : "bg-blue-600"
            } text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200`}
          >
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default PaymentPage;
