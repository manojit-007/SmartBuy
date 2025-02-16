import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const OrderPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    shippingInfo: {
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      phoneNo: "",
    },
  });
  useEffect(() => {
    document.title = `SmartBuy - Order`;
  }, [])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFormData = localStorage.getItem("order");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  // Save data to localStorage on change
  useEffect(() => {
    localStorage.setItem("order", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      shippingInfo: {
        ...prevState.shippingInfo,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form Submitted:", formData);
    // Add API call or further processing here
    toast.success("Shipping information submitted successfully!");
    navigate("/payment")
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Shipping Information</h2>
        <div className="flex flex-col gap-1">
          <Label htmlFor="address" className="text-sm font-medium text-gray-600">
            Address
          </Label>
          <Textarea
            id="address"
            name="address"
            value={formData.shippingInfo.address}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="city" className="text-sm font-medium text-gray-600">
            City
          </Label>
          <Input
            id="city"
            name="city"
            type="text"
            value={formData.shippingInfo.city}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="state" className="text-sm font-medium text-gray-600">
            State
          </Label>
          <Input
            id="state"
            name="state"
            type="text"
            value={formData.shippingInfo.state}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="country" className="text-sm font-medium text-gray-600">
            Country
          </Label>
          <Input
            id="country"
            name="country"
            type="text"
            value={formData.shippingInfo.country}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="pinCode" className="text-sm font-medium text-gray-600">
            Pin Code
          </Label>
          <Input
            id="pinCode"
            name="pinCode"
            type="text"
            value={formData.shippingInfo.pinCode}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="phoneNo" className="text-sm font-medium text-gray-600">
            Phone Number
          </Label>
          <Input
            id="phoneNo"
            name="phoneNo"
            type="text"
            value={formData.shippingInfo.phoneNo}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button
          type="submit"
          className="w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Next
        </Button>
      </form>
    </section>
  );
};

export default OrderPage;
