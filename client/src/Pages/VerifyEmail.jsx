/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, resendOtp as otpResend, verifyOtp as validateOtp } from "@/Store/AuthSlice";
import { toast } from "sonner";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "SmartBuy - Verify Email";
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.emailVerified) {
      navigate("/profile");
      return;
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleInputChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // Ensure only numeric input
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(""); // Clear error on valid input
    if (value && index < 5) {
      document.querySelector(`#otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.querySelector(`#otp-input-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6 || otp.includes("")) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await dispatch(validateOtp(otpValue)).unwrap();
      setSuccess(response.message || "OTP verified successfully!");
      toast.success("OTP verified successfully!");
      navigate("/profile");
    } catch (error) {
      const errorMsg = error?.message || "Failed to verify OTP. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      navigate("/profile");
    }
  };

  const resendOtp = async () => {
    if (resendDisabled) return;

    setResendDisabled(true);
    try {
      await dispatch(otpResend()).unwrap();
      setSuccess("OTP resent successfully!");
      toast.success("OTP resent successfully!");
    } catch (error) {
      const errorMsg = "Failed to resend OTP. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setTimeout(() => setResendDisabled(false), 30000); // Re-enable button after 30 seconds
    }
  };

  return (
    <section className="w-full h-screen flex flex-col items-center justify-center bg-neutral-950">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-md bg-white shadow-lg border rounded-lg items-center p-4"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Verify Email</h1>
        <p className="text-gray-600 mb-2 text-center">
          Enter the OTP sent to your email.
        </p>
        <p className="text-gray-500 text-sm italic text-center mb-4">
          Copy-paste functionality is disabled.
        </p>

        <div className="flex space-x-2 mb-4">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              autoComplete="off"
              placeholder="0"
              value={value}
              onChange={(e) => handleInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength="1"
              className="w-12 h-12 text-center text-xl font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-black transition duration-150 ease-in-out"
              disabled={loading}
            />
          ))}
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-2" aria-live="assertive">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 text-sm mb-2" aria-live="assertive">
            {success}
          </p>
        )}
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition hover:bg-blue-700 focus:outline-none ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        <Button
          onClick={resendOtp}
          className="mt-4 w-full bg-gray-200 text-blue-600 hover:bg-blue-100 focus:outline-none font-bold py-2 px-4 rounded-lg"
          disabled={resendDisabled || loading}
        >
          {resendDisabled ? "Resend OTP (Wait 30s)" : "Resend OTP"}
        </Button>
      </form>
    </section>
  );
};

export default VerifyEmail;
