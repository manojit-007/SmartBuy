import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "@/lib/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "@/Store/ProductSlice";
import apiClient from "@/ApiClient/ApiClient";
import { toast } from "sonner";

const EditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [processingState, setProcessingState] = useState(false);
  const dispatch = useDispatch();
  const { productDetails, loading, error } = useSelector(
    (state) => state.product
  );

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    quantity: "",
    image: {
      url: "",
      public_id: "",
    },
  });

  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (productDetails) {
      setFormData({
        name: productDetails.name || "",
        category: productDetails.category || "",
        description: productDetails.description || "",
        price: productDetails.price || "",
        quantity: Number(productDetails.quantity) || 0,
        image: {
          url: productDetails.image?.url || "",
          public_id: productDetails.image?.public_id || "",
        },
      });
      setPreview("");
      document.title = `${productDetails.name} - Edit Page`;
    } else {
      document.title = "Product Edit Page";
    }
  }, [productDetails]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleImageUpload = async () => {
    setProcessingState(true);
    if (!fileRef.current.files[0]) {
      toast.error("No image selected for upload.");
      setProcessingState(false);
      return;
    }
    try {
      let file;
      if (fileRef.current?.files[0]) {
        file = fileRef.current.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        throw new Error("No file selected.");
      }
      // Delete the existing image
      const deleteRes = await apiClient.post(`/product/image/delete`, {
        image: productDetails.image,
      });
      toast.success(deleteRes.data.message);
      // Upload the new image
      const imageData = new FormData();
      imageData.append("image", file);
      const uploadRes = await apiClient.post(
        "/product/uploadImage",
        imageData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(uploadRes.data.message);
      // Update state with the new image details
      setFormData((prev) => ({
        ...prev,
        image: { url: uploadRes.data.url, public_id: uploadRes.data.public_id },
      }));
      // Reset file input and preview
      setPreview(null);
      if (fileRef.current) fileRef.current.value = null;
      // Update product with new data
      const updateRes = await apiClient.put(
        `/product/${productId}`,
        { ...formData, image: uploadRes.data },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      // console.log("Product update response:", updateRes);
      toast.success(updateRes.data.message);
    } catch (error) {
      console.error("Error:", error.message || error.response?.data?.message);
      toast.error("An error occurred during the operation.");
    }
    setProcessingState(false);
  };
  if (processingState) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-950 z-50">
        <Loader />
      </div>
    );
  }

  const handleSubmit = () => {
    apiClient
      .put(
        `/product/${productId}`,
        { ...formData },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .catch((error) => {
        console.error("Error updating product:", error.response?.data?.message);
        toast.error("Failed to update product.");
      })
      .then((response) => {
        toast.success(response.data?.message);
      });
  };

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
  const handleImageSelect = () => {
    const file = fileRef.current.files[0];
    if (!file) {
      toast.error("No image selected for upload.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className=" flex items-center justify-center bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <Button
          className="bg-blue-600 mt-2 ml-2 text-white hover:bg-blue-700 rounded-md"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {/* Image and File Upload */}
          <div className="space-y-4">
            <img
              src={formData.image.url || "/placeholder.jpg"}
              alt={formData.name || "Product"}
              aria-label="Product image"
              className="w-full h-auto max-h-64 object-contain rounded-lg shadow border"
            />
            <form className="flex flex-col gap-2">
              <Label htmlFor="file">Upload New Image</Label>
              <Input
                id="file"
                type="file"
                ref={fileRef}
                aria-label="Upload New Image"
                onChange={handleImageSelect}
              />
              {preview && (
                <div className="flex flex-col gap-2">
                  <p className="font-medium">Preview Image</p>
                  <img
                    src={preview}
                    aria-label="Upload New Image Preview"
                    className="w-full max-h-52 object-contain border m-auto rounded-md"
                    alt=""
                  />
                </div>
              )}
              <Button
                type="button"
                className="bg-gray-100 text-blue-600 hover:text-white hover:bg-blue-600"
                onClick={handleImageUpload}
              >
                Upload Image & Save
              </Button>
            </form>
          </div>

          {/* Product Details Form */}
          <div className="space-y-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="8"
                placeholder="Enter product description"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="quantity">In Stock</Label>
                <span
                  className={`inline-block p-[0.4rem] text-sm font-semibold rounded-full w-2 h-2 ${
                    formData.quantity === 0
                      ? "bg-red-500 text-white"
                      : formData.quantity < 100
                      ? "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                ></span>
              </div>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </div>
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                handleSubmit();
                navigate(-1);
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditProduct;
