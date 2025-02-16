import apiClient from "@/ApiClient/ApiClient";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Loader from "@/lib/Loader";
import { fetchUser } from "@/Store/AuthSlice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import OrderIcon from "@/assets/Order.svg";
import ReviewForm from "./ReviewForm";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(null); // To manage review form visibility

  useEffect(() => {
    document.title = `SmartBuy - Your Orders`;
    dispatch(fetchUser()).finally(() => setLoading(false));
  }, [dispatch]);

  if (!loading && !user) {
    navigate("/login");
  }

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/order/getUserOrders`, {
        withCredentials: true,
      });
      setOrders(response.data.orders);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const memoizedOrders = useMemo(() => orders, [orders]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      toast.error("Please login");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex items-center justify-center z-50">
        <Loader />
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen flex flex-col bg-gray-200 p-6">
      <header className="w-full text-center mb-6 text-2xl font-bold">
        Your Orders
      </header>

      {memoizedOrders.length > 0 ? (
        <Accordion type="single" collapsible>
          {memoizedOrders.map((order) => (
            <AccordionItem
              key={order._id}
              className="mb-2 rounded-sm p-2"
              value={`item-${order._id}`}
            >
              <AccordionTrigger className="bg-neutral-50 mb-1 rounded">
                <section className="w-full">
                  <div className="flex items-center flex-wrap justify-between gap-1 p-2">
                    <span className="text-gray-500 flex gap-1 items-center">
                      <img src={OrderIcon} className="w-4 h-4" />
                      <strong>Order ID:</strong> {order._id}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        order.orderStatus === "pending"
                          ? "text-red-500"
                          : order.orderStatus === "shipped"
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      <strong className="text-gray-500 font-bold">
                        Order Status:
                      </strong>{" "}
                      {order.orderStatus}
                    </span>

                    <span className="text-gray-500">
                      <strong>Order Date:</strong>{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                </section>
              </AccordionTrigger>
              <AccordionContent className="p-2 border-t rounded-sm bg-white">
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => navigate(`/product/${item.product}`)}
                      className="flex items-center gap-4 border-b pb-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded-lg"
                      />
                      <div
                        className="flex-grow"
                      >
                        <p className="text-lg font-medium text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: <strong>{item.quantity}</strong>
                        </p>
                        <p className="text-sm text-gray-500">
                          Price: <strong>₹{item.price.toFixed(2)}</strong>
                        </p>
                      </div>
                      {order.orderStatus === "Delivered" && (
                        <Button
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition-colors duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowReviewForm({
                              orderId: order._id,
                              productId: item.product,
                            });
                          }}
                        >
                          + Review
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-sm space-y-2 text-gray-600">
                  <p>
                    <strong>Ordered on:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Shipped to:</strong> {order.shippingInfo.address},{" "}
                    {order.shippingInfo.city}, {order.shippingInfo.pinCode}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹
                    {order.totalPrice.toFixed(2)}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <span className="text-green-600 font-bold">
                      {order.paymentInfo.status.charAt(0).toUpperCase() +
                        order.paymentInfo.status.slice(1)}
                    </span>
                  </p>
                  <p>
                    <strong>Order Status:</strong>{" "}
                    <span className="text-blue-500 font-bold">
                      {order.orderStatus}
                    </span>
                  </p>
                </div>
                <div className="mt-4 text-right">
                  <Button
                    className="text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-center text-gray-500">No orders found.</p>
      )}

      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-xl max-w-lg w-full relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 px-3 py-1 text-gray-500 hover:text-red-600 rounded hover:bg-gray-50 font-extrabold border focus:outline-none transition duration-300"
              onClick={() => setShowReviewForm(null)}
            >
              ✕
            </button>
            {/* Modal Content */}
            <header className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Add Your Review
            </header>
            <ReviewForm
              orderId={showReviewForm.orderId}
              productId={showReviewForm.productId}
              onSubmit={(reviewData) => {
                console.log("Submitted Review:", reviewData);
                setShowReviewForm(null);
                toast.success("Review submitted successfully!");
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default Orders;
