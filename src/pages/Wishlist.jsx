import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiHeart } from "react-icons/fi";
import { selectWishlistItems } from "../redux/slices/wishlistSlice";
import ProductCard from "../components/product/ProductCard";
import EmptyState from "../components/common/EmptyState";
import "./Wishlist.css";

const Wishlist = () => {
  const navigate = useNavigate();
  const items = useSelector(selectWishlistItems);
  const { items: allProducts } = useSelector((state) => state.products);

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: "var(--space-9) 0" }}>
        <EmptyState
          icon={FiHeart}
          title="Your wishlist is empty"
          message="Save products you love and find them here anytime."
          actionLabel="Browse Products"
          onAction={() => navigate("/products")}
        />
      </div>
    );
  }

  // Prefer the live product record (fresh stock/price) when available, falling back to the saved snapshot.
  const resolved = items.map(
    (item) => allProducts.find((p) => p.id === item.id) || { ...item, images: [item.image], stock: 10 }
  );

  return (
    <div className="container wishlist-page">
      <h1>My Wishlist</h1>
      <p className="text-soft" style={{ marginBottom: "var(--space-6)" }}>
        {resolved.length} item{resolved.length !== 1 ? "s" : ""} saved
      </p>
      <div className="product-grid">
        {resolved.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
