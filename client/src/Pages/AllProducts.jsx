import Loader from "@/lib/Loader";
import { resetProductError, fetchProducts } from "@/Store/ProductSlice";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import SearchBox from "./SearchBox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { DualRangeSlider } from "@/components/ui/DualRangeSlider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Helmet } from "react-helmet-async"; // For SEO meta tags

const AllProducts = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Books & Toys",
    "Sports & Outdoors",
    "Kitchen & Dining",
    "Beauty & Health",
    "Groceries & Perks",
    "Office Supplies",
    "Automotive",
    "Pets & Animals",
    "Baby & Kids",
    "Sports & Recreation",
    "Travel & Events",
    "Gifts & Donations",
    "Miscellaneous",
    "Accessories",
  ];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState([0, 25000]);

  const { products, loading, error, totalPages } = useSelector(
    (state) => state.product
  );
  const lastFetchTime = useRef(0);

  // Update document title for SEO
  useEffect(() => {
    document.title = `SmartBuy - All Products`;
  }, []);

  // Throttle API calls to avoid excessive requests
  const throttledFetch = useCallback(() => {
    const now = Date.now();
    if (now - lastFetchTime.current >= 1000) {
      toast.success("Apply filters");
      lastFetchTime.current = now;
      dispatch(
        fetchProducts({
          searchQuery: keyword || "",
          pageNo,
          price,
          category: selectedCategory,
          rating,
        })
      );
    }
  }, [keyword, pageNo, price, rating, selectedCategory, dispatch]);

  // Fetch products and handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetProductError());
    }
    throttledFetch();
  }, [keyword, pageNo, price, selectedCategory, rating, throttledFetch, error, dispatch]);

  // Memoize products to avoid unnecessary re-renders
  const memoizedProducts = useMemo(() => products, [products]);

  // Add product to cart

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = existingCart.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {
      // Calculate the new quantity
      const newQuantity = existingProduct.quantity + 1;

      if (newQuantity > product.quantity) {
        toast.error(
          `Cannot add more than ${product.quantity} items to the cart.`
        );
        return;
      }

      // Update the quantity if it doesn't exceed stock
      existingProduct.quantity = newQuantity;
      existingProduct.maxQuantity = product.quantity;
    } else {
      // Ensure quantity doesn't exceed available stock when adding a new product
      if (existingProduct?.maxQuantity > product.quantity) {
        toast.error(
          `Cannot add more than ${product.quantity} items to the cart.`
        );
        return;
      }

      existingCart.push({
        ...product,
        quantity: 1,
        maxQuantity: product.quantity,
      });
    }

    // Update the cart in localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));
    toast.success("Product added to cart!");
  };  

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPageNo(newPage);
  };

  // Handle price slider change
  const handleSliderChange = (newValue) => {
    setPageNo(1);
    setPrice(newValue);
  };

  return (
    <main className="bg-gray-100 min-h-screen">
      

      <header className="w-full py-2 text-center">
        <h1 className="font-bold text-2xl text-gray-800">All Products</h1>
        <p className="text-gray-600">
          Explore our wide range of products and find what you need!
        </p>
      </header>

      <SearchBox />

      <div className="flex w-full items-center justify-around">
      <div className="w-72 m-2 mx-4 flex gap-2 p-2 pt-4 pr-6 rounded-lg shadow-md bg-[#4c4b4b28]">
          <h2 className="text-base font-semibold text-gray-800 mb-2">Filter</h2>
          <DualRangeSlider
            value={price}
            onValueChange={handleSliderChange}
            min={0}
            max={25000}
            step={100}
            labelPosition="top"
            label={(value) => `₹${value}`}
          />
        </div>
        <Select onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Category" aria-label="Category section" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((categoryItem) => (
              <SelectItem
                key={categoryItem}
                value={categoryItem}
                selected={categoryItem === selectedCategory}
              >
                {categoryItem}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setRating(value)}>
          <SelectTrigger className="w-[85px] bg-gray-100 border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:ring-1 focus:ring-transparent">
            <SelectValue placeholder="Rating" aria-label="Rating section" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 rounded-lg shadow-lg">
            {[...Array(6).keys()].map((i) => (
              <SelectItem
                key={i}
                value={i}
                selected={i === rating}
                className={`flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                  i === rating ? "border" : ""
                }`}
              >
                <span>{i}</span>
                <span className="text-yellow-500">★</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex items-center justify-center z-50">
          <Loader />
        </div>
      ) : error ? (
        <section>
          <p className="text-red-500 text-center">{error}</p>
        </section>
      ) : (
        <section className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {memoizedProducts.length > 0 ? (
            memoizedProducts.map((product) => (
              <article
                key={product._id}
                className="border rounded-lg shadow bg-white p-4 flex flex-col justify-between"
                onClick={(e) => {
                  if (e.target.tagName !== "BUTTON") {
                    navigate(`/product/${product._id}`);
                  }
                }}
              >
                <figure className="w-full h-40 flex items-center justify-center">
                  <img
                    src={product.image?.url || "/placeholder.jpg"}
                    alt={product.name || "Product"}
                    className="max-h-full object-contain"
                    loading="lazy" // Lazy load images for better performance
                  />
                </figure>
                <div className="mt-4">
                  <h2 className="text-base font-semibold text-gray-800">
                    {product.name || "Unnamed Product"}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    ₹{product.price || "N/A"}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => navigate(`/product/${product._id}`)}>
                    Details
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              </article>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No products available.
            </p>
          )}
        </section>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem className="">
            <PaginationPrevious
              aria-label="Previous section"
              disabled={pageNo <= 1}
              className="bg-gray-800 text-white hover:bg-blue-500 hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(pageNo - 1);
              }}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem
              key={index}
              active={pageNo === index + 1 ? "true" : undefined}
            >
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(index + 1);
                }}
                className={
                  pageNo === index + 1
                    ? "bg-black text-white rounded hover:border-black mx-2 hover:bg-blue-500"
                    : "hover:border-black hover:bg-blue-500 mx-2" 
                }
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              aria-label="Next section"
              className="bg-gray-800 text-white hover:bg-blue-500 hover:text-white"
              disabled={pageNo >= totalPages}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(pageNo + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <p className="text-center text-sm mt-2">
        Page {pageNo} of {totalPages}
      </p>
    </main>
  );
};

export default AllProducts;