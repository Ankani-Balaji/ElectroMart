import { FiSearch, FiX } from "react-icons/fi";
import "./SearchBar.css";

const SearchBar = ({ value, onChange, placeholder = "Search products, brands and more…", className = "" }) => (
  <div className={`search-bar ${className}`}>
    <FiSearch className="search-bar__icon" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="search-bar__input"
      aria-label="Search products"
    />
    {value && (
      <button className="search-bar__clear" onClick={() => onChange("")} aria-label="Clear search">
        <FiX />
      </button>
    )}
  </div>
);

export default SearchBar;
