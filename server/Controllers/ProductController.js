const fs = require("fs");
const { imageToWebp } = require("image-to-webp");
const { cloudinary } = require("../Middleware/Cloudinary");
const CatchAsyncError = require("../Middleware/CatchAsyncError");
const ApiFeatures = require("../Utils/ApiFeatures");
const Product = require("../Models/ProductModel");
const mongoose = require("mongoose");
const PATH = require("path");

const uploadImage = CatchAsyncError(async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    const { path: inputPath } = req.file;
    const outputFilename = `${PATH.basename(
      req.file.filename,
      PATH.extname(req.file.filename)
    )}.webp`;
    let outputPath = await PATH.join(PATH.dirname(inputPath), outputFilename);
    outputPath = await imageToWebp(inputPath, 80, outputPath);
    const uploaderResult = await cloudinary.uploader.upload(outputPath, {
      folder: "product_image",
    });
    fs.unlink(inputPath, (err) => {
      if (err) console.error("Error deleting temporary file:", err.message);
    });
    // console.log(
    //   "upload result",
    //   uploaderResult.secure_url,
    //   uploaderResult.public_id
    // );
    res.status(200).json({
      message: "Image uploaded successfully.",
      url: uploaderResult.secure_url,
      public_id: uploaderResult.public_id,
    });
  } catch (err) {
    console.error("Error in uploadImage:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

const deleteUploadedImage = CatchAsyncError(async (req, res, next) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ message: "No image provided." });
  }
  const { public_id } = image;
  const { url } = image;
  if (url.includes("https://res.cloudinary.com/")) {
    await cloudinary.uploader.destroy(public_id);
    console.log("Deleted image from cloudinary", public_id);
    res.status(200).json({ message: "Image deleted successfully." });
  }
});

const updateProduct = CatchAsyncError(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.userId;
  const role = req.role;
  const { name, description, price, quantity, category, image } = req.body;
  // console.log("upload image :" + image.url);
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      message: "Invalid product ID",
      success: false,
    });
  }
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }
    const previousImageUrl = product.image?.url || "";
    if (product.creator.toString() !== userId || role !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to update this product",
        success: false,
      });
    }
    // console.log(image);
    const updatedFields = {
      name,
      description,
      price,
      quantity,
      category,
    };
    if (image?.url) updatedFields["image.url"] = image.url;
    if (image?.public_id) updatedFields["image.public_id"] = image.public_id;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    // if (updatedProduct.image?.url === previousImageUrl) {
    //   console.log("Image not changed");
    // } else {
    //   console.log("Image updated");
    // }
    return res.status(200).json({
      message: "Product updated successfully",
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error.message);
    return res.status(500).json({
      message: "An error occurred while updating the product",
      success: false,
    });
  }
});

const deleteProduct = CatchAsyncError(async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.userId;
  const role = req.role;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      message: "Invalid product ID",
      success: false,
    });
  }
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }
  if (product.creator.toString() !== userId && role !== "admin") {
    return res.status(403).json({
      message: "You are not authorized to delete this product",
      success: false,
    });
  }
  if (product.image.url?.includes("https://res.cloudinary.com/")) {
    const public_id = product.image.public_id;
    await cloudinary.uploader.destroy(public_id);
  }
  await Product.findByIdAndDelete(productId);
  return res.json({
    message: "Product deleted successfully",
    success: true,
  });
});

const deleteProduct2 = CatchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const userRole = req.role;
  if (!userId || (userRole !== "admin" && userRole !== "seller")) {
    return res.status(403).json({
      message: "You are not authorized to delete products",
      success: false,
    });
  }
  const { productId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(404)
      .json({ message: "Invalid product ID", success: false });
  }
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    return res
      .status(404)
      .json({ message: "Product not found", success: false });
  }
  res
    .status(200)
    .json({ success: true, message: "Product deleted successfully", product });
  // await product.remove();
});

