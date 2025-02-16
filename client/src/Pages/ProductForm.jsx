import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import DefaultImage from "@/assets/upload.png";
import UploadIcon from "../assets/Upload.svg";
import apiClient from "@/ApiClient/ApiClient";
import Loader from "@/lib/Loader";
import { useDispatch } from "react-redux";
import { addProduct } from "@/Store/ProductSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductForm = () => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
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
  const [imageUpload, setImageUpload] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    image: {
      url: "",
      public_id: "",
    },
  });
  useEffect(() => {
    document.title = `SmartBuy - Adding New Product`;
  }, []);
  useEffect(() => {
    const savedFormData = localStorage.getItem("productForm");
    if (savedFormData) {
      setProductForm(JSON.parse(savedFormData));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("productForm", JSON.stringify(productForm));
  }, [productForm]);
  const handleDeleteUploadedImage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post(`/product/image/delete`, {
        image: productForm.image,
      });
      toast.success(res.data.message);
      setProductForm((prev) => ({
        ...prev,
        image: { url: "", public_id: "" },
      }));
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUpload(file);
    toast.success("Image selected successfully. Please upload it.");
  };
  const handleImageUpload = async () => {
    if (!imageUpload) {
      toast.error("No image selected for upload.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("image", imageUpload);
    try {
      const res = await apiClient.post("/product/uploadImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUpload(null);
      fileInputRef.current.value = null;
      toast.success("Image uploaded successfully!");
      setProductForm((prev) => ({
        ...prev,
        image: { url: res.data.url, public_id: res.data.public_id },
      }));
    } catch (error) {
      console.log(error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.image.url) {
      toast.error("Please upload a product image.");
      return;
    }
    setLoading(true);
    try {
      await dispatch(addProduct(productForm));
      toast.success("Product added successfully!");
      localStorage.removeItem("productForm");
      setProductForm({
        name: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        image: { url: "", public_id: "" },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to add the product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-col items-center justify-center">
      {loading && (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <h2 className="text-xl font-semibold mt-2">Add New Product</h2>
      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4 w-full max-w-lg p-6 bg-white rounded-lg shadow-md"
      >
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={productForm.name}
          onChange={handleInputChange}
          placeholder="Enter product name"
          required
        />
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={productForm.price}
          onChange={handleInputChange}
          placeholder="Enter product price"
          min="0"
          required
        />

        <Label htmlFor="category">Category</Label>
        <Select
          onValueChange={(value) =>
            setProductForm((prev) => ({ ...prev, category: value }))
          }
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((categoryItem) => (
              <SelectItem key={categoryItem} value={categoryItem}>
                {categoryItem}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          value={productForm.quantity}
          onChange={handleInputChange}
          placeholder="Enter quantity"
          min="0"
        />

        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={productForm.description}
          onChange={handleInputChange}
          placeholder="Enter product description"
          required
        />

        <Label htmlFor="image">Product Image</Label>
        <div className="flex gap-4 items-center">
          <img
            src={productForm.image.url || DefaultImage}
            alt="Preview"
            className="w-24 h-24 border rounded-md"
          />
          <Button
            onClick={handleDeleteUploadedImage}
            disabled={!productForm.image.url}
            className="bg-red-500 text-white"
          >
            Delete Image
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Input
            id="image"
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
          />
          <Button
            onClick={handleImageUpload}
            type="button"
            className="bg-blue-400"
            disabled={!imageUpload || productForm.image.url}
          >
            <img src={UploadIcon} className="w-4 h-4" alt="" />
          </Button>
        </div>

        <Button type="submit" className="bg-blue-500 text-white w-full">
          Add Product
        </Button>
      </form>
    </section>
  );
};

export default ProductForm;
