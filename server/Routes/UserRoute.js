const express = require("express");
const {
  registerUser,
  verifyOtp,
  resendOtp,
  getUserDetails,
  logIn,
  logOutUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserDetailsById,
  updateUser,
  AllUsers,
  deleteUser,
} = require("../Controllers/UserController");
const { verifyUser } = require("../Middleware/VerifyToken");
const UserRouter = express.Router();

UserRouter.post("/register", registerUser);
UserRouter.post("/verifyOtp", verifyUser, verifyOtp);
UserRouter.post("/reSendOtp", verifyUser, resendOtp);
UserRouter.get("/me", verifyUser, getUserDetails);
UserRouter.post("/logIn", logIn);
UserRouter.post("/logOut", logOutUser);
UserRouter.post("/changePassword", verifyUser, changePassword);
UserRouter.post("/password/forgot",forgotPassword);

UserRouter.put("/password/reset/:resetToken",resetPassword);

//admin routes
UserRouter.get("/getUser",verifyUser,getUserDetailsById);
UserRouter.put("/updateUser",verifyUser,updateUser);

UserRouter.delete("/deleteUser",verifyUser,deleteUser);

UserRouter.get("/AllUsers",verifyUser,AllUsers);

module.exports = UserRouter;
