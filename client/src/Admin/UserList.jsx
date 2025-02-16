import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/lib/Loader";
import { deleteUser, getAllUsers } from "@/Store/AuthSlice";
import { Clipboard, Edit, RefreshCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Hook: Detect Screen Size
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < 768,
    isTab: window.innerWidth < 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        isMobile: window.innerWidth < 768,
        isTab: window.innerWidth < 1024,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};

// Main Component: User List
const UserList = () => {
  const dispatch = useDispatch();
  const { allUsers, loading } = useSelector((state) => state.auth);
  const [animate, setAnimate] = useState(false);
  const { isMobile, isTab } = useScreenSize();
  const navigate = useNavigate();

  // Fetch Users on Component Mount
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDeleteUser = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("User deleted successfully", successStyle);
    } catch (error) {
      toast.error(`Failed to delete user: ${error.message}`, errorStyle);
    }
  };

  // Toast Styles
  const successStyle = {
    duration: 3000,
    position: "top-right",
    style: {
      background: "#fff",
      color: "#00796b",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
  };

  const errorStyle = {
    duration: 3000,
    position: "top-right",
    style: {
      background: "#fff",
      color: "#d32f2f",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
  };

  if (loading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-gray-950 bg-opacity-90 z-50"
        aria-label="Loading user list"
      >
        <Loader />
      </div>
    );
  }

  return (
    <section className="p-4">
      <div className="max-w-screen-xl m-auto mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">User List</h1>
          <Button
            variant="secondary"
            className="border border-black rounded-md flex items-center gap-2 px-4 py-2"
            onClick={() => {
              setAnimate(true);
              dispatch(getAllUsers()); // Refresh user list
              setTimeout(() => setAnimate(false), 500);
            }}
            aria-label="Refresh User List"
          >
            <RefreshCcw
              className={`w-4 h-4 ${animate ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
        <div className="border-t mt-4"></div>
      </div>

      {allUsers && allUsers.length > 0 ? (
        <Table className="w-full border max-w-screen-xl mx-auto">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-center font-bold border-2 border-black text-black">
                ID
              </TableHead>
              {!isMobile && (
                <TableHead className="text-center font-bold border-2 border-black text-black">
                  Name
                </TableHead>
              )}
              {!isTab && (
                <TableHead className="text-center font-bold border-2 border-black text-black">
                  Email
                </TableHead>
              )}
              {!isTab && (
                <TableHead className="text-center font-bold border-2 border-black text-black">
                  Role
                </TableHead>
              )}
              <TableHead className="text-center font-bold border-2 border-black text-black">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUsers.map((user) => (
              <TableRow key={user._id} className="hover:bg-blue-100">
                <TableCell className="text-center border-r border-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <span className="truncate">{user._id}</span>
                    <Clipboard
                      className="w-4 h-4 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-100 transition-all cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(user._id);
                        toast.success("ID Copied", successStyle);
                      }}
                      aria-label="Copy User ID"
                    />
                  </div>
                </TableCell>

                {!isMobile && (
                  <TableCell className="text-center border-r border-gray-300">
                    {user.username || "N/A"}
                  </TableCell>
                )}
                {!isTab && (
                  <TableCell className="text-center border-r border-gray-300">
                    {user.email || "N/A"}
                  </TableCell>
                )}
                {!isTab && (
                  <TableCell className="text-center border-r border-gray-300">
                    {user.role || "N/A"}
                  </TableCell>
                )}
                <TableCell className="text-center">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      aria-label="Edit"
                      className="p-2 rounded-md hover:bg-blue-100 text-blue-600"
                      onClick={() =>
                        navigate(`/dashboard/user/edit/${user._id}`)
                      }
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="secondary"
                      aria-label="Delete"
                      className="p-2 rounded-md hover:bg-red-100 text-red-600"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center text-gray-500">No users available.</p>
      )}
    </section>
  );
};

export default UserList;
