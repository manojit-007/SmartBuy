const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        orderId: {
          type: mongoose.Schema.ObjectId,
          ref: "Order",
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          default: 0,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
