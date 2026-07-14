import { useEffect, useState } from "react";
import { FiZap } from "react-icons/fi";
import ProductCard from "../product/ProductCard";
import "./FlashDeals.css";

const getEndOfDay = () => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end;
};

const useCountdown = () => {
  const [remaining, setRemaining] = useState(getEndOfDay() - new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(getEndOfDay() - new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.max(0, Math.floor(remaining / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((remaining / (1000 * 60)) % 60));
  const seconds = Math.max(0, Math.floor((remaining / 1000) % 60));

  return { hours, minutes, seconds };
};

const pad = (n) => String(n).padStart(2, "0");

const FlashDeals = ({ products = [] }) => {
  const { hours, minutes, seconds } = useCountdown();

  if (!products.length) return null;

  return (
    <section className="container flash-deals">
      <div className="flash-deals__header">
        <div className="section-heading" style={{ marginBottom: 0 }}>
          <h2><FiZap className="flash-deals__icon" /> Flash Deals</h2>
          <p className="text-soft">Prices this good won't last.</p>
        </div>
        <div className="flash-deals__timer mono">
          <span>{pad(hours)}</span>:<span>{pad(minutes)}</span>:<span>{pad(seconds)}</span>
        </div>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FlashDeals;
