const CatchAsyncError = require("../Middleware/CatchAsyncError");
const User = require("../Models/UserModels");
const bcrypt = require("bcryptjs");
const SendEmail = require("../Utils/SendEmail");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const registerUser = CatchAsyncError(async (req, res, next) => {
  const { username, email, password, role = "user" } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).json({
      message: "User already exists!",
      success: false,
    });
  }

  // Encrypt the password
  const encryptedPassword = await bcrypt.hash(password, 10);

  // Generate OTP and expiration time
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpVerifyTime = Date.now() + 1 * 60 * 1000; // OTP valid for 1 minute

  // Create the user
  const user = new User({
    username,
    email,
    password: encryptedPassword,
    otp,
    otpVerifyTime,
    role,
  });

  try {
    // Save the user in the database
    await user.save();

    // Send a welcome email with the OTP
    const message = `Welcome ${username},\n\nYour account has been successfully created on our platform. Thank you for registering!\n\nYour OTP: ${otp}\n\nThis OTP will expire in 1 minute.`;
    await SendEmail({
      email: user.email,
      subject: "Welcome to Our E-commerce Platform",
      message,
    });

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove sensitive data from the response
    const {profilePic,password, otp: userOtp, otpVerifyTime: userOtpVerifyTime, ...userData } = user._doc;

    // Respond with success
    res.status(201).json({
      message: "User registered successfully!",
      success: true,
      user: userData,
      token,
    });
  } catch (error) {
    // Handle any errors during registration
    return next(new Error(`Registration failed: ${error.message}`));
  }
});


const verifyOtp = CatchAsyncError(async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;
  if (!otp) {
    return res.status(400).json({
      message: "Please provide OTP",
      success: false,
    });
  }
  try {
    const user = await User.findById(userId);
    if (!user || user.otpVerifyTime < Date.now()) {
      return res.status(401).json({
        message: "Invalid OTP or OTP expired",
        success: false,
      });
    }
    if (user.otp !== otp) {
      return res.status(401).json({
        message: "Invalid OTP",
        success: false,
      });
    }
    user.verified = true;
    user.otp = null;
    user.otpVerifyTime = null;
    await user.save();
    return res.json({
      message: "OTP verified successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred during OTP verification",
      success: false,
      error: error.message,
    });
  }
});

const resendOtp = CatchAsyncError(async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized access - User ID not provided",
        success: false,
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpVerifyTime = Date.now() + 1 * 60 * 1000;
    await user.save();
    const message = `Your email verification OTP is:\n\n${otp}\n\nIf you did not request this, please ignore it.`;
    await SendEmail({
      email: user.email,
      subject: "E-commerce Account Verification",
      message,
    });
    return res.status(200).json({
      message: "OTP sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error resending OTP:", error.message);
    return res.status(500).json({
      message: "Failed to resend OTP. Please try again later.",
      success: false,
    });
  }
});

const getUserDetails = CatchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized access - User ID not provided",
      success: false,
    });
  }
  try {
    const user = await User.findById(userId).select(
      "-password -__v -otp -otpVerifyTime"
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "User details fetched successfully",
      success: true,
      user,
    });
  } catch (error) {
    // console.error("Error fetching user details:", error.message);
    return res.status(500).json({
      message: "Failed to fetch user details. Please try again later.",
      success: false,
    });
  }
});
const logIn = CatchAsyncError(async (req, res, next) => {
  console.log("api call to login");
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide both email and password",
      success: false,
    });
  }
  const user = await User.findOne({ email }).select("+password").lean();
  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
      success: false,
    });
  }
  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid email or password",
      success: false,
    });
  }
  // Generate JWT
  const { JWT_SECRET_KEY } = process.env;
  if (!JWT_SECRET_KEY) {
    return res.status(500).json({
      message: "JWT_SECRET_KEY is not defined",
      success: false,
    });
  }
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
  // Prepare user data to exclude sensitive fields
  delete user.password;
  // Set HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure flag in production
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send response
  return res.status(200).json({
    message: "Logged in successfully",
    success: true,
    user,
    token, // Include only if necessary; otherwise, rely on cookies
  });
});

