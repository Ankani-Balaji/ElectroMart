import "./ProductBadge.css";

// Small colored badge used on ProductCard and ProductDetails for discounts and tags.
const ProductBadge = ({ children, tone = "accent" }) => (
  <span className={`product-badge product-badge--${tone}`}>{children}</span>
);

export default ProductBadge;
