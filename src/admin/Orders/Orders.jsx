import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { fetchAllOrders, changeOrderStatus, removeOrder } from "../../redux/slices/orderSlice";
import EmptyState from "../../components/common/EmptyState";
import { PageLoader } from "../../components/common/Loader";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { ORDER_STATUSES } from "../../utils/constants";
import "./Orders.css";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = async (order, newStatus) => {
    try {
      await dispatch(changeOrderStatus({ id: order.id, status: newStatus })).unwrap();
      toast.success(`Order #${order.id} marked as ${newStatus}`);
    } catch (err) {
      toast.error(err.message || "Could not update status");
    }
  };

  const handleDelete = async (order) => {
    if (!window.confirm(`Delete order #${order.id}? This cannot be undone.`)) return;
    try {
      await dispatch(removeOrder(order.id)).unwrap();
      toast.success("Order deleted");
    } catch (err) {
      toast.error(err.message || "Could not delete order");
    }
  };

  if (status === "loading" && items.length === 0) return <PageLoader />;

  if (items.length === 0) {
    return <EmptyState title="No orders yet" message="Orders placed by customers will appear here." />;
  }

  return (
    <div className="admin-orders">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((order) => (
              <tr key={order.id}>
                <td className="mono">#{order.id}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</td>
                <td className="mono">{formatCurrency(order.totalAmount)}</td>
                <td className="admin-orders__payment">{order.paymentMethod === "cod" ? "COD" : "Online"}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                    className="admin-orders__status-select"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="admin-table__actions">
                    <button onClick={() => handleDelete(order)} aria-label="Delete" className="is-danger">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
