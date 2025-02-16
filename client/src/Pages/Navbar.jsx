import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Store/AuthSlice";
// import apiClient from "@/ApiClient/ApiClient";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserIcon from "@/assets/User.svg";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // await apiClient.post("/user/logOut", null, { withCredentials: true });
      dispatch(logout());
      toast.success("User logged out successfully.");
    } catch (error) {
      // console.error(error);
      toast.error("Failed to log out. Please try again.", error);
    }
  };

  const navLinkClasses = ({ isActive }) =>
    isActive ? "text-blue-400" : "text-white hover:text-blue-400";

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link to="/" aria-label="SmartBuy Home">
            SmartBuy
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex gap-6 items-center">
          <li>
            <NavLink to="/allProducts" className={navLinkClasses}>
              Products
            </NavLink>
          </li>

          {/* User Authentication Links */}
          {user ? (
            <>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="selection:border-none focus:border-none focus:outline ring-0"
                  >
                    <button
                      className="flex items-center gap-2 hover:text-blue-400"
                      aria-label="Open User Menu"
                    >
                      <Avatar
                        className="flex items-center justify-center border"
                        aria-label="User Avatar"
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                      {/* {user.username} */}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user && user.role === "admin" ? (
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/cart">Cart</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/userOrders">Order</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-500"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </>
          ) : (
            <>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="selection:border-none focus:border-none focus:outline ring-0"
                  >
                    <button
                      className="flex items-center gap-2 hover:text-blue-400"
                      aria-label="Open User Menu"
                    >
                      <Avatar
                        className="flex items-center justify-center border"
                        aria-label="User Avatar"
                      >
                        <AvatarImage
                          src={UserIcon}
                          alt="U"
                          className="w-6 rounded-full h-6 bg-white"
                        />
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                    <DropdownMenuItem asChild>
                      <Link to="/cart">Cart</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Log in</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/signup">Sign Up</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
