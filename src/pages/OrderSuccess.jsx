import { useLocation, useNavigate, Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { formatCurrency, formatDate } from "../utils/formatters";
import Button from "../components/common/Button";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    navigate("/");
    return null;
  }

  return (
    <div className="container order-success">
      <div className="order-success__icon">
        <FiCheckCircle />
      </div>
      <h1>Order placed successfully!</h1>
      <p className="text-soft">
        Thank you — your order <strong className="mono">#{order.id}</strong> has been confirmed.
      </p>

      <div className="order-success__card">
        <div className="order-success__row">
          <span>Order Date</span>
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <div className="order-success__row">
          <span>Payment Method</span>
          <span>{order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}</span>
        </div>
        <div className="order-success__row">
          <span>Total Amount</span>
          <span className="mono">{formatCurrency(order.totalAmount)}</span>
        </div>
        <div className="order-success__row">
          <span>Shipping To</span>
          <span>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</span>
        </div>
      </div>

      <div className="order-success__actions">
        <Button variant="outline" onClick={() => navigate("/orders")}>View My Orders</Button>
        <Link to="/products"><Button variant="primary">Continue Shopping</Button></Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
