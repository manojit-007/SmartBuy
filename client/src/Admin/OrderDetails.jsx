import apiClient from "@/ApiClient/ApiClient";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const OrderDetail = () => {
  const { orderId } = useParams(); // Extract the orderId parameter
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = `SmartBuy - Admin Order Details`;

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/order/getOrderDetails/${orderId}`);
        if (data.success) {
          setOrderDetails(data.order);
        } else {
          throw new Error(data.message || "Failed to fetch order details.");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch order details."
        );
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <div className="text-center mt-10">Loading order details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Back Button */}
        <Button
          onClick={() => 
       
            navigate(-1)}
          className="mb-6 bg-gray-800 text-white hover:bg-gray-700"
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Details</h1>

        {/* Order Details */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold">Order ID:</span> {orderDetails._id}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`${
                orderDetails.orderStatus === "Delivered"
                  ? "text-green-500"
                  : "text-yellow-500"
              }`}
            >
              {orderDetails.orderStatus}
            </span>
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Payment Status:</span>{" "}
            <span
              className={`${
                orderDetails.paymentInfo?.status === "Paid"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {orderDetails.paymentInfo?.status}
            </span>
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Order Date:</span>{" "}
            {new Date(orderDetails.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Total Amount:</span> ₹
            {orderDetails.totalPrice.toFixed(2)}
          </p>
        </div>

        {/* Shipping Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Shipping Information
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {`${orderDetails.shippingInfo.address}, ${orderDetails.shippingInfo.city}, ${orderDetails.shippingInfo.state}, ${orderDetails.shippingInfo.country}, ${orderDetails.shippingInfo.pinCode}`}
            </p>
            <p>
              <span className="font-semibold">Phone No:</span>{" "}
              {orderDetails.shippingInfo.phoneNo}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Items
          </h2>
          <ul className="divide-y divide-gray-200">
            {orderDetails.orderItems.map((item) => (
              <li
                key={item.product}
                className="flex items-center space-x-4 py-4 cursor-pointer"
                onClick={() => navigate(`/product/${item.product}`)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-contain rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-gray-600">
                    Quantity:{" "}
                    <span className="font-semibold">{item.quantity}</span>
                  </p>
                  <p className="text-gray-600">
                    Price:{" "}
                    <span className="font-semibold">
                      ₹{item.price.toFixed(2)}
                    </span>
                  </p>
                </div>
             
              </li>
            ))}
          </ul>
        </div>

        {/* Review Form Modal */}

      </div>
    </div>
  );
};

export default OrderDetail;
