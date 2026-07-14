import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./NotFound.css";

const NotFound = () => (
  <div className="not-found">
    <span className="not-found__code mono">404</span>
    <h1>Page not found</h1>
    <p className="text-soft">The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="not-found__link">
      <FiArrowLeft /> Back to Home
    </Link>
  </div>
);

export default NotFound;
