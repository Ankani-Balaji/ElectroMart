import { useEffect, useState } from "react";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import "./ProductFormModal.css";

const EMPTY_FORM = {
  title: "",
  brand: "",
  category: "",
  price: "",
  originalPrice: "",
  stock: "",
  rating: "4.5",
  description: "",
  images: "",
};

const ProductFormModal = ({ isOpen, onClose, onSubmit, categories, initialData, saving }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        brand: initialData.brand || "",
        category: initialData.category || "",
        price: initialData.price ?? "",
        originalPrice: initialData.originalPrice ?? "",
        stock: initialData.stock ?? "",
        rating: initialData.rating ?? "4.5",
        description: initialData.description || "",
        images: (initialData.images || []).join(", "),
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialData, isOpen]);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = Number(form.price);
    const originalPrice = Number(form.originalPrice) || price;
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const images = form.images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    onSubmit({
      title: form.title,
      brand: form.brand,
      category: form.category,
      price,
      originalPrice,
      discount,
      stock: Number(form.stock),
      rating: Number(form.rating),
      ratingCount: initialData?.ratingCount ?? 0,
      description: form.description,
      specifications: initialData?.specifications || {},
      images: images.length ? images : ["https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800"],
      isFeatured: initialData?.isFeatured ?? false,
      isFlashDeal: initialData?.isFlashDeal ?? false,
      tags: initialData?.tags || [],
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Product" : "Add Product"} size="lg">
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="product-form__grid">
          <Input label="Title" value={form.title} onChange={handleChange("title")} required containerClassName="product-form__full" />
          <Input label="Brand" value={form.brand} onChange={handleChange("brand")} required />
          <div className="field">
            <label className="field__label">Category</label>
            <select className="product-form__select" value={form.category} onChange={handleChange("category")} required>
              <option value="" disabled>Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <Input label="Price (₹)" type="number" value={form.price} onChange={handleChange("price")} required />
          <Input label="Original Price (₹)" type="number" value={form.originalPrice} onChange={handleChange("originalPrice")} />
          <Input label="Stock" type="number" value={form.stock} onChange={handleChange("stock")} required />
          <Input label="Rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange("rating")} />
          <Input
            label="Image URLs (comma separated)"
            value={form.images}
            onChange={handleChange("images")}
            containerClassName="product-form__full"
            placeholder="https://..., https://..."
          />
          <div className="field product-form__full">
            <label className="field__label">Description</label>
            <textarea
              className="product-form__textarea"
              rows={4}
              value={form.description}
              onChange={handleChange("description")}
              required
            />
          </div>
        </div>
        <div className="product-form__actions">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>{initialData ? "Save Changes" : "Add Product"}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
