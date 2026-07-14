import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiUser, FiMail, FiPhone, FiLock, FiLogOut, FiMapPin } from "react-icons/fi";
import { toast } from "react-toastify";
import { updateProfile, logout } from "../redux/slices/authSlice";
import { changeUserPassword } from "../services/authService";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: account?.name || "", phone: account?.phone || "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await dispatch(updateProfile({ userId: account.id, updates: form })).unwrap();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message || "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.next.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    setSavingPassword(true);
    try {
      await changeUserPassword(account.id, passwordForm.current, passwordForm.next);
      toast.success("Password changed successfully");
      setPasswordForm({ current: "", next: "" });
    } catch (err) {
      toast.error(err.message || "Could not change password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="container profile-page">
      <div className="profile-header">
        <img src={account?.avatar} alt={account?.name} />
        <div>
          <h1>{account?.name}</h1>
          <p className="text-soft">{account?.email}</p>
        </div>
        <Button variant="outline" icon={FiLogOut} onClick={handleLogout}>Logout</Button>
      </div>

      <div className="profile-grid">
        <form className="profile-card" onSubmit={handleSaveProfile}>
          <h3><FiUser /> Personal Information</h3>
          <Input label="Full Name" icon={FiUser} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" icon={FiMail} value={account?.email} disabled />
          <Input label="Phone" icon={FiPhone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Button type="submit" loading={savingProfile}>Save Changes</Button>
        </form>

        <form className="profile-card" onSubmit={handleChangePassword}>
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
          <Button type="submit" variant="secondary" loading={savingPassword}>Update Password</Button>
        </form>

        <div className="profile-card">
          <h3><FiMapPin /> Saved Addresses</h3>
          {account?.addresses?.length ? (
            <div className="profile-addresses">
              {account.addresses.map((addr) => (
                <div key={addr.id} className="profile-address">
                  <strong>{addr.label}</strong>
                  <span>{addr.line1}, {addr.city}, {addr.state} - {addr.pincode}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-soft">No saved addresses yet. Add one during checkout.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
