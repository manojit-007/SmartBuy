/* eslint-disable react/prop-types */

import apiClient from "@/ApiClient/ApiClient";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ReviewForm = ({ orderId, productId }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [reviewForm, setReviewForm] = useState({
    productId: productId,
    rating: 0,
    comment: "",
    username: user?.username || "", // Initialize with username from Redux
    orderId: orderId,
    createdAt: new Date(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(reviewForm);
    const res = await apiClient.put("/product/review", reviewForm, {
      "Content-Type": "application/json",
    });
    console.log(res);
    toast.success(res.data.message);
    setReviewForm({
      productId: productId,
      rating: 0,
      comment: "",
      username: user?.username || "",
      orderId: orderId,
      createdAt: new Date(),
    });
    navigate(`/order/${orderId}`);
  };

  return (
    <section className="p-4 border rounded-md bg-white shadow-sm">
      <header className="mb-4 text-lg font-semibold">Add Review</header>
      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="username"
          >
            Username
          </label>
          <Input
            id="username"
            name="username"
            value={reviewForm.username}
            readOnly
            className="mt-1"
          />
        </div>

        {/* Product ID Field */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="productId"
          >
            Product ID
          </label>
          <Input id="productId" value={productId} readOnly className="mt-1" />
        </div>

        {/* Rating Field */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="rating"
          >
            Rating
          </label>
          <select
            id="rating"
            name="rating"
            value={reviewForm.rating}
            onChange={handleChange}
            className="mt-1 block w-full border p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value={0} disabled>
              Select Rating
            </option>
            {[1, 2, 3, 4, 5].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>

        {/* Comment Field */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="content"
          >
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            value={reviewForm.comment}
            onChange={handleChange}
            rows="4"
            className="mt-1 p-2 block w-full border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700"
          >
            Submit Review
          </button>
        </div>
      </form>
    </section>
  );
};

export default ReviewForm;
