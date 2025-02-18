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
import { ExternalLink, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

const AllOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filterOrder, setFilterOrder] = useState("AllOrders");
  const [animate, setAnimate] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  // Fetch orders from API
  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get("/order/getAllOrders");
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission for updating order status
  const handleFormSubmit = async (id, status) => {
    if (!status) {
      alert("Please select a type before updating the status.");
      return;
    }
    try {
      const res = await apiClient.put(
        `/order/updateOrder/${id}`,
        { status: status },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(res);
      toast.success(`Order ${id} updated to ${status}`);
      fetchAllOrders();
    } catch (error) {
      console.error("Error updating order:", error.message);
      alert("Failed to update order status.");
    }
  };

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
              aria-label="Refresh Orders"
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
                    {["AllOrders", "Processing", "Shipped", "Delivered"].map(
                      (filter) => (
                        <SelectItem key={filter} value={filter}>
                          {filter}
                        </SelectItem>
                      )
                    )}
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
                    <AccordionTrigger className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img
                          src={OrderIcon}
                          alt="Order"
                          className="w-5 h-5 object-contain"
                        />
                        <span
                          onClick={() =>
                            navigate(`/dashboard/order/${order._id}`)
                          }
                          className="text-sm text-gray-700 flex items-center justify-center gap-1"
                        >
                          <strong>Order ID:</strong> {order._id}{" "}
                          <ExternalLink className="w-4 h-4" />
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
                        {order.orderStatus}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="mt-2 bg-gray-50 p-4 rounded-lg">
                      <div className="mt-4 text-sm space-y-2">
                        <p>
                          <strong>Status:</strong> {order.orderStatus}
                        </p>
                        <form
                          className="flex items-center space-x-4 mt-4"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleFormSubmit(order._id, selectedType);
                          }}
                        >
                          <Select
                            onValueChange={(value) => setSelectedType(value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              {order.orderStatus !== "Shipped" &&
                              order.orderStatus !== "Delivered" ? (
                                <SelectItem value="Shipped">Shipped</SelectItem>
                              ) : (
                                ""
                              )}
                              <SelectItem value="Delivered">
                                Delivered
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button type="submit" disabled={!selectedType}>
                            Update
                          </Button>
                        </form>
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