const logOutUser = CatchAsyncError(async (req, res, next) => {
  res.clearCookie("token");
  return res.status(200).json({
    message: "User logged out successfully",
    success: true,
  });
});

const changePassword = CatchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized access - User ID not provided",
      success: false,
    });
  }
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      message: "Please provide both old password and new password",
      success: false,
    });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid old password",
      success: false,
    });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  return res.status(200).json({
    message: "Password changed successfully",
    success: true,
  });
});

const forgotPassword = CatchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }
  const resetToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.ORIGIN}/password/reset/${resetToken}`;

  const message = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="text-align: center; color: #4CAF50;">SmartBuy Password Recovery</h2>
      <p>Hello <strong>${user.username}</strong>,</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a 
          href="${resetPasswordUrl}" 
          style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>If the button above doesn’t work, copy and paste the following link into your browser:</p>
      <p style="word-wrap: break-word; color: #0066cc;">${resetPasswordUrl}</p>
      <p>If you did not request this password reset, please ignore this email or contact our support if you have concerns.</p>
      <p>Best regards,<br>SmartBuy Team</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <footer style="text-align: center; font-size: 12px; color: #777;">
        <p>&copy; ${new Date().getFullYear()} SmartBuy. All rights reserved.</p>
      </footer>
    </div>
  `;

  try {
    await SendEmail({
      email: user.email,
      subject: `SmartBuy Password Recovery`,
      message,
      isHtml: true,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

const resetPassword = CatchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save();
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Password reset successfully",
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(404).json({
      message: "Invalid token or token expired",
      success: false,
    });
  }
});

const AllUsers = CatchAsyncError(async (req, res, next) => {
  const role = req.role || "admin";
  if (role !== "admin") {
    return res.status(403).json({
      message: "Unauthorized access - Only admin can access this route",
      success: false,
    });
  }
  try {
    const users = await User.find({}).select(
      "-password -__v -otp -otpVerifyTime"
    );
    res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      users,
    });
  } catch (error) {
    console.log("Error fetching users:", error);
    res.status(500).json({
      message: "An error occurred while fetching users",
      success: false,
      error: error.message,
    });
  }
});

const getUserDetailsById = CatchAsyncError(async (req, res, next) => {
  const role = req.role;
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({
      message: "User ID is required",
      success: false,
    });
  }
  if (role !== "admin") {
    return res.status(403).json({
      message: "Unauthorized access - Only admin can access this route",
      success: false,
    });
  }
  try {
    let user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "User details fetched successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error fetching user details:", error);
    res.status(500).json({
      message: "An error occurred while fetching user details",
      success: false,
      error: error.message,
    });
  }
});

const updateUser = CatchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const userRole = req.role;
  const { id, role } = req.query;
  if (!id) {
    return res.status(400).json({
      message: "User ID is required",
      success: false,
    });
  }
  if (userRole !== "admin") {
    return res.status(403).json({
      message: "Unauthorized access - Only admin can access this route",
      success: false,
    });
  }
  if (!role) {
    return res.status(400).json({
      message: "Role is required to update the user",
      success: false,
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { role: role },
      { new: true, runValidators: true }
    ).select("-password -__v -otp -otpVerifyTime");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "User updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "An error occurred while updating the user",
      success: false,
      error: error.message,
    });
  }
});

const deleteUser = CatchAsyncError(async (req, res, next) => {
  const { id } = req.query;
  const userRole = req.role;
  console.log(id);
  if (!id) {
    return res.status(400).json({
      message: "User ID is required",
      success: false,
    });
  }

  // Check for admin privileges
  if (userRole !== "admin") {
    return res.status(403).json({
      message: "Unauthorized access - Only admins can perform this action",
      success: false,
    });
  }

  try {
    // Attempt to delete the user
    const user = await User.findByIdAndDelete({ _id: id });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the user",
      success: false,
      error: error.message,
    });
  }
});

module.exports = {
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
};
