/* eslint-disable no-unused-vars */
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, Suspense, lazy, useMemo } from "react";
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

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const { products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const memoizedProducts = useMemo(() => products, [products]); // Memoizing products
  const memoizedUser = useMemo(() => user,[user]); // Memoizing products

  useEffect(() => {
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
          <Route
            path="/login"
            element={memoizedUser ? <Navigate to="/profile" replace /> : <Login />}
          />
          <Route path="/" element={<Products products={memoizedProducts} />} />
          <Route
            path="/signup"
            element={memoizedUser ? <Navigate to="/profile" replace /> : <SignUp />}
          />
          <Route path="/verifyEmail" element={<VerifyEmail />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/password/reset/:resetToken" element={<ResetPassword />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/product/edit/:productId" element={<EditProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/createProduct"
            element={
              memoizedUser && memoizedUser.role === "admin" ? <ProductForm /> : <NotFound />
            }
          />
          <Route
            path="/dashboard/*"
            element={
              memoizedUser && memoizedUser.role === "admin" ? <Index /> : <NotFound />
            }
          />
          <Route path="/allProducts" element={<AllProducts />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/order/:orderId" element={<OrderDetail />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/allProducts/:keyword" element={<AllProducts />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/error" element={<NotFound />} />
          <Route path="/userOrders" element={<Orders />} />
          <Route path="/chart" element={<Charts />} />
          <Route
            path="/profile"
            element={
                <Profile />
            }
          />
          <Route
            path="/order"
            element={
                <OrderPage />
            }
          />
          <Route
            path="/dashboard/*"
            element={
                <Index />
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;