import { useEffect, useState } from "react";
import apiClient from "@/ApiClient/ApiClient";

const CreatedProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (currentPage) => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `/product/allUserProducts?page=${currentPage}&limit=5`,
        { withCredentials: true }
      );
      const { products, totalPages } = response.data;
      setProducts(products);
      setTotalPages(totalPages);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err.message);
      setError(err.response?.data?.message || "Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handlePrevious = () => setPage((prevPage) => Math.max(1, prevPage - 1));
  const handleNext = () =>
    setPage((prevPage) => Math.min(totalPages, prevPage + 1));

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-blue-500 text-lg">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => fetchProducts(page)}
          className="px-5 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );

  return (
    <section className="bg-gray-50 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Your Created Products
      </h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          You haven&apos;t created any products yet.
        </p>
      ) : (
        <>
          <div className="hidden md:grid md:grid-cols-5 items-center gap-4 text-sm font-medium text-gray-700 border-b pb-2 w-full max-w-4xl">
            <h2 className="text-lg font-medium text-left">Image</h2>
            <h2 className="text-lg font-medium text-left">Name</h2>
            <h2 className="text-lg font-medium text-left">Price</h2>
            <h2 className="text-lg font-medium text-left">Quantity</h2>
            <h2 className="text-lg font-medium text-center">Edit</h2>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-4xl">
            {products.map((product) => (
              <div
                key={product._id}
                className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 border p-4 rounded-lg shadow hover:shadow-lg hover:bg-gray-100 transition"
              >
                {/* Product Image */}
                <div className="flex justify-center md:justify-start">
                  <img
                    src={product.image?.url || "/placeholder-image.png"}
                    alt={product.name}
                    className="w-16 h-16 md:w-12 md:h-12 object-contain rounded"
                  />
                </div>

                {/* Product Name */}
                <p className="text-base text-gray-800 truncate text-center md:text-left">
                  {product.name}
                </p>

                {/* Product Price */}
                <p className="text-sm text-gray-600 text-center md:text-left">
                ₹{product.price}
                </p>

                {/* Product Quantity */}
                <p
                  className={`text-sm text-center md:text-left ${
                    product.quantity === 0
                      ? "text-red-600 font-bold"
                      : "text-gray-600"
                  }`}
                >
                  {product.quantity === 0 ? "Out of stock" : product.quantity}
                </p>

                {/* Edit Button */}
                <div className="flex justify-center md:justify-end">
                  <button className="flex items-center px-3 py-1 text-white font-medium rounded-md bg-blue-500 hover:bg-blue-600 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 19H4a2 2 0 01-2-2V7a2 2 0 012-2h7m5.586 0l2.707 2.707a1 1 0 010 1.414L12.414 15 9 15l.293-3.293 7.293-7.293z"
                      />
                    </svg>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-8 w-full max-w-4xl">
            <button
              onClick={handlePrevious}
              disabled={page === 1 || loading}
              className={`px-5 py-2 rounded-lg text-white font-medium transition ${
                page === 1 || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages || loading}
              className={`px-5 py-2 rounded-lg text-white font-medium transition ${
                page === totalPages || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default CreatedProductList;
