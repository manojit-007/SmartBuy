import apiClient from "@/ApiClient/ApiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Eye from "@/assets/Eye.svg";
import EyeClose from "@/assets/EyeClose.svg";
import Loader from "@/lib/Loader";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { fetchUser } from "@/Store/AuthSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    document.title = "SmartBuy - Creating Account";
  }, []);

  const validateForm = () => {
    const { username, email, password } = formData;
    if (!username.trim()) {
      toast.error("Username is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$.!%*?&])[A-Za-z\d@$.!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await apiClient.post("/user/register", formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        toast.success(
          "Registration successful! Redirecting to verify email..."
        );
        dispatch(fetchUser());
        setTimeout(() => navigate("/verifyEmail", { replace: true }), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
      setFormData({ username: "", email: "", password: "", role: "user" });
    }
  };

  return (
    <section className="w-full h-screen bg-gray-50 flex items-center justify-center">
      {loading && (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 w-full max-w-md flex flex-col gap-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Sign Up
        </h2>

        <div className="flex flex-col">
          <Label htmlFor="username" className="mb-2 text-sm text-gray-600">
            🙍🏻‍♂️ Username
          </Label>
          <Input
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            type="text"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            placeholder="Enter your email"
            type="email"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="password" className="mb-2 text-sm text-gray-600">
            🔒 Password
          </Label>
          <div className="flex gap-2">
            <Input
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full py-3 bg-blue-800 text-white rounded-md hover:bg-blue-600 transition-all"
        >
          Sign Up
        </Button>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="bg-blue-800 p-2 rounded text-white hover:underline cursor-pointer"
          >
            Log in
          </span>
        </p>
      </form>
    </section>
  );
};

export default SignUp;
