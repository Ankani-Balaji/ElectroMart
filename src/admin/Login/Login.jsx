import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiMail, FiLock, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";
import { adminLogin } from "../../redux/slices/authSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import "../../pages/Auth.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(adminLogin({ email, password })).unwrap();
      toast.success("Welcome back, Admin!");
      navigate(location.state?.from?.pathname || "/admin/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <Link to="/" className="auth-card__logo">Electro<span>Mart</span></Link>
        <h1><FiShield style={{ verticalAlign: "-3px", marginRight: 8 }} />Admin Login</h1>
        <p className="text-soft">Sign in to manage your store.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email"
            type="email"
            icon={FiMail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@electromart.com"
            required
          />
          <Input
            label="Password"
            type="password"
            icon={FiLock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" fullWidth size="lg" loading={status === "loading"}>
            Log In
          </Button>
        </form>

        <p className="auth-card__footer">
          Need an admin account? <Link to="/admin/register">Register</Link>
        </p>
        <p className="auth-card__hint">Demo login: admin@electromart.com / admin123</p>
      </div>
    </div>
  );
};

export default AdminLogin;
