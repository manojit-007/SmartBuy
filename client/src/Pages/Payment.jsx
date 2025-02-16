/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Payment = () => {
  const [address, setAddress] = useState(null);
  const [cartItems, setCartItems] = useState(null);
  const [loading, setLoading] = useState(null);
  useEffect(() => {
    const savedAddress = localStorage.getItem("order");
    const savedCartItems = localStorage.getItem("cart");
    setAddress(savedAddress);
    setCartItems(savedCartItems);
  }, []);
  
  return (
    <section className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <header className="w-full text-center mb-6">
        <h1 className="font-bold text-3xl text-gray-800">Payment</h1>
        <p className="text-gray-600">Securely complete your purchase</p>
      </header>
      {/* Payment form goes here */}
      <main>
        <Button>Cash On Delivery</Button>
        <p className="font-bold w-full text-center">OR</p>
        <Button>Pay Now</Button>
      </main>
    </section>
  );
};

export default Payment;
