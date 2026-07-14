import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiDollarSign, FiShoppingBag, FiBox, FiUsers } from "react-icons/fi";
import { getDashboardStats } from "../../services/adminService";
import StatCard from "../../components/admin/StatCard";
import RevenueChart from "../../components/admin/RevenueChart";
import { PageLoader } from "../../components/common/Loader";
import { formatCurrency, formatDate } from "../../utils/formatters";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (!stats) return null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-stats">
        <StatCard icon={FiDollarSign} label="Total Revenue" value={formatCurrency(stats.totals.revenue)} tone="primary" />
        <StatCard icon={FiShoppingBag} label="Total Orders" value={stats.totals.orders} tone="success" />
        <StatCard icon={FiBox} label="Total Products" value={stats.totals.products} tone="warning" />
        <StatCard icon={FiUsers} label="Total Users" value={stats.totals.users} tone="accent" />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <h3>Revenue Overview</h3>
          <RevenueChart data={stats.revenueByMonth} />
        </div>

        <div className="dashboard-panel dashboard-panel--orders">
          <div className="dashboard-panel__header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders">View all</Link>
          </div>
          <div className="dashboard-orders">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="dashboard-orders__row">
                <div>
                  <span className="mono">#{order.id}</span>
                  <span className="text-faint"> · {formatDate(order.createdAt)}</span>
                </div>
                <span className="mono">{formatCurrency(order.totalAmount)}</span>
                <span className={`order-status order-status--${order.status === "Delivered" ? "success" : order.status === "Cancelled" ? "danger" : "primary"}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
