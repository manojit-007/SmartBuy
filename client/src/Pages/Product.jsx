import Cart from "@/assets/Cart.svg";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "@/lib/Loader";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "@/Store/ProductSlice";
import { Input } from "@/components/ui/input";
import ReviewCard from "./ReviewCard";

const Product = () => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { productId } = useParams();
  const dispatch = useDispatch();

  const { productDetails, loading, error } = useSelector(
    (state) => state.product
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    document.title = productDetails?.name
      ? `${productDetails.name} - Details`
      : "Product Details";
  }, [productDetails]);

  const addToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = existingCart.find(
      (item) => item._id === productDetails._id
    );

    if (existingProduct) {
      // Calculate the new quantity
      const newQuantity = existingProduct.quantity + quantity;

      if (newQuantity > productDetails.quantity) {
        toast.error(
          `Cannot add more than ${productDetails.quantity} items to the cart.`
        );
        return;
      }

      // Update the quantity if it doesn't exceed stock
      existingProduct.quantity = newQuantity;
      existingProduct.maxQuantity = productDetails.quantity;
    } else {
      // Ensure quantity doesn't exceed available stock when adding a new product
      if (quantity > productDetails.quantity) {
        toast.error(
          `Cannot add more than ${productDetails.quantity} items to the cart.`
        );
        return;
      }

      existingCart.push({
        ...productDetails,
        quantity,
        maxQuantity: productDetails.quantity,
      });
    }

    // Update the cart in localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));
    toast.success("Product added to cart!");
    setQuantity(1); // Reset quantity after adding to cart
  };

  if (!productId) {
    return (
      <div className="text-gray-500 text-center mt-4">
        <p>No product selected.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-950 bg-opacity-90 z-50">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-xl font-bold tracking-wide text-center mt-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="text-gray-500 text-center mt-4">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-4xl bg-white shadow-lg rounded-lg flex flex-col md:flex-row relative">
        <Button
          className="absolute top-4 left-4 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <div className="w-full md:w-1/2 p-4">
          <img
            src={productDetails?.image?.url || "/placeholder.jpg"}
            alt={productDetails?.name || "Product"}
            className="w-full h-auto object-contain rounded-lg shadow border"
          />
        </div>
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 capitalize mb-4">
              {productDetails?.name || "Unnamed Product"}
            </h2>
            <p className="text-blue-600 capitalize text-sm mb-2">
              {productDetails?.category || "No category available"}
            </p>
            {productDetails?.creator.toString() === user?._id?.toString() && (
              <Button
                className="mb-2"
                onClick={() => navigate(`/product/edit/${productDetails._id}`)}
              >
                Edit
              </Button>
            )}
            <p className="text-gray-600 text-sm mb-4">
              {productDetails?.description || "No description available"}
            </p>
            <p className="text-gray-600 text-sm mb-4">
              <span className="text-sm text-gray-600 mb-4 mr-2">
                {productDetails?.ratings ? (
                  <span className="text-yellow-500 font-bold">
                    {productDetails.ratings} ★
                  </span>
                ) : (
                  "0 ★"
                )}
              </span>
              {productDetails?.numOfReviews || "0"} Reviews
            </p>

            <p className="text-lg font-bold mb-4">
              ₹{productDetails?.price || "N/A"}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Button
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
              >
                -
              </Button>
              <Input
                value={quantity}
                readOnly={true}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                type="number"
                className="w-16 text-center"
              />
              <Button
                onClick={() =>
                  setQuantity((prev) =>
                    Math.min(prev + 1, productDetails.quantity || prev)
                  )
                }
                className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
              >
                +
              </Button>
            </div>
            <p className="text-lg font-bold text-green-600 mb-4">
              {productDetails?.quantity === 0
                ? "Out of stock"
                : productDetails?.quantity < 10
                ? "Only a few left"
                : "In stock"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate(`/cart`)}
              className="py-3 px-6 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow transition"
            >
              View Cart
            </Button>
            <Button
              onClick={addToCart}
              disabled={productDetails?.quantity === 0}
              className={`py-3 px-6 text-white rounded-md shadow transition ${
                productDetails?.quantity === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <span className="text-sm font-medium">
                {productDetails?.quantity === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </span>
              <img src={Cart} className="w-5 h-5 ml-2" alt="Cart Icon" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-4 max-w-4xl flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Reviews</h3>
        {productDetails?.reviews?.length > 0 ? (
          <ul className="list-inside list-none text-gray-600 flex gap-2 flex-wrap">
            {productDetails.reviews.slice(0, 3).map((review, index) => (
              <ReviewCard review={review} key={index} />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 font-medium">No reviews available</p>
        )}
      </div>
    </section>
  );
};

export default Product;
