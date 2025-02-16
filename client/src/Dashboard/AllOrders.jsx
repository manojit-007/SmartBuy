import apiClient from "@/ApiClient/ApiClient";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useCallback, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OrderIcon from "@/assets/Order.svg";
import { RefreshCcw } from "lucide-react";

const AllOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filterOrder, setFilterOrder] = useState("AllOrders");
  const [animate, setAnimate] = useState(false);

  const filterOptions = ["AllOrders", "Processing", "Shipped", "Delivered"];

  // Fetch orders from API
  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get("/order/getAllOrders");
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial effect to fetch orders and check user role
  useEffect(() => {
    document.title = "SmartBuy - Admin - All Orders";

    if (!user) return;

    if (user.role !== "admin") {
      navigate("/error");
      return;
    }

    fetchAllOrders();
  }, [user, navigate, fetchAllOrders]);

  // Filter orders based on status
  const filteredOrders = useMemo(() => {
    if (filterOrder === "AllOrders") return orders;
    return orders.filter((order) => order.orderStatus === filterOrder);
  }, [orders, filterOrder]);

  return (
    <section className="w-full min-h-screen px-6 py-8 bg-gray-100">
      {user?.username ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Manage All Orders
            </h2>
            <Button
              variant="secondary"
              className="border border-black rounded-md flex items-center gap-2 px-4 py-2"
              onClick={() => {
                setAnimate(true);
                fetchAllOrders().finally(() => setAnimate(false));
              }}
              aria-label="Refresh Product List"
            >
              <RefreshCcw
                className={`w-4 h-4 ${animate ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Display loader, error, or empty state */}
          {loading && (
            <p className="text-center text-gray-500">Loading orders...</p>
          )}
          {error && (
            <p className="text-center text-red-500">
              Error: {error}. Please try refreshing the page.
            </p>
          )}
          {!loading && !error && orders.length === 0 && (
            <p className="text-center text-gray-500">No orders found.</p>
          )}

          {/* Orders List */}
          {!loading && !error && orders.length > 0 && (
            <>
              <div className="mb-6">
                <Select value={filterOrder} onValueChange={setFilterOrder}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.map((filter) => (
                      <SelectItem key={filter} value={filter}>
                        {filter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Accordion type="single" collapsible className="space-y-2">
                {filteredOrders.map((order) => (
                  <AccordionItem
                    key={order._id}
                    value={`item-${order._id}`}
                    className="bg-white shadow rounded-lg border p-4"
                  >
                    <AccordionTrigger className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2">
                        <img
                          src={OrderIcon}
                          alt="Order"
                          className="w-5 h-5 object-contain"
                        />
                        <span className="text-sm text-gray-700">
                          <strong>Order ID:</strong> {order._id}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          {
                            Processing: "text-red-600",
                            Shipped: "text-blue-600",
                            Delivered: "text-green-600",
                          }[order.orderStatus] || "text-gray-500"
                        }`}
                      >
                        {order.orderStatus.charAt(0).toUpperCase() +
                          order.orderStatus.slice(1)}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="mt-2 bg-gray-50 p-4 rounded-lg">
                      {/* Order Items */}
                      <div className="space-y-4">
                        {order.orderItems.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center gap-4 border-b pb-4"
                          >
                            <div className="flex-grow">
                              <p className="text-base font-medium text-gray-800">
                                Product ID: #{item.product}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Details */}
                      <div className="mt-4 text-sm text-gray-600 space-y-2">
                        <p>
                          <strong>Ordered on:</strong>{" "}
                          {new Date(order.createdAt).toLocaleString()}
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
                      </div>

                      {/* View Details Button */}
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
            </>
          )}
        </>
      ) : (
        <p className="text-center text-gray-600">
          Please log in to view orders.
        </p>
      )}
    </section>
  );
};

export default AllOrders;
