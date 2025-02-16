import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/lib/Loader";
import { resetUserDetails, userDetail } from "@/Store/AuthSlice";
import {
  deleteProduct,
  fetchProductDetails,
  resetProductDetails,
} from "@/Store/ProductSlice";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SearchById = () => {
  const {
    productDetails,
    loading: productLoading,
    error: productError,
  } = useSelector((state) => state.product);
  const {
    userDetails,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.auth);

  const [id, setId] = useState("");
  const [type, setType] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!id || !type) {
      toast.error("Please select a type and provide an ID.");
      return;
    }
    try {
      let response;
      if (type === "product") {
        dispatch(resetUserDetails());
        response = await dispatch(fetchProductDetails(id));
        if (response?.meta?.requestStatus === "fulfilled") {
          toast.success("Fetched Product Successfully");
        } else {
          toast.error("Failed to fetch product details");
        }
      } else if (type === "user") {
        dispatch(resetProductDetails());
        response = await dispatch(userDetail(id));
        if (response?.meta?.requestStatus === "fulfilled") {
          toast.success("Fetched User Successfully");
        } else {
          toast.error("Failed to fetch User details");
        }
      } else {
        toast.error("Invalid search type selected.");
        return;
      }
    } catch (error) {
      toast.error(
        "An error occurred during the search. Please try again.",
        error
      );
    }
    setId("");
  };

  if (productLoading || userLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-950 bg-opacity-90 z-50">
        <Loader />
      </div>
    );
  }

  if (productError || userError) {
    const errorMsg = productError || userError || "An unknown error occurred.";
    toast.error(errorMsg);
  }

  return (
    <section className="p-4 max-w-screen-md mx-auto">
      <form
        onSubmit={handleSearch}
        className="flex gap-2 m-auto max-w-screen-sm items-center mb-4"
      >
        <Input
          id="search"
          type="text"
          value={id}
          placeholder="Search By Id"
          className="flex-1"
          onChange={(e) => setId(e.target.value)}
        />
        <Select onValueChange={(value) => setType(value)}>
          <SelectTrigger className="w-[90px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="product">Product</SelectItem>
            {/* <SelectItem value="order">Order</SelectItem> */}
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" className="px-4">
          <Search />
        </Button>
      </form>

      {/* User Details */}
      {userDetails && (
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-center">User Details</h2>
          <div className="flex flex-col gap-2">
            <Label htmlFor="user-id">ID</Label>
            <Input id="user-id" value={userDetails._id} readOnly />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="user-username">Username</Label>
            <Input id="user-username" value={userDetails.username} readOnly />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="user-email">Email</Label>
            <Input id="user-email" value={userDetails.email} readOnly />
          </div>
          <div className="flex flex-col gap-2">
            <Label>User Registered Date</Label>
            <span className="px-2 py-1 text-sm rounded-md bg-blue-100 text-blue-600">
              {new Date(userDetails.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Role</Label>
            <span className="px-2 py-1 text-sm rounded-md bg-blue-100 text-blue-600">
              {userDetails.role}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Email Verified</Label>
            <span
              className={`px-2 py-1 text-sm rounded-md ${
                userDetails.verified
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {userDetails.verified ? "Yes" : "No"}
            </span>
          </div>
        </div>
      )}

      {/* Product Details */}
      {productDetails && (
        <div className="space-y-4 bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold text-center">Product Details</h2>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" value={productDetails.name} readOnly />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="image">Product Image</Label>
            <img
              src={productDetails.image.url}
              alt={productDetails.name}
              className="w-full h-64 object-contain border rounded-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={productDetails.category} readOnly />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={productDetails.description}
              rows="5"
              readOnly
              // className="resize-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={productDetails.price}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="quantity">Stock Status</Label>
            <div className="flex items-center gap-2">
              <Input
                id="quantity"
                type="number"
                value={productDetails.quantity}
                readOnly
              />
              <span
                className={`inline-block w-3 h-3 rounded-full ${
                  productDetails.quantity === 0
                    ? "bg-red-500"
                    : productDetails.quantity < 100
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                title={
                  productDetails.quantity === 0
                    ? "Out of Stock"
                    : productDetails.quantity < 100
                    ? "Low Stock"
                    : "In Stock"
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              aria-label="Edit"
              className="p-2 flex-1 border-2 bg-white border-blue-200 rounded-md hover:bg-blue-100 text-blue-600"
              onClick={() =>
                navigate(`/dashboard/product/edit/${productDetails._id}`)
              }
            >
              <Edit />
            </Button>
            <Button
              aria-label="Delete"
              className="p-2 flex-1 border-2 bg-white border-red-200 rounded-md hover:bg-red-100 text-red-600"
              onClick={() => handleDeleteProduct(productDetails._id)}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default SearchById;
