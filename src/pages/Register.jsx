import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiUser, FiMail, FiLock, FiPhone } from "react-icons/fi";
import { toast } from "react-toastify";
import { register } from "../redux/slices/authSlice";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import "./Auth.css";

const NAME_REGEX = /^[A-Za-z][A-Za-z ]{1,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;

const validators = {
  name: (value) => {
    if (!value.trim()) return "Full name is required.";
    if (!NAME_REGEX.test(value.trim())) return "Name should only contain letters and spaces.";
    return "";
  },
  email: (value) => {
    if (!value.trim()) return "Email is required.";
    if (!EMAIL_REGEX.test(value.trim())) return "Enter a valid email address.";
    return "";
  },
  phone: (value) => {
    if (!value.trim()) return "Phone number is required.";
    if (!PHONE_REGEX.test(value.trim())) {
      return "Enter a valid 10-digit number starting with 6-9.";
    }
    return "";
  },
  password: (value) => {
    if (!value) return "Password is required.";
    if (!PASSWORD_REGEX.test(value)) {
      return "Min 6 characters, with at least one letter and one number.";
    }
    return "";
  },
};

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({ name: "", email: "", phone: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);

  const handleChange = (field) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: validators[field](value) } : prev));
  };

  const handleBlur = (field) => () => {
    setErrors((prev) => ({ ...prev, [field]: validators[field](form[field]) }));
  };

  const validateForm = () => {
    const nextErrors = {
      name: validators.name(form.name),
      email: validators.email(form.email),
      phone: validators.phone(form.phone),
      password: validators.password(form.password),
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every((msg) => !msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the highlighted fields.");
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

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <Input
            label="Full Name"
            icon={FiUser}
            value={form.name}
            onChange={handleChange("name")}
            onBlur={handleBlur("name")}
            error={errors.name}
            placeholder="Your Name"
            required
          />
          <Input
            label="Email"
            type="email"
            icon={FiMail}
            value={form.email}
            onChange={handleChange("email")}
            onBlur={handleBlur("email")}
            error={errors.email}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Phone Number"
            icon={FiPhone}
            value={form.phone}
            onChange={handleChange("phone")}
            onBlur={handleBlur("phone")}
            error={errors.phone}
            placeholder="98765 43210"
            maxLength={10}
            inputMode="numeric"
            required
          />
          <Input
            label="Password"
            type="password"
            icon={FiLock}
            value={form.password}
            onChange={handleChange("password")}
            onBlur={handleBlur("password")}
            error={errors.password}
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
