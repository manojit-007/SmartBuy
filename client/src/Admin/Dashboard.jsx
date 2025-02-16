import { Card } from "@/components/ui/card";
import Charts from "./Charts";
import { useEffect, useState } from "react";
import apiClient from "@/ApiClient/ApiClient";
import { toast } from "sonner";
import Loader from "@/lib/Loader";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await apiClient.get("/product/allProducts");
        const products = response.data.Products || [];
        const inStockCount = products.reduce(
          (acc, product) => acc + (product.quantity > 0 ? 1 : 0),
          0
        );
        const outOfStockCount = products.length - inStockCount;

        setData([
          { status: "InStock", counts: inStockCount, fill: "#4635f1" },
          { status: "OutOfStocks", counts: outOfStockCount, fill: "#D70654" },
        ]);
      } catch (error) {
        toast.error("Error fetching products");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getAllProducts();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex items-center justify-center z-50">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Card className="p-4 flex-grow w-full text-center mb-2">
        <h3 className="text-lg font-medium">Total Sales</h3>
        <p className="text-2xl font-bold">₹45,000</p>
      </Card>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium">Total Products</h3>
          <p className="text-2xl font-bold">
            {data.reduce((acc, item) => acc + item.counts, 0)}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-medium">Total Users</h3>
          <p className="text-2xl font-bold">12</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-medium">Total Orders</h3>
          <p className="text-2xl font-bold">32</p>
        </Card>
      </section>
      <Charts data={data} />
    </>
  );
};

export default Dashboard;
