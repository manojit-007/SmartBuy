import apiClient from "@/ApiClient/ApiClient";
import { useState, useEffect } from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const OrdersChart = () => {
  const [orderData, setOrderData] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await apiClient.get("/order/getAllOrders");
        setOrderData(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Prepare chart data: Only track totalPrice
  const chartData = orderData.map((order, index) => ({
    name: `Order ${index + 1}`,
    totalPrice: order.totalPrice,
  }));

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Order Total Price</h2>
      <div className="min-h-[200px] w-full min-w-full">
        {chartData.length > 0 ? (
          <BarChart width={200} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalPrice" fill="#2563eb" name="Total Price" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
    </div>
  );
};

export default OrdersChart;
