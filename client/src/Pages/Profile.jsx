import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Eye from "@/assets/Eye.svg";
import EyeClose from "@/assets/EyeClose.svg";
import { useNavigate } from "react-router-dom";
import apiClient from "@/ApiClient/ApiClient";
import { fetchUser, logout } from "@/Store/AuthSlice";
import { toast } from "sonner";
import Loader from "@/lib/Loader";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [changePassword, setChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `SmartBuy - Profile`;
    setLoading(true);
    dispatch(fetchUser()).finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (!user) 
      navigate("/login");
  }, [user, navigate])


  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError("");
  };

  const handleLogOut = async () => {
    dispatch(logout());
    navigate("/login");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password must match!");
      return;
    }
    try {
      const res = await apiClient.post("/user/changePassword", formData, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setChangePassword(false);
      setFormData({
        ...formData,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  if (!user || loading) {
    return (
      <div className="fixed inset-0 bg-gray-950 bg-opacity-90 flex items-center justify-center z-50">
        <Loader />
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen flex justify-center bg-gray-50">
      <main className="flex-1 p-6 max-w-4xl w-full">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="flex flex-wrap mb-20 bg-black text-white">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            {/* Account Info */}
            <div className="flex flex-col items-center justify-center gap-6">
              <h1 className="text-3xl font-semibold text-gray-800">Profile</h1>
              <div className="flex flex-col gap-4 w-full max-w-md">
                <div>
                  <Label htmlFor="username" className="mb-2 font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    readOnly
                    value={user.username}
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-2 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    readOnly
                    value={user.email}
                    className="bg-gray-100"
                  />
                </div>
                <Button
                  variant="secondary"
                  className="w-full py-2 mt-4 hover:bg-gray-200 border"
                  onClick={() => setChangePassword((prev) => !prev)}
                >
                  Change Password
                </Button>
                <Button
                  variant="secondary"
                  className="w-full py-2 mt-4 hover:bg-gray-200 border"
                  onClick={handleLogOut}
                >
                  Log Out
                </Button>
              </div>
            </div>

            {/* Password Change Form */}
            {changePassword && (
              <form
                onSubmit={handlePasswordSubmit}
                className="mt-6 flex flex-col gap-6 rounded-lg w-full m-auto max-w-md p-6 bg-white shadow-md"
              >
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div>
                  <Label htmlFor="oldPassword" className="mb-2 font-medium">
                    Old Password
                  </Label>
                  <Input
                    id="oldPassword"
                    name="oldPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword" className="mb-2 font-medium">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="mb-2 font-medium">
                    Confirm New Password
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 bg-gray-100 border hover:bg-gray-400"
                    >
                      <img
                        src={showPassword ? EyeClose : Eye}
                        alt="Toggle visibility"
                        className="w-5 h-5"
                      />
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="mt-4 w-full bg-blue-400 text-white hover:bg-blue-500"
                >
                  Update Password
                </Button>
              </form>
            )}
          </TabsContent>
          <TabsContent value="address">
            <div className="w-full grid place-content-center">
              Coming soon
              </div>
          </TabsContent>
        </Tabs>
      </main>
    </section>
  );
};

export default Profile;