const getAllProducts = CatchAsyncError(async (req, res, next) => {
  const itemsPerPage = 8; // Number of items per page
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search() // Apply search filter (e.g., for keyword)
    .filter(); // Apply other filters (e.g., price range)

  // Clone the query for counting filtered products before applying pagination
  const filteredProductCount = await apiFeatures.query.clone().countDocuments();

  // Apply pagination after filtering
  apiFeatures.pagination(itemsPerPage);

  // Fetch the paginated products
  const Products = await apiFeatures.query;

  // Send the response with product data
  res.status(200).json({
    success: true,
    Products,
    totalProductCount: await Product.countDocuments(), // Total count without filters
    filteredProductCount,
    itemsPerPage,
    totalPages: Math.ceil(filteredProductCount / itemsPerPage), // Calculate total pages based on filtered count
  });
});
const allProducts = CatchAsyncError(async (req, res, next) => {
  const userProducts = await Product.find();
  return res.status(200).json({
    success: true,
    Products: userProducts,
  });
});

const createProduct = CatchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const userRole = req.role;
  if (!userId || (userRole !== "admin" && userRole !== "seller")) {
    return res.status(403).json({
      message: "You are not authorized to create products",
      success: false,
    });
  }
  try {
    const { name, description, price, quantity, category, image } = req.body;
    if (!name || !description || !price || !quantity || !category) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }
    if (image.url.length === 0) {
      return res.status(400).json({
        message: "Invalid image URL",
        success: false,
      });
    }
    const product = new Product({
      name,
      description,
      price,
      quantity,
      category,
      image,
      creator: userId,
    });
    await product.save();
    // console.log(product);
    return res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      message: "An error occurred while creating the product",
      success: false,
      error: error.message,
    });
  }
});

const getProductDetails = CatchAsyncError(async (req, res, next) => {
  const { productId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(404)
      .json({ message: "Invalid product ID", success: false });
  }
  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ message: "Product not found", success: false });
  }
  res.status(200).json({ success: true, message: "Product details", product });
});

const getOwnProducts = CatchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const userRole = req.role;

  if (!userId || (userRole !== "admin" && userRole !== "seller")) {
    return res.status(403).json({
      message: "You are not authorized to access this resource.",
      success: false,
    });
  }

  const { page = 1, limit = 10 } = req.query; // Pagination with default values
  const pageNumber = Math.max(1, parseInt(page)); // Ensure page number is at least 1
  const limitNumber = Math.max(1, parseInt(limit)); // Ensure limit is at least 1
  const skip = (pageNumber - 1) * limitNumber;

  try {
    const products = await Product.find({ creator: userId })
      .populate("creator", "name email")
      .skip(skip)
      .limit(limitNumber);

    const productCount = await Product.countDocuments({ creator: userId });

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully.",
      products,
      totalProducts: productCount,
      page: pageNumber,
      totalPages: Math.ceil(productCount / limitNumber),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
});

const productReview = CatchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const { productId, orderId, username, rating, comment } = req.body;
  const review = {
    user: userId,
    orderId,
    username,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ message: "Product not found", success: false });
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.orderId.toString() === orderId.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.orderId.toString() === orderId.toString()) {
        rev.rating = review.rating;
        rev.comment = review.comment;
      }
    });
    await product.save();
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // Calculate average rating
  const totalRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  product.ratings = totalRating / product.reviews.length;

  await product.save();
  res.status(200).json({
    message: "Review submitted and ratings updated successfully",
    success: true,
    averageRating: product.ratings,
  });
});

const deleteProductReview = CatchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const { productId, reviewId } = req.query;
  if (
    !mongoose.Types.ObjectId.isValid(productId) ||
    !mongoose.Types.ObjectId.isValid(reviewId)
  ) {
    return res
      .status(404)
      .json({ message: "Invalid product or review ID", success: false });
  }
  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ message: "Product not found", success: false });
  }
  const review = product.reviews.id(reviewId);
  if (!review) {
    return res
      .status(404)
      .json({ message: "Review not found", success: false });
  }
  if (review.user.toString() !== userId.toString()) {
    return res.status(403).json({
      message: "You are not authorized to delete this review",
      success: false,
    });
  }
  product.reviews.id(reviewId).remove();
  product.numOfReviews = product.reviews.length;
  // Calculate average rating
  const totalRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  product.ratings = totalRating / product.reviews.length;
  await product.save();
  res.status(200).json({
    message: "Review deleted successfully",
    success: true,
    averageRating: product.ratings,
  });
});

module.exports = {
  allProducts,
  uploadImage,
  updateProduct,
  deleteUploadedImage,
  createProduct,
  getAllProducts,
  getProductDetails,
  deleteProduct,
  getOwnProducts,
  productReview,
  deleteProductReview,
};
