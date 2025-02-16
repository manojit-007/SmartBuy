const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const {
  uploadImage,
  deleteUploadedImage,
  createProduct,
  getAllProducts,
  getProductDetails,
  deleteProduct,
  products,
  getOwnProducts,
  productReview,
  updateProduct,
  allProducts,
} = require("../Controllers/ProductController");
const { verifyUser } = require("../Middleware/VerifyToken");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./temp";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const ProductRoute = express.Router();

ProductRoute.post(
  "/uploadImage",
  verifyUser,
  upload.single("image"),
  uploadImage
);
ProductRoute.get("/allUserProducts",verifyUser,getOwnProducts)

ProductRoute.post("/image/delete", verifyUser, deleteUploadedImage);
ProductRoute.post("/createProduct", verifyUser, createProduct);
ProductRoute.get("/getAllProducts", getAllProducts);
ProductRoute.get("/allProducts", allProducts);
ProductRoute.delete("/:productId",verifyUser, deleteProduct);
ProductRoute.put("/review", verifyUser,productReview);

//product details and update product
ProductRoute.get("/:productId", getProductDetails);
ProductRoute.put("/:productId",verifyUser, updateProduct);


module.exports = ProductRoute;
