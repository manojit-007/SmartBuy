import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/lib/Loader";
import { adminAllProducts, deleteProduct } from "@/Store/ProductSlice";
import { Clipboard, Edit, RefreshCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < 768,
    isTab: window.innerWidth < 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        isMobile: window.innerWidth < 768,
        isTab: window.innerWidth < 1024,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};

const ProductList = () => {
  const successStyle = {
    duration: 3000,
    position: "top-right",
    style: {
      background: "#fff",
      color: "#00796b",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector((state) => state.product);
  const { isMobile, isTab } = useScreenSize();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    dispatch(adminAllProducts());
  }, [dispatch]);

  const handleDeleteProduct = async (id) => {
    try {
      let res = await dispatch(deleteProduct(id));
      if (res?.meta?.requestStatus === "fulfilled") {
        toast.success("Product deleted successfully");
      } else {
        toast.error(
          res?.payload || "An error occurred while deleting the product"
        );
      }
    } catch (error) {
      toast.error(
        error?.message || "An error occurred while deleting the product"
      );
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-950 bg-opacity-90 z-50">
        <Loader />
      </div>
    );
  }

  return (
    <section className="p-4">
      <div className="max-w-screen-xl m-auto mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Product List</h1>
          <Button
            variant="secondary"
            className="border border-black rounded-md flex items-center gap-2 px-4 py-2"
            onClick={() => {
              setAnimate(true);
              dispatch(adminAllProducts());
              setTimeout(() => setAnimate(false), 500);
            }}
            aria-label="Refresh Product List"
          >
            <RefreshCcw
              className={`w-4 h-4 ${animate ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
        <div className="border-t mt-4"></div>
      </div>

      {products && products.length > 0 ? (
        <Table className="w-full border max-w-screen-xl mx-auto">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-center font-bold border-2 border-black text-black">
                Id
              </TableHead>
              {!isMobile && (
                <>
                  <TableHead className="text-center font-bold border-2 border-black text-black">
                    Product Name
                  </TableHead>
                  <TableHead className="text-center font-bold border-2 border-black text-black">
                    Price
                  </TableHead>
                </>
              )}
              {!isTab && (
                <TableHead className="text-center font-bold border-2 border-black text-black">
                  Category
                </TableHead>
              )}
              {!isMobile && (
                <TableHead className="text-center font-bold border-2 border-black text-black">
                  Stock
                </TableHead>
              )}
              <TableHead className="text-center font-bold border-2 border-black text-black">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id} className="hover:bg-blue-100">
                <TableCell className="text-center border-r border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <span className="truncate">{product._id}</span>
                    <Clipboard
                      className="w-4 h-4 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-100 transition-all cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(product._id);
                        toast.success("Id Copied", successStyle);
                      }}
                    />
                  </div>
                </TableCell>

                {!isMobile && (
                  <>
                    <TableCell className="text-center border-r border-gray-300">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-center border-r border-gray-300">
                      ₹{product.price.toFixed(2)}
                    </TableCell>
                  </>
                )}
                {!isTab && (
                  <TableCell className="text-center border-r border-gray-300">
                    {product.category || "N/A"}
                  </TableCell>
                )}
                {!isMobile && (
                  <TableCell className="text-center border-r border-gray-300">
                    {product.quantity > 0 ? product.quantity : "Out of stock"}
                  </TableCell>
                )}
                <TableCell className="text-center">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      aria-label="Edit"
                      className="p-2 rounded-md hover:bg-blue-100 text-blue-600"
                      onClick={() =>
                        navigate(`/dashboard/product/edit/${product._id}`)
                      }
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="secondary"
                      aria-label="Delete"
                      className="p-2 rounded-md hover:bg-red-100 text-red-600"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center text-gray-500">No products available.</p>
      )}
    </section>
  );
};

export default ProductList;
