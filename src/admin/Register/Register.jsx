import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiUser, FiMail, FiLock, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";
import { adminRegister } from "../../redux/slices/authSlice";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import "../../pages/Auth.css";

const AdminRegister = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      await dispatch(adminRegister(form)).unwrap();
      toast.success("Admin account created!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <Link to="/" className="auth-card__logo">Electro<span>Mart</span></Link>
        <h1><FiShield style={{ verticalAlign: "-3px", marginRight: 8 }} />Admin Registration</h1>
        <p className="text-soft">Create an administrator account.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input label="Full Name" icon={FiUser} value={form.name} onChange={handleChange("name")} placeholder="Admin Name" required />
          <Input label="Email" type="email" icon={FiMail} value={form.email} onChange={handleChange("email")} placeholder="admin@electromart.com" required />
          <Input label="Password" type="password" icon={FiLock} value={form.password} onChange={handleChange("password")}  placeholder="••••••••" required />
          <Button type="submit" fullWidth size="lg" loading={status === "loading"}>
            Create Admin Account
          </Button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/admin/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
