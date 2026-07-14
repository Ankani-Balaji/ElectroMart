import { FiBox } from "react-icons/fi";
import ProductCard from "./ProductCard";
import EmptyState from "../common/EmptyState";
import { ProductGridSkeleton } from "../common/Loader";
import "./ProductGrid.css";

const ProductGrid = ({ products, loading, emptyTitle = "No products found", emptyMessage }) => {
  if (loading) return <ProductGridSkeleton />;

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={FiBox}
        title={emptyTitle}
        message={emptyMessage || "Try adjusting your search or filters."}
      />
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
