const mongoose = require("mongoose");
// const validator = require("validator");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Enter name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [3, "Name should be more than 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Enter email"],
    unique: true,
    // validate: [validator.isEmail, "Enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Enter password"],
    minLength: [8, "password should be more than 8 characters"],
    // select: false,
    //If we retrieve all user data, all information will be sent, excluding the user's password.
  },
  otp: { type: String },
  otpVerifyTime:Date,
  profilePic: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      // required: true,
    },
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "seller", "staff"],
    // enum: ["user", "admin"],
  },
  verified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
},{timestamps: true});

// userSchema.pre("save", async function (next) {
  // if (this.isModified("password")) {
    // this.op = this.password
    // this.password = await bcrypt.hash(this.password, 10);
  // }
  // next();
// });

//JWT token

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//check password for login

userSchema.methods.checkPassword = async function (enteredPasswordForLogin) {
  return await bcrypt.compare(enteredPasswordForLogin, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = async function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  //console.log(`resetToken : ${resetToken}`);

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordTokenExpire = Date.now() + 15 * 60 * 1000; // expire in 5 minutes
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

