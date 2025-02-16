import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { updateUser, userDetail } from "@/Store/AuthSlice";
import Loader from "@/lib/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const EditUser = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userDetails, loading, error } = useSelector((state) => state.auth);

  const [formValues, setFormValues] = useState({
    id: "",
    username: "",
    role: "",
  });

  useEffect(() => {
    dispatch(userDetail(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (userDetails) {
      setFormValues({
        id: userDetails._id || "",
        username: userDetails.username || "",
        role: userDetails.role || "",
      });
    }
  }, [userDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(
        updateUser({ id: userId, ...formValues })
      );
      if (response?.meta?.requestStatus === "fulfilled") {
        toast.success("User updated successfully");
        navigate("/dashboard/allUsers");
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      toast.error("Failed to update user", error);
    }
  };

  if (loading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-gray-950 bg-opacity-90 z-50"
        aria-label="Loading user details"
      >
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500 text-center">Failed to load user details.</p>
      </div>
    );
  }

  return (
    <section className="p-4 max-w-screen-md m-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit User</h1>
      {formValues.id ? (
        <form className="max-w-screen-md mx-auto" onSubmit={handleUpdateUser}>
          <div className="mb-4">
            <Label
              htmlFor="id"
              className="block text-sm font-medium text-gray-700"
            >
              Id
            </Label>
            <Input
              type="text"
              id="id"
              name="id"
              value={formValues.id}
              onChange={handleInputChange}
              className="mt-1 p-2 border bg-white rounded w-full"
              readOnly
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </Label>
            <Input
              type="text"
              id="username"
              readOnly
              name="username"
              value={formValues.username}
              onChange={handleInputChange}
              className="mt-1 p-2 border bg-white rounded w-full"
              placeholder="Enter user's name"
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Current Role
            </Label>
            <Input
              type="text"
              id="role"
              name="role"
              value={userDetails.role}
              readOnly
              className="mt-1 p-2 border bg-white rounded w-full"
              placeholder="Enter user's role"
            />
          </div>
          <div className="mb-4">
            <Label
              htmlFor="role"
              className="block text-sm mb-2 font-medium text-gray-700"
            >
              Update Role
            </Label>
            <Select
              value={formValues.role}
              onValueChange={(value) =>
                setFormValues((prevValues) => ({
                  ...prevValues,
                  role: value,
                }))
              }
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => navigate("/dashboard/allUsers")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <p className="text-center text-gray-500">No user details available.</p>
      )}
    </section>
  );
};

export default EditUser;
