import apiClient from "@/ApiClient/ApiClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CheckOut = () => {
  const checkout = async (amount) => {
    try {
      const { data } = await apiClient.post(
        "/payment/checkout",
        {
          amount,
        }
      );

      const options = {
        key: "rzp_test_rZamYpHCBmdNe6",
        order_id: data.id,
        amount: data.amount,
        currency: "INR",
        name: "SmartBuy",
        description: "Payment Gateway Integration",
        image: "https://avatars.githubusercontent.com/u/159749926?v=4",
        callback_url: "/payment/paymentverification",
        prefill: {
          name: "Mono",
          email: "customer@example.com",
          contact: "9876543210",
        },
        notes: {
          address: "Customer Address",
        },
        theme: {
          color: "#121212",
        },
        handler: async function (response) {
          console.log("Payment Response:", response);
          const verificationData = await apiClient.post(
            "/payment/paymentverification",
            response,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Verification Response:", verificationData.data);
          toast.success(verificationData.data.message);
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Checkout Error:", error);
    }
  };

  return (
    <section>
      <Button
        amount={5000}
        img="https://your-image-url.com/image1.png"
        onClick={() => checkout(5000)}
      >
        Check Out
      </Button>
    </section>
  );
};

export default CheckOut;
