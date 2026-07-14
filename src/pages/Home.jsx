import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchCategories } from "../redux/slices/productSlice";
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FlashDeals from "../components/home/FlashDeals";
import Brands from "../components/home/Brands";
import ProductGrid from "../components/product/ProductGrid";

const Home = () => {
  const dispatch = useDispatch();
  const { items, categories, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const flashDeals = items.filter((p) => p.isFlashDeal);
  const featured = items.filter((p) => p.isFeatured);

  return (
    <div>
      <Hero />
      <Categories categories={categories} />
      <FlashDeals products={flashDeals} />

      <section className="container" style={{ padding: "var(--space-8) var(--space-5)" }}>
        <div className="section-heading">
          <h2>Featured Products</h2>
          <p className="text-soft">Hand-picked, highly rated, ready to ship.</p>
        </div>
        <ProductGrid products={featured} loading={status === "loading"} />
      </section>

      <Brands />
    </div>
  );
};

export default Home;
