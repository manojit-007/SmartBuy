import { useEffect, useState, useMemo } from "react";
import EmptyCart from "@/assets/EmptyCart.svg";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import DeleteIcon from "@/assets/delete.svg";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [cartItems, setCartItems] = useState(
    () => JSON.parse(localStorage.getItem("cart")) || []
  );

  useEffect(() => {
    document.title = "SmartBuy - Cart";
  }, []);

  const updateLocalStorage = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const addToCart = (item) => {
    const updatedCart = cartItems.map((cartItem) =>
      cartItem._id === item._id
        ? {
            ...cartItem,
            quantity: Math.min(cartItem.quantity + 1, cartItem.maxQuantity),
          }
        : cartItem
    );
  
    if (!cartItems.some((cartItem) => cartItem._id === item._id)) {
      if (item.quantity < item.maxQuantity) {
        updatedCart.push({ ...item, quantity: 1 });
      } else {
        toast.error(`Cannot add more than ${item.maxQuantity} items to the cart.`);
        return;
      }
    }
  
    updateLocalStorage(updatedCart);
  
    const isMaxQuantity = updatedCart.find(
      (cartItem) => cartItem._id === item._id && cartItem.quantity === item.maxQuantity
    );
    if (isMaxQuantity) {
      toast.info(`You have reached the maximum stock limit for ${item.name}.`);
    }
  };
  
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item._id !== productId);
    updateLocalStorage(updatedCart);
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item._id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateLocalStorage(updatedCart);
  };

  const totalAmount = useMemo(
    () =>
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  const gstAmount = useMemo(() => totalAmount * 0.05, [totalAmount]);
  const finalAmount = useMemo(() => totalAmount + gstAmount, [totalAmount, gstAmount]);

  if (cartItems.length === 0) {
    return (
      <div className="flex items-center flex-col justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty.</h1>
        <Button
          onClick={() => navigate("/allProducts")}
          aria-label="Go to All Products"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800"
        >
          Browse Products
        </Button>
        <img src={EmptyCart} alt="Empty cart" className="w-full max-w-md mt-4" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Button onClick={() => navigate(-1)} className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700">
        Back
      </Button>
      <h1 className="text-2xl font-bold text-center mb-4">Cart</h1>
      <ul className="space-y-4">
        {cartItems.map((item) => (
          <li key={item._id} className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center gap-4" onClick={()=>navigate(`/product/${item._id}`)}>
              <img
                src={item.image?.url || "/placeholder.jpg"}
                alt={item.name}
                className="w-16 h-16 object-contain rounded border"
              />
              <div>
                <h2 className="font-semibold text-lg">{item.name}</h2>
                <p className="text-gray-600">${item.price} x {item.quantity}</p>
                {/* <p>{item.maxQuantity}</p> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => decreaseQuantity(item._id)}
                disabled={item.quantity <= 1}
                className={`px-3 py-1 rounded text-white ${
                  item.quantity > 1
                    ? "bg-blue-600 hover:bg-blue-800"
                    : "bg-blue-300 cursor-not-allowed"
                }`}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <button
                onClick={() => addToCart(item)}
                className="px-3 py-1 rounded text-white bg-blue-600 hover:bg-blue-800"
                aria-label="Increase quantity"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item._id)}
                className="px-3 py-1 rounded text-white bg-red-500 hover:bg-red-700"
                aria-label="Remove item"
              >
                <img src={DeleteIcon} className="w-6 h-6" alt="" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 bg-gray-50 p-4 rounded-md shadow-md flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold">Total: ₹{totalAmount.toFixed(2)}</p>
          <p className="text-lg font-semibold">GST: ₹{gstAmount.toFixed(2)}</p>
          <p className="text-lg font-bold">Final Amount: ₹{finalAmount.toFixed(2)}</p>
        </div>
        <Button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800"
          onClick={() => navigate(user ? "/order" : "/login")}
          aria-label="Proceed to Checkout"
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default Cart;
