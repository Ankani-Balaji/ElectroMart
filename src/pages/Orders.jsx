import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiPackage } from "react-icons/fi";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import EmptyState from "../components/common/EmptyState";
import { PageLoader } from "../components/common/Loader";
import { formatCurrency, formatDate } from "../utils/formatters";
import "./Orders.css";

const STATUS_TONE = {
  Processing: "warning",
  Confirmed: "primary",
  Shipped: "primary",
  "Out for Delivery": "primary",
  Delivered: "success",
  Cancelled: "danger",
};

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account } = useSelector((state) => state.auth);
  const { items, status } = useSelector((state) => state.orders);

  useEffect(() => {
    if (account?.id) dispatch(fetchUserOrders(account.id));
  }, [dispatch, account]);

  if (status === "loading") return <PageLoader />;

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: "var(--space-9) 0" }}>
        <EmptyState
          icon={FiPackage}
          title="No orders yet"
          message="When you place an order, it will show up here."
          actionLabel="Start Shopping"
          onAction={() => navigate("/products")}
        />
      </div>
    );
  }

  return (
    <div className="container orders-page">
      <h1>My Orders</h1>
      <div className="orders-list">
        {items.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card__header">
              <div>
                <span className="order-card__id mono">#{order.id}</span>
                <span className="text-faint"> · {formatDate(order.createdAt)}</span>
              </div>
              <span className={`order-status order-status--${STATUS_TONE[order.status] || "neutral"}`}>
                {order.status}
              </span>
            </div>
            <div className="order-card__items">
              {order.items.map((item, i) => (
                <div key={i} className="order-card__item">
                  <img src={item.image} alt={item.title} />
                  <div>
                    <span>{item.title}</span>
                    <span className="text-faint">Qty {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-card__footer">
              <span>{order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}</span>
              <span className="mono order-card__total">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
