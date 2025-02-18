import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import LoginIcon from "@/assets/Login.svg";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/Store/AuthSlice";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@/lib/Loader";
import { toast } from "sonner";
import Eye from "@/assets/Eye.svg";
import EyeClose from "@/assets/EyeClose.svg";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  useEffect(() => {
    document.title = `SmartBuy - Account Login`;
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       dispatch(login(formData));
        // toast.success("Login successful!");
          navigate("/profile");
    } catch (error) {
      const errorMessage =
        error.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="w-full min-h-screen bg-gray-200 flex items-center justify-center">
      {loading && (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 w-full max-w-sm flex flex-col gap-4 rounded-lg shadow-md"
      >
        <div className="w-full flex flex-col items-center justify-center mb-2">
          <img src={LoginIcon} alt="Login Icon" className="w-10 h-10 mb-2" />
          <h2 className="text-2xl font-bold tracking-wide  text-center text-gray-800">
            Welcome back
          </h2>
          <p className="text-sm text-center text-gray-500">
            Enter your details to login
          </p>
        </div>

        <div className="flex flex-col">
          <Label htmlFor="email" className="mb-2 text-sm text-gray-600">
            📧 Email Address
          </Label>
          <Input
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="User@gmail.com"
            type="email"
            aria-label="Email Address"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="password" className="mb-2 text-sm text-gray-600">
            &#128273; Password
          </Label>
          <div className="flex items-center gap-1">
            <Input
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              aria-label="Password"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <Button
              type="button"
              onClick={togglePasswordVisibility}
              className="p-2 bg-transparent border rounded-md flex items-center justify-center hover:bg-gray-100"
            >
              <img
                src={showPassword ? EyeClose : Eye}
                className="w-5 h-5"
                alt={showPassword ? "Hide password" : "Show password"}
              />
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-bold rounded-md transition-all ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-base text-center text-gray-500">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline font-bold">
              Sign up
          </Link>
        </p>
        <Link
          to="/forgotPassword"
          className="text-blue-500 hover:text-blue-700 text-sm font-bold text-center"
        >
          Forgot Password?
        </Link>
      </form>

      <footer className="absolute bottom-4 text-sm text-gray-500">
        Copyright © 2025. All rights reserved.
      </footer>
    </section>
  );
};

export default Login;
