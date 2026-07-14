import "./Loader.css";

export const Spinner = ({ size = 32 }) => (
  <div className="spinner" style={{ width: size, height: size }} aria-label="Loading" />
);

export const PageLoader = () => (
  <div className="page-loader">
    <Spinner size={40} />
  </div>
);

export const ProductCardSkeleton = () => (
  <div className="card-skeleton">
    <div className="skeleton card-skeleton__image" />
    <div className="skeleton card-skeleton__line" style={{ width: "40%" }} />
    <div className="skeleton card-skeleton__line" style={{ width: "80%" }} />
    <div className="skeleton card-skeleton__line" style={{ width: "50%" }} />
    <div className="skeleton card-skeleton__line" style={{ width: "60%", height: 32 }} />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid-skeleton">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
