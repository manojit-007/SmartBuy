/* eslint-disable react/prop-types */
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, Suspense, lazy } from "react";
import { fetchUser } from "./Store/AuthSlice";
import { fetchProducts } from "./Store/ProductSlice";
import Navbar from "./Pages/Navbar";
import Loader from "./lib/Loader";
import AllProducts from "./Pages/AllProducts";
import PaymentPage from "./Pages/PaymentPage";
import CheckOut from "./Pages/CheckOut";
import OrderDetail from "./Pages/OrderDetail";
import Charts from "./Dashboard/Charts";
import Orders from "./Pages/Orders";
import Index from "./Admin/Index";

// Lazy loading for pages
const SignUp = lazy(() => import("./Pages/SignUp"));
const Login = lazy(() => import("./Pages/Login"));
const VerifyEmail = lazy(() => import("./Pages/VerifyEmail"));
const Profile = lazy(() => import("./Pages/Profile"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const Products = lazy(() => import("./Pages/Products"));
const EditProduct = lazy(() => import("./Pages/EditProduct"));
const Product = lazy(() => import("./Pages/Product"));
const Cart = lazy(() => import("./Pages/Cart"));
const ForgotPassword = lazy(() => import("./Pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));
const OrderPage = lazy(() => import("./Pages/OrderPage"));
const ProductForm = lazy(() => import("./Pages/ProductForm"));

// ProtectedRoute Component
const ProtectedRoute = ({ user, redirectTo, children }) => {
  return user ? children : <Navigate to={redirectTo} replace />;
};

// AdminRoute Component for Role-Based Access
const AdminRoute = ({ user, children }) => {
  return user && user.role === "admin" ? children : <NotFound />;
};

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchProducts({}));
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <Loader />
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={user ? <Navigate to="/profile" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/profile" replace /> : <SignUp />} />
          <Route path="/verifyEmail" element={<VerifyEmail />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/password/reset/:resetToken" element={<ResetPassword />} />
          <Route path="/" element={<Products products={products} />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/allProducts" element={<AllProducts />} />
          <Route path="/allProducts/:keyword" element={<AllProducts />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order/:orderId" element={<OrderDetail />} />
          <Route path="/userOrders" element={<Orders />} />
          <Route path="/chart" element={<Charts />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user} redirectTo="/login">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order"
            element={
              <ProtectedRoute user={user} redirectTo="/login">
                <OrderPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/createProduct"
            element={
              <AdminRoute user={user}>
                <ProductForm />
              </AdminRoute>
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <AdminRoute user={user}>
                <Index />
              </AdminRoute>
            }
          />
          <Route
            path="/product/edit/:productId"
            element={
              <AdminRoute user={user}>
                <EditProduct />
              </AdminRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
