import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart, FiEye, FiShoppingCart, FiStar } from "react-icons/fi";
import { toast } from "react-toastify";
import ProductBadge from "./ProductBadge";
import { addToCart } from "../../redux/slices/cartSlice";
import { toggleWishlist, selectIsWishlisted } from "../../redux/slices/wishlistSlice";
import { formatCurrency } from "../../utils/formatters";
import "./ProductCard.css";

/**
 * THE single ProductCard component reused everywhere: Home, Products, Wishlist,
 * Related Products, and Admin previews. Do not duplicate this component.
 */
const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isWishlisted = useSelector(selectIsWishlisted(product.id));

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    toast.success(`${product.title} added to cart`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    toast.info(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleViewDetails = () => {
    navigate(`/products/${product.id}`);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    // Buy Now opens Checkout directly via router state, bypassing the cart.
    navigate("/checkout", { state: { buyNowItem: { ...product, quantity: 1 } } });
  };

  const outOfStock = product.stock <= 0;

  return (
    <article className="product-card fade-in" onClick={handleViewDetails}>
      <div className="product-card__media">
        {product.discount > 0 && (
          <ProductBadge tone="accent">{product.discount}% OFF</ProductBadge>
        )}
        <button
          className={`product-card__wishlist ${isWishlisted ? "is-active" : ""}`}
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart />
        </button>
        <img src={product.images?.[0] || product.image} alt={product.title} loading="lazy" />
        {outOfStock && <div className="product-card__oos">Out of Stock</div>}
      </div>

      <div className="product-card__body">
        <span className="product-card__brand">{product.brand}</span>
        <h3 className="product-card__title">{product.title}</h3>

        <div className="product-card__rating">
          <FiStar className="product-card__star" />
          <span>{product.rating}</span>
          {product.ratingCount && <span className="text-faint">({product.ratingCount})</span>}
        </div>

        <div className="product-card__price">
          <span className="product-card__price-current mono">{formatCurrency(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="product-card__price-original mono">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="product-card__actions">
          <button
            className="product-card__btn product-card__btn--outline"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
          >
            <FiEye /> View
          </button>
          <button
            className="product-card__btn product-card__btn--ghost"
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            <FiShoppingCart /> Add
          </button>
        </div>
        <button
          className="product-card__buy-now"
          onClick={handleBuyNow}
          disabled={outOfStock}
        >
          Buy Now
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
