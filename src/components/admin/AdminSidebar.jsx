import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiTag,
  FiUser,
  FiX,
} from "react-icons/fi";
import "./AdminSidebar.css";

const LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/admin/products", label: "Products", icon: FiBox },
  { to: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { to: "/admin/users", label: "Users", icon: FiUsers },
  { to: "/admin/categories", label: "Categories", icon: FiTag },
  { to: "/admin/profile", label: "Profile", icon: FiUser },
];

const AdminSidebar = ({ isOpen, onClose }) => (
  <>
    {isOpen && <div className="admin-sidebar__scrim" onClick={onClose} />}
    <aside className={`admin-sidebar ${isOpen ? "is-open" : ""}`}>
      <div className="admin-sidebar__header">
        <span className="admin-sidebar__logo">Electro<span>Mart</span></span>
        <button className="admin-sidebar__close" onClick={onClose} aria-label="Close menu">
          <FiX />
        </button>
      </div>
      <nav className="admin-sidebar__nav">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `admin-sidebar__link ${isActive ? "is-active" : ""}`}
            onClick={onClose}
          >
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="admin-sidebar__footer">Admin Panel v1.0</div>
    </aside>
  </>
);

export default AdminSidebar;
