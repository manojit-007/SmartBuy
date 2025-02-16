import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, resendOtp as otpResend } from "@/Store/AuthSlice";
import { verifyOtp as validateOtp } from "@/Store/AuthSlice";
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
    document.title = `SmartBuy - Verify Email`;
      dispatch(fetchUser());
      if(!user){
        navigate("/login");
        return;
      }
  }, [user, navigate, dispatch]);

  if (!user) return null;

  const handleInputChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    setError("");
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
      setTimeout(() => navigate("/profile"), 1000);
    } catch (error) {
      const errorMsg = error?.message || "Failed to verify OTP. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendDisabled) return;

    try {
      setResendDisabled(true);
      await dispatch(otpResend());
      setSuccess("OTP resent successfully!");
      toast.success("OTP resent successfully!");
      setTimeout(() => setResendDisabled(false), 30000);
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.",error);
      setResendDisabled(false);
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
        <p className="text-gray-600 font-medium text-center">
          Please enter the OTP manually.
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
              placeholder="⏳"
              value={value}
              onChange={(e) => handleInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength="1"
              className="w-12 h-12 text-center text-xl font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-black transition duration-150 ease-in-out"
              disabled={loading}
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm mb-2" aria-live="assertive">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2" aria-live="assertive">{success}</p>}
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
