import { useCallback } from "react";
import { RAZORPAY_KEY_ID } from "../utils/constants";

const loadScript = (src) =>
  new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// Encapsulates loading the Razorpay checkout script and opening the payment modal.
// Runs in Razorpay Test Mode using the standard public test key.
export const useRazorpay = () => {
  const openCheckout = useCallback(async ({ amount, name, description, prefill, onSuccess, onFailure }) => {
    const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!loaded) {
      onFailure?.(new Error("Razorpay SDK failed to load. Check your internet connection."));
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100), // amount in paise, rounded to avoid decimal issues
      currency: "INR",
      name: "ElectroMart",
      description: description || "Order Payment",
      prefill,
      theme: { color: "#2F6BFF" },
      handler: (response) => {
        onSuccess?.(response);
      },
      modal: {
        ondismiss: () => {
          onFailure?.(new Error("Payment was cancelled."));
        },
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.on("payment.failed", (response) => {
      onFailure?.(new Error(response.error?.description || "Payment failed."));
    });
    razorpayInstance.open();
  }, []);

  return { openCheckout };
};
