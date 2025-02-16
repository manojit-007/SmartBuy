import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "@/lib/Loader";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "@/Store/AuthSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = `SmartBuy - Forgot Password`;
    if (successMessage) {
      toast.success(successMessage);
    }
    if (error) {
      toast.error(error);
    }
  }, [successMessage, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    dispatch(forgotPassword(email));
    setEmail("");
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gray-950 p-6">
      {loading && (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Forgot Password
        </h1>
        <p className="text-gray-600 text-center mb-4">
          Enter your email address, and we’ll send you a link to reset your password.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              &#128231; Email Address
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="User@gmail.com"
              required
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition duration-200"
          >
            Send Reset Link
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
