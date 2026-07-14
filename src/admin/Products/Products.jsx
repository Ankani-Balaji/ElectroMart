import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  fetchProducts,
  fetchCategories,
  addProduct,
  editProduct,
  removeProduct,
} from "../../redux/slices/productSlice";
import SearchBar from "../../components/common/SearchBar";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { PageLoader } from "../../components/common/Loader";
import ProductFormModal from "./ProductFormModal";
import { formatCurrency } from "../../utils/formatters";
import "./Products.css";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { items, categories, status } = useSelector((state) => state.products);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const filtered = items.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editingProduct) {
        await dispatch(editProduct({ id: editingProduct.id, updates: data })).unwrap();
        toast.success("Product updated");
      } else {
        await dispatch(addProduct(data)).unwrap();
        toast.success("Product added");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) return;
    try {
      await dispatch(removeProduct(product.id)).unwrap();
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err.message || "Could not delete product");
    }
  };

  if (status === "loading" && items.length === 0) return <PageLoader />;

  return (
    <div className="admin-products">
      <div className="admin-products__toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="admin-products__select">
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <Button icon={FiPlus} onClick={openAddModal}>Add Product</Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No products found" message="Try a different search or add a new product." />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-products__cell">
                      <img src={product.images?.[0]} alt={product.title} />
                      <div>
                        <span className="admin-products__title">{product.title}</span>
                        <span className="text-faint">{product.brand}</span>
                      </div>
                    </div>
                  </td>
                  <td className="admin-products__category">{product.category}</td>
                  <td className="mono">{formatCurrency(product.price)}</td>
                  <td>
                    <span className={product.stock === 0 ? "text-danger" : ""}>{product.stock}</span>
                  </td>
                  <td>{product.rating} ★</td>
                  <td>
                    <div className="admin-table__actions">
                      <button onClick={() => openEditModal(product)} aria-label="Edit"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(product)} aria-label="Delete" className="is-danger"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        categories={categories}
        initialData={editingProduct}
        saving={saving}
      />
    </div>
  );
};

export default AdminProducts;
