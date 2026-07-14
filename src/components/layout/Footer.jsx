import { useState } from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiYoutube, FiFacebook, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Subscribed! Watch your inbox for deals.");
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            Electro<span>Mart</span>
          </Link>
          <p>Premium electronics, curated for people who care about the details.</p>
          <div className="footer__social">
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" aria-label="YouTube"><FiYoutube /></a>
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
          </div>
        </div>

        <div className="footer__links">
          <h4>Shop</h4>
          <Link to="/products?category=smartphones">Smartphones</Link>
          <Link to="/products?category=laptops">Laptops</Link>
          <Link to="/products?category=audio">Audio</Link>
          <Link to="/products?category=tvs">TVs</Link>
        </div>

        <div className="footer__links">
          <h4>Account</h4>
          <Link to="/profile">My Profile</Link>
          <Link to="/orders">Order History</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="footer__links">
          <h4>Company</h4>
          <Link to="/contact">Contact Us</Link>
          <Link to="/admin/login">Admin Login</Link>
        </div>

        <div className="footer__newsletter">
          <h4>Stay in the loop</h4>
          <p>Flash deals, new launches, and restocks — straight to your inbox.</p>
          <form onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <button type="submit" aria-label="Subscribe">
              <FiSend />
            </button>
          </form>
        </div>
      </div>

      <div className="trace-divider container">
        <span className="trace-divider__dot" />
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} ElectroMart. All rights reserved.</span>
        <span>Built for demonstration — payments run in Razorpay Test Mode.</span>
      </div>
    </footer>
  );
};

export default Footer;
