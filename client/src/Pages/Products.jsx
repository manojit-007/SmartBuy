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

const AllProducts = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [pageNo, setPageNo] = useState(1);

  const { products, loading, error, totalPages } = useSelector(
    (state) => state.product
  );
  const lastFetchTime = useRef(0);

  useEffect(() => {
    document.title = `SmartBuy - All Products`;
  }, []);

  const throttledFetch = useCallback(() => {
    const now = Date.now();
    if (now - lastFetchTime.current >= 1000) {
      lastFetchTime.current = now;
      dispatch(
        fetchProducts({
          searchQuery: keyword || "",
          pageNo : 1,
          price : [0,25000],
        })
      );
    }
  }, [keyword, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetProductError());
    }
    throttledFetch();
  }, [keyword, pageNo, error, throttledFetch, dispatch]);

  const memoizedProducts = useMemo(() => products, [products]);

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = existingCart.find((item) => item._id === product._id);

    if (existingProduct) {
      const newQuantity = existingProduct.quantity + 1;

      if (newQuantity > product.quantity) {
        toast.error(`Cannot add more than ${product.quantity} items to the cart.`);
        return;
      }

      existingProduct.quantity = newQuantity;
    } else {
      existingCart.push({
        ...product,
        quantity: 1,
        maxQuantity: product.quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    toast.success("Product added to cart!");
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPageNo(newPage);
  };


  return (
    <main className="bg-gray-100 min-h-screen">
      <header className="w-full py-2 text-center">
        <h1 className="font-bold text-2xl text-gray-800">Feature Products</h1>
        <p className="text-gray-600">
          Explore our wide range of products and find what you need!
        </p>
      </header>
      <SearchBox />
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
                <div className="mt-4 flex gap-2 items-center justify-around">
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
          <PaginationItem>
            <PaginationPrevious
              aria-label="Previous section"
              disabled={pageNo <= 1}
              onClick={() => handlePageChange(pageNo - 1)}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index} active={pageNo === index + 1 ? "true" : undefined}>
              <PaginationLink onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              aria-label="Next section"
              disabled={pageNo >= totalPages}
              onClick={() => handlePageChange(pageNo + 1)}
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
