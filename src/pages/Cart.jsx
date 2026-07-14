import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiTrash2, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from "../redux/slices/cartSlice";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";
import { formatCurrency } from "../utils/formatters";
import "./Cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: "var(--space-9) 0" }}>
        <EmptyState
          icon={FiShoppingBag}
          title="Your cart is empty"
          message="Looks like you haven't added anything yet. Let's fix that."
          actionLabel="Start Shopping"
          onAction={() => navigate("/products")}
        />
      </div>
    );
  }

  const savings = items.reduce(
    (sum, item) => sum + ((item.originalPrice || item.price) - item.price) * item.quantity,
    0
  );

  return (
    <div className="container cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-page__layout">
        <div className="cart-list">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <Link to={`/products/${item.id}`} className="cart-item__image">
                <img src={item.image} alt={item.title} />
              </Link>
              <div className="cart-item__info">
                <span className="cart-item__brand">{item.brand}</span>
                <Link to={`/products/${item.id}`} className="cart-item__title">{item.title}</Link>
                <div className="cart-item__price mono">{formatCurrency(item.price)}</div>
              </div>
              <div className="qty-stepper">
                <button onClick={() => dispatch(decrementQuantity(item.id))}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
              </div>
              <div className="cart-item__subtotal mono">
                {formatCurrency(item.price * item.quantity)}
              </div>
              <button
                className="cart-item__remove"
                onClick={() => dispatch(removeFromCart(item.id))}
                aria-label="Remove item"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span className="mono">{formatCurrency(total)}</span>
          </div>
          {savings > 0 && (
            <div className="cart-summary__row cart-summary__row--savings">
              <span>You save</span>
              <span className="mono">−{formatCurrency(savings)}</span>
            </div>
          )}
          <div className="cart-summary__row">
            <span>Delivery</span>
            <span className="mono">Free</span>
          </div>
          <div className="trace-divider" style={{ margin: "var(--space-4) 0" }}>
            <span className="trace-divider__dot" />
          </div>
          <div className="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span className="mono">{formatCurrency(total)}</span>
          </div>
          <Button
            variant="primary"
            fullWidth
            size="lg"
            icon={FiArrowRight}
            iconPosition="right"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </Button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
