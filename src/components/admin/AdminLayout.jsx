import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "./AdminLayout.css";

const TITLES = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Products",
  "/admin/orders": "Orders",
  "/admin/users": "Users",
  "/admin/categories": "Categories",
  "/admin/profile": "Profile",
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = TITLES[location.pathname] || "Admin";

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-shell__main">
        <AdminTopbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="admin-shell__content">
          <Outlet />
        </main>
        <footer className="admin-shell__footer">
          © {new Date().getFullYear()} ElectroMart Admin Panel
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
