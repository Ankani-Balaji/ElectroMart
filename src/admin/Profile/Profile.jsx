import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiLock, FiLogOut, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";
import { logout } from "../../redux/slices/authSlice";
import { changeAdminPassword } from "../../services/authService";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import "./Profile.css";

const AdminProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account } = useSelector((state) => state.auth);

  const [passwordForm, setPasswordForm] = useState({ current: "", next: "" });
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.next.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    setSaving(true);
    try {
      await changeAdminPassword(account.id, passwordForm.current, passwordForm.next);
      toast.success("Password changed successfully");
      setPasswordForm({ current: "", next: "" });
    } catch (err) {
      toast.error(err.message || "Could not change password");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/admin/login");
  };

  return (
    <div className="admin-profile">
      <div className="admin-profile__header">
        <div>
          <h2>{account?.name}</h2>
          <p className="text-soft"><FiMail /> {account?.email}</p>
        </div>
        <Button variant="outline" icon={FiLogOut} onClick={handleLogout}>Logout</Button>
      </div>

      <form className="admin-profile__card" onSubmit={handleChangePassword}>
        <h3><FiLock /> Change Password</h3>
        <Input
          label="Current Password"
          type="password"
          icon={FiLock}
          value={passwordForm.current}
          onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
          required
        />
        <Input
          label="New Password"
          type="password"
          icon={FiLock}
          value={passwordForm.next}
          onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
          required
        />
        <Button type="submit" loading={saving}>Update Password</Button>
      </form>
    </div>
  );
};

export default AdminProfile;
