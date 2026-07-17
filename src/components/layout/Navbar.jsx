import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart, FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiPackage, FiHome, FiShield } from "react-icons/fi";
import { logout } from "../../redux/slices/authSlice";
import { selectCartCount } from "../../redux/slices/cartSlice";
import { selectWishlistItems } from "../../redux/slices/wishlistSlice";
import { toast } from "react-toastify";
import "./Navbar.css";
import { AiFillDashboard } from "react-icons/ai";

const CATEGORY_LINKS = [
  { label: "Smartphones", slug: "smartphones" },
  { label: "Laptops", slug: "laptops" },
  { label: "Audio", slug: "audio" },
  { label: "TVs", slug: "tvs" },
  { label: "Wearables", slug: "wearables" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, account } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistItems).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <button
          className="navbar__burger"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>

        <Link to="/" className="navbar__logo">
          Electro<span>Mart</span>
        </Link>
        <form className="navbar__search" onSubmit={handleSearchSubmit}>
          <FiSearch />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, brands and more…"
          />
        </form>

        <nav className={`navbar__links ${mobileOpen ? "is-open" : ""}`}>
          {CATEGORY_LINKS.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              onClick={() => setMobileOpen(false)}
            >
              {cat.label}
            </Link>
          ))}
          <div className="navbar__mobile-only">
            <form className="navbar__search navbar__search--mobile" onSubmit={handleSearchSubmit}>
              <FiSearch />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search…"
              />
            </form>
          </div>
        </nav>

        <div className="navbar__actions">
          <Link to="/wishlist" className="navbar__icon-btn" aria-label="Wishlist">
            <FiHeart />
            {wishlistCount > 0 && <span className="navbar__badge">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className="navbar__icon-btn" aria-label="Cart">
            <FiShoppingCart />
            {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
          </Link>
           <Link to="/admin/login" className="navbar__icon-btn" aria-label="Admin-Login">
            <FiShield />
          </Link>
          {isAuthenticated ? (
            <div className="navbar__profile">
              <button className="navbar__icon-btn navbar__avatar-btn" aria-label="Account menu">
                
                  <FiUser />
              
              </button>
              <div className="navbar__dropdown">
                <span className="navbar__dropdown-name">{account?.name}</span>
                <Link to="/profile"><FiUser /> Profile</Link>
                <Link to="/orders"><FiPackage /> My Orders</Link>
                <button onClick={handleLogout}><FiLogOut /> Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="navbar__icon-btn" aria-label="Login">
              <FiUser />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
