import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import { logout } from "../../redux/slices/authSlice";
import "./AdminTopbar.css";

const AdminTopbar = ({ onMenuClick, title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/admin/login");
  };

  return (
    <header className="admin-topbar">
      <button className="admin-topbar__menu" onClick={onMenuClick} aria-label="Open menu">
        <FiMenu />
      </button>
      <h1>{title}</h1>
      <div className="admin-topbar__profile">
        <span className="admin-topbar__name">{account?.name}</span>
        <button onClick={handleLogout} aria-label="Logout" className="admin-topbar__logout">
          <FiLogOut />
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;
