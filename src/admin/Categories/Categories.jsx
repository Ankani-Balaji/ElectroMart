import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/userService";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import { PageLoader } from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import "./Categories.css";

const EMPTY_FORM = { name: "", slug: "", image: "" };

const AdminCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadCategories = () => {
    setLoading(true);
    getAllCategoriesAdmin()
      .then(setCategories)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({ name: cat.name, slug: cat.slug, image: cat.image });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        icon: editingCategory?.icon || "cable",
        image: form.image || "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400",
      };
      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, payload);
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        toast.success("Category updated");
      } else {
        const created = await createCategory(payload);
        setCategories((prev) => [...prev, created]);
        toast.success("Category added");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await deleteCategory(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err.message || "Could not delete category");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="admin-categories">
      <div className="admin-categories__toolbar">
        <Button icon={FiPlus} onClick={openAddModal}>Add Category</Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="No categories yet" message="Add your first category to organize products." />
      ) : (
        <div className="admin-categories__grid">
          {categories.map((cat) => (
            <div key={cat.id} className="admin-category-card">
              <button
                className="admin-category-card__media"
                onClick={() => navigate(`/products?category=${cat.slug}`)}
                aria-label={`View ${cat.name} products`}
              >
                <img src={cat.image} alt={cat.name} />
              </button>
              <div className="admin-category-card__body">
                <span>{cat.name}</span>
                <div className="admin-table__actions">
                  <button onClick={() => openEditModal(cat)} aria-label="Edit"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(cat)} aria-label="Delete" className="is-danger"><FiTrash2 /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCategory ? "Edit Category" : "Add Category"}>
        <form className="admin-category-form" onSubmit={handleSubmit}>
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated if left blank" />
          <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <div className="product-form__actions">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editingCategory ? "Save Changes" : "Add Category"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategories;
