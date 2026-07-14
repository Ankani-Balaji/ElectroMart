import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiCreditCard, FiTruck, FiMapPin } from "react-icons/fi";
import { toast } from "react-toastify";
import { selectCartItems, selectCartTotal, clearCart } from "../redux/slices/cartSlice";
import { placeOrder } from "../redux/slices/orderSlice";
import { useRazorpay } from "../hooks/useRazorpay";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { formatCurrency } from "../utils/formatters";
import { PAYMENT_METHODS } from "../utils/constants";
import "./Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openCheckout } = useRazorpay();

  const { account } = useSelector((state) => state.auth);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  // Buy Now bypasses the cart entirely: only the passed product is purchased.
  const buyNowItem = location.state?.buyNowItem || null;
  const isBuyNow = !!buyNowItem;

  const checkoutItems = isBuyNow
    ? [
        {
          id: buyNowItem.id,
          title: buyNowItem.title,
          image: buyNowItem.images?.[0] || buyNowItem.image,
          price: buyNowItem.price,
          quantity: buyNowItem.quantity || 1,
        },
      ]
    : cartItems;

  const total = isBuyNow ? buyNowItem.price * (buyNowItem.quantity || 1) : cartTotal;

  const defaultAddress = account?.addresses?.find((a) => a.isDefault) || account?.addresses?.[0];

  const [address, setAddress] = useState({
    label: defaultAddress?.label || "Home",
    line1: defaultAddress?.line1 || "",
    city: defaultAddress?.city || "",
    state: defaultAddress?.state || "",
    pincode: defaultAddress?.pincode || "",
  });
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.RAZORPAY);
  const [placing, setPlacing] = useState(false);

  if (checkoutItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const validateAddress = () => {
    if (!address.line1.trim() || !address.city.trim() || !address.state.trim() || !address.pincode.trim()) {
      toast.error("Please fill in your complete shipping address.");
      return false;
    }
    return true;
  };

  const finalizeOrder = async (paymentId = null) => {
    setPlacing(true);
    try {
      const order = {
        userId: account.id,
        items: checkoutItems.map((item) => ({
          productId: item.id,
          title: item.title,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: total,
        paymentMethod,
        paymentId,
        status: "Processing",
        shippingAddress: address,
        createdAt: new Date().toISOString(),
      };
      const created = await dispatch(placeOrder(order)).unwrap();

      // Cart checkout clears the cart; Buy Now never touches the cart.
      if (!isBuyNow) dispatch(clearCart());

      navigate("/order-success", { state: { order: created } });
    } catch (err) {
      toast.error(err.message || "Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;

    if (paymentMethod === PAYMENT_METHODS.COD) {
      await finalizeOrder(null);
      return;
    }

    setPlacing(true);
    await openCheckout({
      amount: total,
      description: isBuyNow ? checkoutItems[0].title : `ElectroMart order (${checkoutItems.length} items)`,
      prefill: { name: account?.name, email: account?.email, contact: account?.phone },
      onSuccess: (response) => {
        finalizeOrder(response.razorpay_payment_id);
      },
      onFailure: (err) => {
        setPlacing(false);
        toast.error(err.message || "Payment was not completed.");
      },
    });
  };

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>
      {isBuyNow && (
        <p className="checkout-page__mode-note">
          Buying <strong>{checkoutItems[0].title}</strong> directly — your cart is untouched.
        </p>
      )}

      <div className="checkout-page__layout">
        <div className="checkout-form">
          <section className="checkout-section">
            <h3><FiMapPin /> Shipping Address</h3>
            <div className="checkout-form__grid">
              <Input
                label="Address Label"
                value={address.label}
                onChange={(e) => setAddress({ ...address, label: e.target.value })}
                placeholder="Home, Office..."
              />
              <Input
                label="Address Line"
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                placeholder="Street, area"
                containerClassName="checkout-form__full"
              />
              <Input
                label="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
              <Input
                label="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              />
              <Input
                label="Pincode"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              />
            </div>
          </section>

          <section className="checkout-section">
            <h3><FiCreditCard /> Payment Method</h3>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === PAYMENT_METHODS.RAZORPAY ? "is-active" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === PAYMENT_METHODS.RAZORPAY}
                  onChange={() => setPaymentMethod(PAYMENT_METHODS.RAZORPAY)}
                />
                <div>
                  <strong>Pay Online</strong>
                  <span>Cards, UPI, Netbanking via Razorpay (Test Mode)</span>
                </div>
              </label>
              <label className={`payment-option ${paymentMethod === PAYMENT_METHODS.COD ? "is-active" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === PAYMENT_METHODS.COD}
                  onChange={() => setPaymentMethod(PAYMENT_METHODS.COD)}
                />
                <div>
                  <strong>Cash on Delivery</strong>
                  <span>Pay when your order arrives</span>
                </div>
              </label>
            </div>
          </section>
        </div>

        <aside className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="checkout-summary__items">
            {checkoutItems.map((item) => (
              <div key={item.id} className="checkout-summary__item">
                <img src={item.image} alt={item.title} />
                <div>
                  <span className="checkout-summary__title">{item.title}</span>
                  <span className="text-faint">Qty {item.quantity}</span>
                </div>
                <span className="mono">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="trace-divider" style={{ margin: "var(--space-4) 0" }}>
            <span className="trace-divider__dot" />
          </div>
          <div className="checkout-summary__row checkout-summary__row--total">
            <span>Total</span>
            <span className="mono">{formatCurrency(total)}</span>
          </div>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={FiTruck}
            loading={placing}
            onClick={handlePlaceOrder}
          >
            {paymentMethod === PAYMENT_METHODS.COD ? "Place Order" : `Pay ${formatCurrency(total)}`}
          </Button>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
