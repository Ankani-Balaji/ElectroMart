import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { FiSliders } from "react-icons/fi";
import {
  fetchProducts,
  fetchCategories,
  setSearch,
  setCategory,
  setSort,
  setPriceRange,
  resetFilters,
  selectFilteredProducts,
} from "../redux/slices/productSlice";
import SearchBar from "../components/common/SearchBar";
import ProductGrid from "../components/product/ProductGrid";
import "./Products.css";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "newest", label: "Newest First" },
];

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, status, filters } = useSelector((state) => state.products);
  const filteredProducts = useSelector(selectFilteredProducts);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Sync URL query params (?search=&category=) into redux filters on load / URL change.
  useEffect(() => {
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    if (search !== null) dispatch(setSearch(search));
    if (category !== null) dispatch(setCategory(category));
  }, [searchParams, dispatch]);

  const handleCategoryChange = (slug) => {
    dispatch(setCategory(slug));
    const params = new URLSearchParams(searchParams);
    if (slug === "all") params.delete("category");
    else params.set("category", slug);
    setSearchParams(params);
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setSearchParams({});
  };

  return (
    <div className="container products-page">
      <div className="products-page__header">
        <div>
          <h1>All Products</h1>
          <p className="text-soft">{filteredProducts.length} products found</p>
        </div>
        <SearchBar
          value={filters.search}
          onChange={(v) => dispatch(setSearch(v))}
          className="products-page__search"
        />
      </div>

      <div className="products-page__layout">
        <aside className="products-filters">
          <div className="products-filters__head">
            <h3><FiSliders /> Filters</h3>
            <button onClick={handleReset} className="products-filters__reset">Reset</button>
          </div>

          <div className="products-filters__group">
            <h4>Category</h4>
            <button
              className={filters.category === "all" ? "is-active" : ""}
              onClick={() => handleCategoryChange("all")}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={filters.category === cat.slug ? "is-active" : ""}
                onClick={() => handleCategoryChange(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="products-filters__group">
            <h4>Max Price: ₹{filters.maxPrice.toLocaleString("en-IN")}</h4>
            <input
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={filters.maxPrice}
              onChange={(e) =>
                dispatch(setPriceRange({ min: 0, max: Number(e.target.value) }))
              }
            />
          </div>

          <div className="products-filters__group">
            <h4>Sort By</h4>
            <select value={filters.sort} onChange={(e) => dispatch(setSort(e.target.value))}>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </aside>

        <div className="products-results">
          <ProductGrid products={filteredProducts} loading={status === "loading"} />
        </div>
      </div>
    </div>
  );
};

export default Products;
