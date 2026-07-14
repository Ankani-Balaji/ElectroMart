import { Link } from "react-router-dom";
import "./Categories.css";

const Categories = ({ categories = [] }) => {
  if (!categories.length) return null;

  return (
    <section className="container categories-section">
      <div className="section-heading">
        <h2>Shop by Category</h2>
        <p className="text-soft">Find exactly what you're looking for.</p>
      </div>
      <div className="categories-grid">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.slug}`}
            className="category-card"
          >
            <div className="category-card__image">
              <img src={cat.image} alt={cat.name} loading="lazy" />
            </div>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
