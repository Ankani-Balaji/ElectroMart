import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiUser, FiMail, FiLock, FiPhone } from "react-icons/fi";
import { toast } from "react-toastify";
import { register } from "../redux/slices/authSlice";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import "./Auth.css";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    try {
      await dispatch(register(form)).unwrap();
      toast.success("Account created! Welcome to ElectroMart.");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <Link to="/" className="auth-card__logo">Electro<span>Mart</span></Link>
        <h1>Create your account</h1>
        <p className="text-soft">Join ElectroMart for exclusive deals.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Full Name"
            icon={FiUser}
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Your Name"
            required
          />
          <Input
            label="Email"
            type="email"
            icon={FiMail}
            value={form.email}
            onChange={handleChange("email")}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Phone Number"
            icon={FiPhone}
            value={form.phone}
            onChange={handleChange("phone")}
            placeholder="98765 43210"
            required
          />
          <Input
            label="Password"
            type="password"
            icon={FiLock}
            value={form.password}
            onChange={handleChange("password")}
            placeholder="At least 6 characters"
            required
          />
          <Button type="submit" fullWidth size="lg" loading={status === "loading"}>
            Create Account
          </Button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
