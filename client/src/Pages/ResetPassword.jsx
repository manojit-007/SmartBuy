import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import Eye from "@/assets/Eye.svg";
import EyeClose from "@/assets/EyeClose.svg";
import { toast } from "sonner";
import { resetPassword } from "@/Store/AuthSlice";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = "SmartBuy - Reset Password";
    if (successMessage) {
      toast.success("Password reset successfully. You can now log in.");
      navigate("/login");
    }
  }, [successMessage, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password.trim() || !confirmPassword.trim()) {
      toast.error("Both password fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    dispatch(resetPassword({ resetToken, password }));
  };

  return (
    <section className="w-full h-screen bg-gray-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-lg bg-white border border-gray-300 items-center p-4 m-2 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Reset Password</h1>
        <p className="text-gray-600 text-center mb-6">
          Enter and confirm your new password below.
        </p>
        <div className="w-full mb-4">
          <input
            type={passwordStatus ? "text" : "password"}
            className="form-control w-full bg-gray-100 p-2 border border-gray-300 rounded mb-2"
            placeholder="New Password"
            aria-label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <input
            type={passwordStatus ? "text" : "password"}
            className="form-control w-full bg-gray-100 p-2 border border-gray-300 rounded"
            placeholder="Confirm New Password"
            aria-label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex w-full justify-between items-center">
          <Button
            onClick={() => setPasswordStatus(!passwordStatus)}
            type="button"
            className="bg-gray-100 border text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200"
          >
            <img
              src={passwordStatus ? EyeClose : Eye}
              className="w-5 h-5"
              alt={passwordStatus ? "Hide password" : "Show password"}
            />
          </Button>
          <Button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ResetPassword;
