const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const UserRouter = require("./Routes/UserRoute");
const ProductRoute = require("./Routes/ProductRoute");
const OrderRoute = require("./Routes/OrderRoute");
const paymentRoute = require("./Routes/PaymentRoute");

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server...");
  console.log(err.stack);
  process.exit(1);
});
dotenv.config();
const app = express();
const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Authorization",
  ],
};
// console.log(a);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
}
connectDB();

app.get("/", (req, res) => {
  res.send("Server is running and ready!");
});

// Route handlers
app.use("/user", UserRouter);
app.use("/product", ProductRoute);
app.use("/order", OrderRoute);
app.use("/payment", paymentRoute)


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection:", err.message);
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(1);
  });
});
