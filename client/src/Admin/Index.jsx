import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CirclePlus,
  LayoutDashboard,
  Package2,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "@/Pages/ProductForm";
import AllOrders from "./AllOrders";
import Dashboard from "./Dashboard";
import { logout } from "@/Store/AuthSlice";
import { toast } from "sonner";
import ProductList from "./ProductList";
import UserList from "./UserList";
import EditProduct from "@/Pages/EditProduct";
import SearchById from "./SearchById";
import EditUser from "@/Pages/EditUser";
import OrderDetail from "./OrderDetails";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "All Products",
    url: "/dashboard/allProducts",
    icon: Package2,
  },
  {
    title: "All Orders",
    url: "/dashboard/allOrders",
    icon: ShoppingCart,
  },
  {
    title: "All Users",
    url: "/dashboard/allUsers",
    icon: User,
  },
  {
    title: "Add Product",
    url: "/dashboard/addNewProducts",
    icon: CirclePlus,
  },
  {
    title: "Search By Id",
    url: "/dashboard/search",
    icon: Search,
  }
];
const Index = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/error");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      dispatch(logout());
      toast.success("User logged out successfully.");
    } catch (error) {
      toast.error("Failed to log out. Please try again.", error);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      {/* Sidebar as a Sheet */}
      <Sheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        className="w-auto"
      >
        <SheetTrigger asChild className="w-max ">
          <Button className="m-4">Menu</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Dashboard Menu</SheetTitle>
            <SheetDescription>
              <nav className="space-y-2 mt-4" aria-label="navigation">
                {items.map((item, index) => (
                  <Link
                    key={index}
                    to={item.url}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white transition 
                      ${
                        location.pathname === item.url
                          ? "bg-gray-950 text-white"
                          : "text-black"
                      }
                      `}
                    aria-label={item.title}
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        <header className="flex justify-between max-w-screen-xl m-auto items-center">
          <h2 className="text-2xl font-semibold">
            Welcome Back! Admin{" "}
            {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
          </h2>
          <Button onClick={handleLogout}>Log Out</Button>
        </header>

        {/* main Section for different purpose */}
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/allOrders" element={<AllOrders />} />
            <Route path="/allProducts" element={<ProductList />} />
            <Route path="/allUsers" element={<UserList />} />
            <Route path="/addNewProducts" element={<ProductForm />} />
            <Route path="/search" element={<SearchById />} />
            <Route path="/product/edit/:productId" element={<EditProduct />} />
            <Route path="/user/edit/:userId" element={<EditUser />} />
            <Route path="/order/:orderId" element={<OrderDetail />} />
            {/* <Route path="/dashboard/allOrders" element={<AllOrders />} /> */}
          </Routes>
        </main>
      </main>
    </div>
  );
};

export default Index;
