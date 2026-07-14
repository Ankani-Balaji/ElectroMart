import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart, FiShoppingCart, FiStar, FiCheck, FiTruck, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";
import { fetchProducts } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { toggleWishlist, selectIsWishlisted } from "../redux/slices/wishlistSlice";
import ProductBadge from "../components/product/ProductBadge";
import ProductCard from "../components/product/ProductCard";
import { PageLoader } from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import { formatCurrency } from "../utils/formatters";
import "./ProductDetails.css";

const TABS = ["description", "specifications"];

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((state) => state.products);
  const product = items.find((p) => p.id === id);
  const isWishlisted = useSelector(selectIsWishlisted(id));

  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (items.length === 0) dispatch(fetchProducts());
  }, [dispatch, items.length]);

  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (status === "loading" && !product) return <PageLoader />;

  if (!product) {
    return (
      <div className="container" style={{ padding: "var(--space-9) 0" }}>
        <EmptyState
          title="Product not found"
          message="This product may have been removed or the link is incorrect."
          actionLabel="Back to Products"
          onAction={() => navigate("/products")}
        />
      </div>
    );
  }

  const related = items
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) dispatch(addToCart(product));
    toast.success(`${product.title} added to cart`);
  };

  const handleBuyNow = () => {
    navigate("/checkout", { state: { buyNowItem: { ...product, quantity } } });
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
    toast.info(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const outOfStock = product.stock <= 0;

  return (
    <div className="container product-details">
      <div className="product-details__grid">
        <div className="product-details__gallery">
          <div className="product-details__main-image">
            {product.discount > 0 && (
              <ProductBadge tone="accent">{product.discount}% OFF</ProductBadge>
            )}
            <img src={product.images[activeImage]} alt={product.title} />
          </div>
          <div className="product-details__thumbs">
            {product.images.map((img, i) => (
              <button
                key={i}
                className={`product-details__thumb ${i === activeImage ? "is-active" : ""}`}
                onClick={() => setActiveImage(i)}
              >
                <img src={img} alt={`${product.title} view ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-details__info">
          <span className="product-details__brand">{product.brand}</span>
          <h1>{product.title}</h1>

          <div className="product-details__rating">
            <FiStar className="product-details__star" />
            <span>{product.rating}</span>
            <span className="text-faint">({product.ratingCount} ratings)</span>
            <span className={`product-details__stock ${outOfStock ? "is-out" : ""}`}>
              {outOfStock ? "Out of Stock" : `${product.stock} in stock`}
            </span>
          </div>

          <div className="product-details__price">
            <span className="mono">{formatCurrency(product.price)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="product-details__price-original mono">
                  {formatCurrency(product.originalPrice)}
                </span>
                <ProductBadge tone="success">Save {product.discount}%</ProductBadge>
              </>
            )}
          </div>

          <div className="product-details__quantity">
            <span>Quantity</span>
            <div className="qty-stepper">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
            </div>
          </div>

          <div className="product-details__actions">
            <button
              className="product-details__btn product-details__btn--outline"
              onClick={handleWishlist}
            >
              <FiHeart className={isWishlisted ? "is-active" : ""} />
              {isWishlisted ? "Wishlisted" : "Wishlist"}
            </button>
            <button
              className="product-details__btn product-details__btn--ghost"
              onClick={handleAddToCart}
              disabled={outOfStock}
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button
              className="product-details__btn product-details__btn--primary"
              onClick={handleBuyNow}
              disabled={outOfStock}
            >
              Buy Now
            </button>
          </div>

          <div className="product-details__perks">
            <span><FiTruck /> Free delivery in 2-4 days</span>
            <span><FiShield /> 1 year warranty</span>
            <span><FiCheck /> 7-day easy returns</span>
          </div>
        </div>
      </div>

      <div className="product-details__tabs">
        <div className="product-details__tab-nav">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "is-active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "description" ? "Description" : "Specifications"}
            </button>
          ))}
        </div>
        <div className="product-details__tab-content">
          {activeTab === "description" ? (
            <p>{product.description}</p>
          ) : (
            <table className="specs-table">
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="product-details__related">
          <div className="section-heading">
            <h2>Related Products</h2>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
