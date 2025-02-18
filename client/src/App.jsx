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
          <Route
            path="/login"
            element={user ? <Navigate to="/profile" replace /> : <Login />}
          />
          <Route path="/" element={<Products products={products} />} />
          <Route
            path="/signup"
            element={user ? <Navigate to="/profile" replace /> : <SignUp />}
          />
          <Route
            path="/profile"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : user.verified ? (
                <Profile />
              ) : (
                <Navigate to="/verifyEmail" replace />
              )
            }
          />

          <Route path="/verifyEmail" element={<VerifyEmail />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route
            path="/password/reset/:resetToken"
            element={<ResetPassword />}
          />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/product/edit/:productId" element={<EditProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/createProduct"
            element={user?.role === "admin" ? <ProductForm /> : <NotFound />}
          />
          <Route
            path="/dashboard/*"
            element={user?.role === "admin" ? <Index /> : <NotFound />}
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
          <Route path="/order" element={<OrderPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
