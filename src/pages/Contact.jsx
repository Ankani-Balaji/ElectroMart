import { useState } from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { toast } from "react-toastify";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container contact-page">
      <div className="section-heading">
        <h1>Get in Touch</h1>
        <p className="text-soft">Questions about an order, a product, or a partnership? We're here.</p>
      </div>

      <div className="contact-page__layout">
        <div className="contact-info">
          <div className="contact-info__item">
            <FiMail />
            <div>
              <strong>Email</strong>
              <span>support@electromart.com</span>
            </div>
          </div>
          <div className="contact-info__item">
            <FiPhone />
            <div>
              <strong>Phone</strong>
              <span>+91 1800-123-4567</span>
            </div>
          </div>
          <div className="contact-info__item">
            <FiMapPin />
            <div>
              <strong>Office</strong>
              <span>HITEC City, Hyderabad, Telangana</span>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <Input
            label="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <div className="field">
            <label className="field__label">Message</label>
            <textarea
              className="contact-form__textarea"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="How can we help?"
              required
            />
          </div>
          <Button type="submit" size="lg">Send Message</Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
