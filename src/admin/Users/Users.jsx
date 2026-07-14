import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { getAllUsers, deleteUser } from "../../services/userService";
import EmptyState from "../../components/common/EmptyState";
import { PageLoader } from "../../components/common/Loader";
import { formatDate } from "../../utils/formatters";
import "./Users.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err.message || "Could not delete user");
    }
  };

  if (loading) return <PageLoader />;

  if (users.length === 0) {
    return <EmptyState title="No users yet" message="Registered customers will appear here." />;
  }

  return (
    <div className="admin-users">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="admin-users__cell">
                    <img src={user.avatar} alt={user.name} />
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || "—"}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <div className="admin-table__actions">
                    <button onClick={() => handleDelete(user)} aria-label="Delete" className="is-danger">
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

export default AdminUsers;
